

// import React, { useState, useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import './App.css'; 
// import axios from 'axios';
// import L from 'leaflet'; // Import Leaflet library for map bounds calculation

// // --- Configuration ---
// const API_BASE_URL = "http://127.0.0.1:5000"; // The address of your Flask backend
// const UMBC_CENTER = [39.255, -76.71]; // Coordinates for UMBC campus

// // --- Main Application Component ---
// function App() {
//   // User and data state
//   const [currentUser, setCurrentUser] = useState(null);
//   const [emailInput, setEmailInput] = useState("");
//   const [allLocations, setAllLocations] = useState([]);
//   const [favoriteRoutes, setFavoriteRoutes] = useState([]);

//   // Search and selection state
//   const [startLocation, setStartLocation] = useState(null);
//   const [endLocation, setEndLocation] = useState(null);
//   const [startSearch, setStartSearch] = useState("");
//   const [endSearch, setEndSearch] = useState("");
//   const [startResults, setStartResults] = useState([]);
//   const [endResults, setEndResults] = useState([]);
  
//   // Map and loading state
//   const [path, setPath] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const mapRef = useRef(null); // Use a ref to hold the map instance

//   // --- Data Fetching on Load ---
//   useEffect(() => {
//     // Fetch all locations for the search bars when the app loads
//     axios.get(`${API_BASE_URL}/api/locations`)
//       .then(response => setAllLocations(response.data))
//       .catch(error => console.error("Error fetching locations:", error));
//   }, []);

//   // --- Auto-zoom map effect ---
//   useEffect(() => {
//     const map = mapRef.current;
//     if (map && path.length > 0) {
//       // Create a Leaflet LatLngBounds object to fit the polyline
//       const polylineBounds = L.polyline(path).getBounds();
//       // Tell the map to fit those bounds with some padding
//       map.fitBounds(polylineBounds, { padding: [50, 50] });
//     }
//   }, [path]); // This effect runs whenever 'path' changes

//   // --- User and Favorites API Functions ---
//   const handleLogin = () => {
//     if (!emailInput) {
//       alert("Please enter an email.");
//       return;
//     }
//     axios.get(`${API_BASE_URL}/api/users/${emailInput}`)
//       .then(response => {
//         // User found, log them in
//         setCurrentUser(response.data);
//         fetchFavoriteRoutes(response.data.id);
//       })
//       .catch(error => {
//         // If user not found (404), create a new one
//         if (error.response && error.response.status === 404) {
//           const name = emailInput.split('@')[0]; // Simple name from email
//           axios.post(`${API_BASE_URL}/api/users`, { email: emailInput, name })
//             .then(response => {
//               setCurrentUser(response.data); // Log in the new user
//               setFavoriteRoutes([]); // New user has no favorites yet
//             })
//             .catch(err => console.error("Error creating user:", err));
//         } else {
//           console.error("Error fetching user:", error);
//           alert("Could not log in. Make sure the backend server is running.");
//         }
//       });
//   };

//   const fetchFavoriteRoutes = (userId) => {
//     axios.get(`${API_BASE_URL}/api/users/${userId}/favorites`)
//       .then(response => setFavoriteRoutes(response.data || []))
//       .catch(error => console.error("Error fetching favorites:", error));
//   };

//   const handleSaveRoute = () => {
//     if (!currentUser || !startLocation || !endLocation || path.length === 0) return;

//     const nickname = prompt("Enter a nickname for this route (e.g., 'Class to Library'):");
//     if (nickname === null) return; // User cancelled prompt

//     const newFavorite = {
//       user_id: currentUser.id,
//       start_location: startLocation.name,
//       end_location: endLocation.name,
//       path_coordinates: path, // Send the coordinates
//       nickname: nickname || `Route from ${startLocation.name} to ${endLocation.name}`
//     };

//     axios.post(`${API_BASE_URL}/api/favorites`, newFavorite)
//       .then(() => {
//         alert("Route saved successfully!");
//         fetchFavoriteRoutes(currentUser.id); // Refresh favorites list
//       })
//       .catch(error => console.error("Error saving route:", error));
//   };
  
//   const handleDeleteFavorite = (favoriteId) => {
//     if(!window.confirm("Are you sure you want to delete this favorite route?")) return;

//     axios.delete(`${API_BASE_URL}/api/favorites/${favoriteId}`)
//     .then(() => {
//         alert("Favorite deleted.");
//         fetchFavoriteRoutes(currentUser.id); // Refresh list
//     })
//     .catch(error => console.error("Error deleting favorite:", error));
//   };


//   // --- Search and Pathfinding Functions ---
//   const handleSearchChange = (e, type) => {
//     const query = e.target.value;
//     const setter = type === 'start' ? setStartSearch : setEndSearch;
//     const resultsSetter = type === 'start' ? setStartResults : setEndResults;
//     setter(query);
//     resultsSetter(query ? allLocations.filter(l => l.name.toLowerCase().includes(query.toLowerCase())) : []);
//   };

//   const handleSelectLocation = (location, type) => {
//     if (type === 'start') {
//       setStartLocation(location);
//       setStartSearch(location.name);
//       setStartResults([]);
//     } else {
//       setEndLocation(location);
//       setEndSearch(location.name);
//       setEndResults([]);
//     }
//   };

//   const handleFindRoute = () => {
//     if (!startLocation || !endLocation) return;
//     setLoading(true);
//     setPath([]);
//     axios.get(`${API_BASE_URL}/api/path?start=${startLocation.name}&end=${endLocation.name}`)
//       .then(response => {
//         if (response.data.path && response.data.path.length > 0) {
//           setPath(response.data.path);
//         } else {
//           alert("No accessible path found.");
//         }
//       })
//       .catch(error => console.error("Error fetching path:", error))
//       .finally(() => setLoading(false));
//   };

//   const loadFavoriteRoute = (favorite) => {
//     const start = allLocations.find(loc => loc.name === favorite.start_location);
//     const end = allLocations.find(loc => loc.name === favorite.end_location);

//     if (start && end) {
//         handleSelectLocation(start, 'start');
//         handleSelectLocation(end, 'end');
//         setPath(favorite.path_coordinates);
//     } else {
//         alert("Could not load route. Location data may have changed.");
//     }
//   };

//   // --- Render Login View if no user ---
//   if (!currentUser) {
//     return (
//       <div className="login-container">
//         <div className="login-box">
//           <h1>UMBC Accessibility GPS</h1>
//           <p>Please log in to continue</p>
//           <input
//             type="email"
//             value={emailInput}
//             onChange={(e) => setEmailInput(e.target.value)}
//             placeholder="Enter your email"
//             className="login-input"
//           />
//           <button onClick={handleLogin} className="login-button">Login or Sign Up</button>
//         </div>
//       </div>
//     );
//   }

//   // --- Render Main Application View ---
//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>UMBC Accessibility GPS System</h1>
//         <div className="user-info">Logged in as: {currentUser.email}</div>
//       </header>
      
//       <main className="main-content">
//         <div className="map-and-controls-section">
//           <div className="controls-container">
//             <div className="search-wrapper">
//               <input type="text" placeholder="Start Location" value={startSearch} onChange={(e) => handleSearchChange(e, 'start')} className="search-input"/>
//               {startResults.length > 0 && <div className="results-container">{startResults.map(loc => (<div key={loc.id} className="result-item" onClick={() => handleSelectLocation(loc, 'start')}>{loc.name}</div>))}</div>}
//             </div>
//             <div className="search-wrapper">
//               <input type="text" placeholder="Destination" value={endSearch} onChange={(e) => handleSearchChange(e, 'end')} className="search-input"/>
//               {endResults.length > 0 && <div className="results-container">{endResults.map(loc => (<div key={loc.id} className="result-item" onClick={() => handleSelectLocation(loc, 'end')}>{loc.name}</div>))}</div>}
//             </div>
//             <button onClick={handleFindRoute} className="find-route-button" disabled={loading}>{loading ? 'Calculating...' : 'Find Route'}</button>
//             {path.length > 0 && (
//               <button onClick={handleSaveRoute} className="save-route-button">Save to Favorites</button>
//             )}
//           </div>

//           <div className="map-wrapper">
//             <MapContainer center={UMBC_CENTER} zoom={16} scrollWheelZoom={true} className="leaflet-container" ref={mapRef}>
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               {path.length > 0 && <Polyline positions={path} color="#007bff" weight={6} />}
//             </MapContainer>
//           </div>
//         </div>

//         <div className="favorites-section">
//           <h2>My Favorite Routes</h2>
//           <div className="favorites-list">
//             {favoriteRoutes.length > 0 ? (
//               favoriteRoutes.map(fav => (
//                 <div key={fav.id} className="favorite-item">
//                   <div className="favorite-info" onClick={() => loadFavoriteRoute(fav)}>
//                     <span className="favorite-nickname">{fav.nickname || "Saved Route"}</span>
//                     <span className="favorite-details">{fav.start_location} to {fav.end_location}</span>
//                   </div>
//                   <button className="delete-favorite-button" onClick={() => handleDeleteFavorite(fav.id)}>✕</button>
//                 </div>
//               ))
//             ) : (
//               <p className="no-favorites-message">You have no saved routes yet.</p>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;
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

// --- NEW: Login Modal Component ---
function LoginModal({ onLogin, onDismiss }) {
  const [emailInput, setEmailInput] = useState("");

  const handleLogin = () => {
    if (!emailInput) return;
    onLogin(emailInput);
  };

  // This handles the "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Login or Sign Up</h2>
        <p>Enter your email to save and view favorite routes.</p>
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyDown={handleKeyDown} // ⭐️ ADDED "ENTER" KEY SUPPORT ⭐️
          placeholder="Enter your email"
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">Login / Sign Up</button>
      </div>
    </div>
  );
}

// --- NEW: Text Directions Component (for Debugging) ---
function TextDirections({ pathNames }) {
  if (!pathNames || pathNames.length === 0) {
    return null; // Don't render anything if there's no path
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

  // --- UPDATED: User/Login State ---
  const [userMode, setUserMode] = useState('guest'); // 'guest', 'login', 'loggedIn'
  const [currentUser, setCurrentUser] = useState(null);
  
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
  const [pathNames, setPathNames] = useState([]); // ⭐️ NEW: For text directions
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
  const handleLogin = (email) => {
    axios.get(`${API_BASE_URL}/api/users/${email}`)
      .then(response => {
        setCurrentUser(response.data);
        fetchFavoriteRoutes(response.data.id);
        setUserMode('loggedIn'); // Close modal and set mode to logged in
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          const name = email.split('@')[0]; 
          axios.post(`${API_BASE_URL}/api/users`, { email: email, name })
            .then(response => {
              setCurrentUser(response.data);
              setFavoriteRoutes([]); 
              setUserMode('loggedIn'); // Close modal and set mode to logged in
            })
            .catch(err => console.error("Error creating user:", err));
        } else {
          console.error("Error fetching user:", error);
          setNotification({ message: "Could not log in. Check backend.", type: "error" });
        }
      });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setFavoriteRoutes([]);
    setUserMode('guest');
  };

  const fetchFavoriteRoutes = (userId) => {
    axios.get(`${API_BASE_URL}/api/users/${userId}/favorites`)
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
      user_id: currentUser.id,
      start_location: startLocation.name,
      end_location: endLocation.name,
      path_coordinates: path, 
      nickname: nickname || `Route from ${startLocation.name} to ${endLocation.name}`
    };

    axios.post(`${API_BASE_URL}/api/favorites`, newFavorite)
      .then(() => {
        setNotification({ message: "Route saved successfully!", type: "success" });
        fetchFavoriteRoutes(currentUser.id); 
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
        fetchFavoriteRoutes(currentUser.id); 
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

  // REFACTORED: This is the core logic, callable from anywhere
  const findRoute = (startName, endName) => {
    setLoading(true);
    setPath([]);
    setPathNames([]); // Clear old path names

    axios.get(`${API_BASE_URL}/api/path?start=${startName}&end=${endName}`)
      .then(response => {
        if (response.data.path && response.data.path.length > 0) {
          setPath(response.data.path);
          setPathNames(response.data.names); // ⭐️ SET THE NAMES
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

  // This is the click handler for the button
  const handleFindRouteClick = () => {
    if (!startLocation || !endLocation) {
      setNotification({ message: "Please select both a start and end location.", type: "error" });
      return;
    }
    findRoute(startLocation.name, endLocation.name);
  };

  // REFACTORED: This now calls the main findRoute function
  const loadFavoriteRoute = (favorite) => {
    const start = allLocations.find(loc => loc.name === favorite.start_location);
    const end = allLocations.find(loc => loc.name === favorite.end_location);
    if (start && end) {
        handleSelectLocation(start, 'start');
        handleSelectLocation(end, 'end');
        
        // This will find the route and set both path and pathNames
        findRoute(start.name, end.name);
    } else {
        setNotification({ message: "Could not load route. Location data may have changed.", type: "error" });
    }
  };
  
  const handleClearRoute = () => {
    setPath([]);
    setPathNames([]); // ⭐️ Clear text directions
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
      {/* --- NEW: Conditional Login Modal --- */}
      {userMode === 'login' && <LoginModal onLogin={handleLogin} onDismiss={() => setUserMode('guest')} />}
      
      {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
      
      <header className="app-header">
        <h1>UMBC Accessibility GPS System</h1>
        {/* --- UPDATED: Login/Logout Button --- */}
        <div className="user-info">
          {userMode === 'loggedIn' ? (
            <>
              Logged in as: {currentUser.email}
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
                {/* --- UPDATED: Save button now checks for login --- */}
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
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

        {/* --- UPDATED: Favorites section now depends on login --- */}
        <div className={`favorites-section ${userMode !== 'loggedIn' ? 'favorites-section-guest' : ''}`}>
          {/* --- NEW: Text Directions Debugger --- */}
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