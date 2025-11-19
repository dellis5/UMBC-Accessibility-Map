import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css'; 
import axios from 'axios';
import L from 'leaflet';

// --- FIX for broken Leaflet icons in React ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- End of FIX ---

// --- Configuration ---
const API_BASE_URL = "http://127.0.0.1:5000"; 
const UMBC_CENTER = [39.255, -76.71]; 

// --- Notification Component ---
function Notification({ message, type, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 3000); 
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`notification-bar ${type}`}>
      {message}
      <button onClick={onDismiss} className="notification-dismiss">✕</button>
    </div>
  );
}

// --- NEW: Login/Sign Up Modal Component ---
function LoginModal({ onDismiss, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form from reloading page
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
    setError('');
    axios.post(`${API_BASE_URL}/api/login`, { username, password })
      .then(response => {
        onLoginSuccess(response.data.user); // Pass the user object up
      })
      .catch(err => {
        setError(err.response?.data?.error || "Invalid username or password");
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent form from reloading page
    if (!username || !password || !email || !name) {
      setError("All fields are required for signup.");
      return;
    }
    setError('');
    axios.post(`${API_BASE_URL}/api/users`, { username, email, name, password })
      .then(response => {
        // Automatically log them in after successful signup
        onLoginSuccess(response.data);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Could not create account");
      });
  };

  // Handle 'Enter' key press in any field
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (mode === 'login') {
        handleLogin(e);
      } else {
        handleSignUp(e);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={mode === 'login' ? handleLogin : handleSignUp}>
          {error && <p className="modal-error">{error}</p>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Username"
            className="login-input"
          />
          {mode === 'signup' && (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Email (e.g., user@umbc.edu)"
                className="login-input"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your Name"
                className="login-input"
              />
            </>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Password"
            className="login-input"
          />
          <button type="submit" className="login-button">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="modal-toggle-button">
          {mode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

// --- Text Directions Component ---
function TextDirections({ pathNames }) {
  if (!pathNames || pathNames.length === 0) {
    return null;
  }
  return (
    <div className="text-directions-container">
      <h3>Text-Based Route</h3>
      <ol className="text-directions-list">
        {pathNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ol>
    </div>
  );
}

// --- Main Application Component ---
function App() {
  const [notification, setNotification] = useState(null);
  const [userMode, setUserMode] = useState('guest'); // 'guest', 'login', 'loggedIn'
  const [currentUser, setCurrentUser] = useState(null); // Will store the user object { username, email, name, ... }
  
  const [allLocations, setAllLocations] = useState([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);

  // Search and selection state
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [startSearch, setStartSearch] = useState("");
  const [endSearch, setEndSearch] = useState("");
  const [startResults, setStartResults] = useState([]);
  const [endResults, setEndResults] = useState([]);
  
  // Map and loading state
  const [path, setPath] = useState([]);
  const [pathNames, setPathNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null); 

  // --- Data Fetching on Load ---
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/locations`)
      .then(response => setAllLocations(response.data))
      .catch(error => {
        console.error("Error fetching locations:", error);
        setNotification({ message: "Cannot connect to backend server.", type: "error" });
      });
  }, []);

  // --- Auto-zoom map effect for path ---
  useEffect(() => {
    const map = mapRef.current;
    if (map && path.length > 0) {
      const polylineBounds = L.polyline(path).getBounds();
      map.fitBounds(polylineBounds, { padding: [50, 50] });
    }
  }, [path]); 

  // --- User and Favorites API Functions ---
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    fetchFavoriteRoutes(user.username); // Fetch favorites using USERNAME
    setUserMode('loggedIn');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setFavoriteRoutes([]);
    setUserMode('guest');
  };

  const fetchFavoriteRoutes = (username) => {
    axios.get(`${API_BASE_URL}/api/users/${username}/favorites`)
      .then(response => setFavoriteRoutes(response.data || []))
      .catch(error => console.error("Error fetching favorites:", error));
  };

  const handleSaveRoute = () => {
    if (!currentUser || !startLocation || !endLocation || path.length === 0) {
      setNotification({ message: "You must be logged in to save a route.", type: "error" });
      return;
    }
    const nickname = prompt("Enter a nickname for this route (e.g., 'Class to Library'):");
    if (nickname === null) return; 

    const newFavorite = {
      username: currentUser.username, // Use USERNAME
      start_location: startLocation.name,
      end_location: endLocation.name,
      path_coordinates: path, 
      nickname: nickname || `Route from ${startLocation.name} to ${endLocation.name}`
    };

    axios.post(`${API_BASE_URL}/api/favorites`, newFavorite)
      .then(() => {
        setNotification({ message: "Route saved successfully!", type: "success" });
        fetchFavoriteRoutes(currentUser.username); 
      })
      .catch(error => {
        setNotification({ message: "Failed to save route.", type: "error" });
      });
  };
  
  const handleDeleteFavorite = (favoriteId) => {
    if(!window.confirm("Are you sure you want to delete this favorite route?")) return;
    axios.delete(`${API_BASE_URL}/api/favorites/${favoriteId}`)
    .then(() => {
        setNotification({ message: "Favorite deleted.", type: "success" });
        fetchFavoriteRoutes(currentUser.username); 
    })
    .catch(error => {
      setNotification({ message: "Failed to delete route.", type: "error" });
    });
  };

  // --- Search and Pathfinding Functions ---
  const handleSearchChange = (e, type) => {
    const query = e.target.value;
    const setter = type === 'start' ? setStartSearch : setEndSearch;
    const resultsSetter = type === 'start' ? setStartResults : setEndResults;
    setter(query);
    resultsSetter(query ? allLocations.filter(l => l.name.toLowerCase().includes(query.toLowerCase())) : []);
  };

  const handleSelectLocation = (location, type) => {
    if (type === 'start') {
      setStartLocation(location);
      setStartSearch(location.name);
      setStartResults([]);
    } else {
      setEndLocation(location);
      setEndSearch(location.name);
      setEndResults([]);
    }
    
    const map = mapRef.current;
    if (map && location.coords && (location.coords[0] !== 0 || location.coords[1] !== 0)) {
      map.flyTo(location.coords, 17);
    }
  };

  const findRoute = (startName, endName) => {
    setLoading(true);
    setPath([]);
    setPathNames([]); 

    const encodedStart = encodeURIComponent(startName);
    const encodedEnd = encodeURIComponent(endName);
    axios.get(`${API_BASE_URL}/api/path?start=${encodedStart}&end=${encodedEnd}`)
      .then(response => {
        if (response.data.path && response.data.path.length > 0) {
          setPath(response.data.path);
          setPathNames(response.data.names); 
        } else {
          setNotification({ message: "No accessible path found.", type: "error" });
        }
      })
      .catch(error => {
        console.error("Error fetching path:", error);
        setNotification({ message: "Error calculating route.", type: "error" });
      })
      .finally(() => setLoading(false));
  };

  const handleFindRouteClick = () => {
    if (!startLocation || !endLocation) {
      setNotification({ message: "Please select both a start and end location.", type: "error" });
      return;
    }
    findRoute(startLocation.name, endLocation.name);
  };

  const loadFavoriteRoute = (favorite) => {
    const start = allLocations.find(loc => loc.name === favorite.start_location);
    const end = allLocations.find(loc => loc.name === favorite.end_location);
    if (start && end) {
        handleSelectLocation(start, 'start');
        handleSelectLocation(end, 'end');
        findRoute(start.name, end.name);
    } else {
        setNotification({ message: "Could not load route. Location data may have changed.", type: "error" });
    }
  };
  
  const handleClearRoute = () => {
    setPath([]);
    setPathNames([]);
    setStartLocation(null);
    setEndLocation(null);
    setStartSearch("");
    setEndSearch("");
    setStartResults([]);
    setEndResults([]);
    const map = mapRef.current;
    if (map) {
      map.flyTo(UMBC_CENTER, 16); 
    }
  };

  // --- Render Main Application View ---
  return (
    <div className="app-container">
      {userMode === 'login' && <LoginModal onLoginSuccess={handleLoginSuccess} onDismiss={() => setUserMode('guest')} />}
      
      {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
      
      <header className="app-header">
        <h1>UMBC Accessibility GPS System</h1>
        <div className="user-info">
          {userMode === 'loggedIn' ? (
            <>
              Welcome, {currentUser.name}! 
              <button onClick={handleLogout} className="header-button">Logout</button>
            </>
          ) : (
            <button onClick={() => setUserMode('login')} className="header-button">Login / Sign Up</button>
          )}
        </div>
      </header>
      
      <main className="main-content">
        <div className="map-and-controls-section">
          <div className="controls-container">
            <div className="search-wrapper">
              <input type="text" placeholder="Start Location" value={startSearch} onChange={(e) => handleSearchChange(e, 'start')} className="search-input"/>
              {startResults.length > 0 && <div className="results-container">{startResults.map(loc => (<div key={loc.id} className="result-item" onClick={() => handleSelectLocation(loc, 'start')}>{loc.name}</div>))}</div>}
            </div>
            <div className="search-wrapper">
              <input type="text" placeholder="Destination" value={endSearch} onChange={(e) => handleSearchChange(e, 'end')} className="search-input"/>
              {endResults.length > 0 && <div className="results-container">{endResults.map(loc => (<div key={loc.id} className="result-item" onClick={() => handleSelectLocation(loc, 'end')}>{loc.name}</div>))}</div>}
            </div>
            <button onClick={handleFindRouteClick} className="find-route-button" disabled={loading}>{loading ? 'Calculating...' : 'Find Route'}</button>
            {path.length > 0 && (
              <>
                {userMode === 'loggedIn' && (
                  <button onClick={handleSaveRoute} className="save-route-button">Save</button>
                )}
                <button onClick={handleClearRoute} className="clear-route-button">Clear</button>
              </>
            )}
          </div>

          <div className="map-wrapper">
            <MapContainer center={UMBC_CENTER} zoom={16} scrollWheelZoom={true} className="leaflet-container" ref={mapRef}>
              <TileLayer
                attribution='&copy; <a href="httpsS://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {startLocation && startLocation.coords && (startLocation.coords[0] !== 0 || startLocation.coords[1] !== 0) && (
                <Marker position={startLocation.coords}>
                  <Popup>Start: {startLocation.name}</Popup>
                </Marker>
              )}
              {endLocation && endLocation.coords && (endLocation.coords[0] !== 0 || endLocation.coords[1] !== 0) && (
                <Marker position={endLocation.coords}>
                  <Popup>End: {endLocation.name}</Popup>
                </Marker>
              )}
              {path.length > 0 && <Polyline positions={path} color="#007bff" weight={6} />}
            </MapContainer>
          </div>
        </div>

        <div className={`favorites-section ${userMode !== 'loggedIn' ? 'favorites-section-guest' : ''}`}>
          <TextDirections pathNames={pathNames} />
          
          <h2>My Favorite Routes</h2>
          {userMode !== 'loggedIn' ? (
            <div className="favorites-guest-message">
              <p>Please log in to save and view your favorite routes.</p>
              <button onClick={() => setUserMode('login')} className="login-button">Login</button>
            </div>
          ) : (
            <div className="favorites-list">
              {favoriteRoutes.length > 0 ? (
                favoriteRoutes.map(fav => (
                  <div key={fav.id} className="favorite-item">
                    <div className="favorite-info" onClick={() => loadFavoriteRoute(fav)}>
                      <span className="favorite-nickname">{fav.nickname || "Saved Route"}</span>
                      <span className="favorite-details">{fav.start_location} to {fav.end_location}</span>
                    </div>
                    <button className="delete-favorite-button" onClick={() => handleDeleteFavorite(fav.id)}>✕</button>
                  </div>
                ))
              ) : (
                <p className="no-favorites-message">You have no saved routes yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;