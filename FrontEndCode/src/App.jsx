
// import React, { useState, useEffect } from 'react';
// import { MapContainer, ImageOverlay, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import './App.css'; 
// import axios from 'axios'; // Import axios for making API calls

// // The address of your running Flask backend server
// const API_BASE_URL = "http://127.0.0.1:5000"; 

// function App() {
//   // State for all locations fetched from the backend
//   const [allLocations, setAllLocations] = useState([]); 

//   // State for user selections and search
//   const [startLocation, setStartLocation] = useState(null);
//   const [endLocation, setEndLocation] = useState(null);
//   const [startSearch, setStartSearch] = useState("");
//   const [endSearch, setEndSearch] = useState("");
//   const [startResults, setStartResults] = useState([]);
//   const [endResults, setEndResults] = useState([]);
  
//   // State for the final path and loading indicator
//   const [path, setPath] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // --- Step 1: Fetch all locations from the backend when the app first loads ---
//   useEffect(() => {
//     // This function runs once when the component loads
//     axios.get(`${API_BASE_URL}/api/locations`)
//       .then(response => {
//         setAllLocations(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching locations:", error);
//         alert("Could not connect to the backend server. Make sure it's running!");
//       });
//   }, []); // The empty array [] means this runs only once

//   // --- Step 2: Handle search and selection (uses live data) ---
//   const handleSearchChange = (e, type) => {
//     const query = e.target.value;
//     const setter = type === 'start' ? setStartSearch : setEndSearch;
//     const resultsSetter = type === 'start' ? setStartResults : setEndResults;

//     setter(query);
//     if (query.length > 0) {
//       // Filter locations from the list we fetched from the backend
//       const filtered = allLocations.filter(loc =>
//         loc.name.toLowerCase().includes(query.toLowerCase())
//       );
//       resultsSetter(filtered);
//     } else {
//       resultsSetter([]);
//     }
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

//   // --- Step 3: Call the backend to find the route! ---
//   const handleFindRoute = () => {
//     if (!startLocation || !endLocation) {
//       alert("Please select a valid starting and ending location from the search results.");
//       return;
//     }
//     setLoading(true); // Show a loading message on the button
//     setPath([]); // Clear any old path from the map

//     // Make the API call to your backend's pathfinding endpoint
//     axios.get(`${API_BASE_URL}/api/path?start=${startLocation.name}&end=${endLocation.name}`)
//       .then(response => {
//         if (response.data.path && response.data.path.length > 0) {
//           setPath(response.data.path); // Update the map with the new path
//         } else {
//           alert("No accessible path could be found between these locations.");
//         }
//       })
//       .catch(error => {
//         console.error("Error fetching path:", error);
//         alert("An error occurred while calculating the route.");
//       })
//       .finally(() => {
//         setLoading(false); // Hide the loading message
//       });
//   };

//   // Define the map boundaries
//   const mapBounds = [[39.250, -76.718], [39.260, -76.705]];

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>UMBC Accessibility GPS System</h1>
//       </header>

//       <div className="controls-container">
//         <div className="search-wrapper">
//           <input type="text" placeholder="Select a Starting Location" value={startSearch} onChange={(e) => handleSearchChange(e, 'start')} className="search-input"/>
//           {startResults.length > 0 && (
//             <div className="results-container">
//               {startResults.map(loc => (<div key={loc.id} className="result-item" onClick={() => handleSelectLocation(loc, 'start')}>{loc.name}</div>))}
//             </div>
//           )}
//         </div>
//         <div className="search-wrapper">
//           <input type="text" placeholder="Select a Destination" value={endSearch} onChange={(e) => handleSearchChange(e, 'end')} className="search-input"/>
//           {endResults.length > 0 && (
//             <div className="results-container">
//               {endResults.map(loc => (<div key={loc.id} className="result-item" onClick={() => handleSelectLocation(loc, 'end')}>{loc.name}</div>))}
//             </div>
//           )}
//         </div>

//         <button onClick={handleFindRoute} className="find-route-button" disabled={loading}>
//           {loading ? 'Calculating...' : 'Find Accessible Route'}
//         </button>
//       </div>

//       <div className="map-wrapper">
//         <MapContainer bounds={mapBounds} scrollWheelZoom={true} className="leaflet-container">
//           <ImageOverlay 
//             url="https://placehold.co/1500x1000/e2e8f0/64748b?text=UMBC+Campus+Map" 
//             bounds={mapBounds} 
//           />
//           {path.length > 0 && (
//             <Polyline positions={path} color="#007bff" weight={6} />
//           )}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css'; 
import axios from 'axios';
import L from 'leaflet'; // Import Leaflet library for map bounds calculation

// --- Configuration ---
const API_BASE_URL = "http://127.0.0.1:5000"; // The address of your Flask backend
const UMBC_CENTER = [39.255, -76.71]; // Coordinates for UMBC campus

// --- Main Application Component ---
function App() {
  // User and data state
  const [currentUser, setCurrentUser] = useState(null);
  const [emailInput, setEmailInput] = useState("");
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
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null); // Use a ref to hold the map instance

  // --- Data Fetching on Load ---
  useEffect(() => {
    // Fetch all locations for the search bars when the app loads
    axios.get(`${API_BASE_URL}/api/locations`)
      .then(response => setAllLocations(response.data))
      .catch(error => console.error("Error fetching locations:", error));
  }, []);

  // --- Auto-zoom map effect ---
  useEffect(() => {
    const map = mapRef.current;
    if (map && path.length > 0) {
      // Create a Leaflet LatLngBounds object to fit the polyline
      const polylineBounds = L.polyline(path).getBounds();
      // Tell the map to fit those bounds with some padding
      map.fitBounds(polylineBounds, { padding: [50, 50] });
    }
  }, [path]); // This effect runs whenever 'path' changes

  // --- User and Favorites API Functions ---
  const handleLogin = () => {
    if (!emailInput) {
      alert("Please enter an email.");
      return;
    }
    axios.get(`${API_BASE_URL}/api/users/${emailInput}`)
      .then(response => {
        // User found, log them in
        setCurrentUser(response.data);
        fetchFavoriteRoutes(response.data.id);
      })
      .catch(error => {
        // If user not found (404), create a new one
        if (error.response && error.response.status === 404) {
          const name = emailInput.split('@')[0]; // Simple name from email
          axios.post(`${API_BASE_URL}/api/users`, { email: emailInput, name })
            .then(response => {
              setCurrentUser(response.data); // Log in the new user
              setFavoriteRoutes([]); // New user has no favorites yet
            })
            .catch(err => console.error("Error creating user:", err));
        } else {
          console.error("Error fetching user:", error);
          alert("Could not log in. Make sure the backend server is running.");
        }
      });
  };

  const fetchFavoriteRoutes = (userId) => {
    axios.get(`${API_BASE_URL}/api/users/${userId}/favorites`)
      .then(response => setFavoriteRoutes(response.data || []))
      .catch(error => console.error("Error fetching favorites:", error));
  };

  const handleSaveRoute = () => {
    if (!currentUser || !startLocation || !endLocation || path.length === 0) return;

    const nickname = prompt("Enter a nickname for this route (e.g., 'Class to Library'):");
    if (nickname === null) return; // User cancelled prompt

    const newFavorite = {
      user_id: currentUser.id,
      start_location: startLocation.name,
      end_location: endLocation.name,
      path_coordinates: path, // Send the coordinates
      nickname: nickname || `Route from ${startLocation.name} to ${endLocation.name}`
    };

    axios.post(`${API_BASE_URL}/api/favorites`, newFavorite)
      .then(() => {
        alert("Route saved successfully!");
        fetchFavoriteRoutes(currentUser.id); // Refresh favorites list
      })
      .catch(error => console.error("Error saving route:", error));
  };
  
  const handleDeleteFavorite = (favoriteId) => {
    if(!window.confirm("Are you sure you want to delete this favorite route?")) return;

    axios.delete(`${API_BASE_URL}/api/favorites/${favoriteId}`)
    .then(() => {
        alert("Favorite deleted.");
        fetchFavoriteRoutes(currentUser.id); // Refresh list
    })
    .catch(error => console.error("Error deleting favorite:", error));
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
  };

  const handleFindRoute = () => {
    if (!startLocation || !endLocation) return;
    setLoading(true);
    setPath([]);
    axios.get(`${API_BASE_URL}/api/path?start=${startLocation.name}&end=${endLocation.name}`)
      .then(response => {
        if (response.data.path && response.data.path.length > 0) {
          setPath(response.data.path);
        } else {
          alert("No accessible path found.");
        }
      })
      .catch(error => console.error("Error fetching path:", error))
      .finally(() => setLoading(false));
  };

  const loadFavoriteRoute = (favorite) => {
    const start = allLocations.find(loc => loc.name === favorite.start_location);
    const end = allLocations.find(loc => loc.name === favorite.end_location);

    if (start && end) {
        handleSelectLocation(start, 'start');
        handleSelectLocation(end, 'end');
        setPath(favorite.path_coordinates);
    } else {
        alert("Could not load route. Location data may have changed.");
    }
  };

  // --- Render Login View if no user ---
  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>UMBC Accessibility GPS</h1>
          <p>Please log in to continue</p>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email"
            className="login-input"
          />
          <button onClick={handleLogin} className="login-button">Login or Sign Up</button>
        </div>
      </div>
    );
  }

  // --- Render Main Application View ---
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>UMBC Accessibility GPS System</h1>
        <div className="user-info">Logged in as: {currentUser.email}</div>
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
            <button onClick={handleFindRoute} className="find-route-button" disabled={loading}>{loading ? 'Calculating...' : 'Find Route'}</button>
            {path.length > 0 && (
              <button onClick={handleSaveRoute} className="save-route-button">Save to Favorites</button>
            )}
          </div>

          <div className="map-wrapper">
            <MapContainer center={UMBC_CENTER} zoom={16} scrollWheelZoom={true} className="leaflet-container" ref={mapRef}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {path.length > 0 && <Polyline positions={path} color="#007bff" weight={6} />}
            </MapContainer>
          </div>
        </div>

        <div className="favorites-section">
          <h2>My Favorite Routes</h2>
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
        </div>
      </main>
    </div>
  );
}

export default App;