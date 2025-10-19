// import React, { useState } from 'react';

// // --- Placeholder Data ---
// // In a real application, this list would be fetched from your backend.
// const locations = [
//   { id: 101, name: "ITE Building Entrance" },
//   { id: 102, name: "Library - First Floor" },
//   { id: 103, name: "Commons Main Entrance" },
//   { id: 104, name: "Performing Arts Center" },
//   { id: 201, name: "Engineering Building - Floor 2" },
//   { id: 202, name: "Event Center (The 'Retriever Dome')" },
//   { id: 301, name: "The RAC Gymnasium" }
// ];

// function App() {
//   // State for the final selected locations (now holds the full object)
//   const [startLocation, setStartLocation] = useState(null);
//   const [endLocation, setEndLocation] = useState(null);

//   // State for the text inside the search bars
//   const [startSearch, setStartSearch] = useState("");
//   const [endSearch, setEndSearch] = useState("");

//   // State for the filtered search results dropdowns
//   const [startResults, setStartResults] = useState([]);
//   const [endResults, setEndResults] = useState([]);

//   // --- Search Logic ---
//   const handleSearchChange = (e, type) => {
//     const query = e.target.value;
//     const setter = type === 'start' ? setStartSearch : setEndSearch;
//     const resultsSetter = type === 'start' ? setStartResults : setEndResults;
    
//     setter(query); // Update the text in the search bar
    
//     if (query.length > 0) {
//       // Filter locations based on the search query
//       const filtered = locations.filter(loc =>
//         loc.name.toLowerCase().includes(query.toLowerCase())
//       );
//       resultsSetter(filtered);
//     } else {
//       resultsSetter([]); // Clear results if search is empty
//     }
//   };

//   const handleSelectLocation = (location, type) => {
//     if (type === 'start') {
//       setStartLocation(location); // Set the chosen start location object
//       setStartSearch(location.name); // Put the full name in the search bar
//       setStartResults([]); // Close the results dropdown
//     } else {
//       setEndLocation(location);
//       setEndSearch(location.name);
//       setEndResults([]);
//     }
//   };

//   const handleFindRoute = () => {
//     if (!startLocation || !endLocation) {
//       alert("Please select a valid starting and ending location from the search results.");
//       return;
//     }
//     console.log(`Finding route from ${startLocation.name} (ID: ${startLocation.id}) to ${endLocation.name} (ID: ${endLocation.id})`);
//     alert("Check the browser console! Backend is not yet connected.");
//   };

//   return (
//     <div style={styles.appContainer}>
//       <header style={styles.header}>
//         <h1 style={{ margin: 0 }}>UMBC Accessibility GPS System</h1>
//       </header>

//       <div style={styles.controlsContainer}>
//         {/* Start Location Search Bar */}
//         <div style={styles.searchWrapper}>
//           <input
//             type="text"
//             placeholder="Select a Starting Location"
//             value={startSearch}
//             onChange={(e) => handleSearchChange(e, 'start')}
//             style={styles.searchInput}
//           />
//           {startResults.length > 0 && (
//             <div style={styles.resultsContainer}>
//               {startResults.map(loc => (
//                 <div key={loc.id} style={styles.resultItem} onClick={() => handleSelectLocation(loc, 'start')}>
//                   {loc.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* End Location Search Bar */}
//         <div style={styles.searchWrapper}>
//           <input
//             type="text"
//             placeholder="Select a Destination"
//             value={endSearch}
//             onChange={(e) => handleSearchChange(e, 'end')}
//             style={styles.searchInput}
//           />
//           {endResults.length > 0 && (
//             <div style={styles.resultsContainer}>
//               {endResults.map(loc => (
//                 <div key={loc.id} style={styles.resultItem} onClick={() => handleSelectLocation(loc, 'end')}>
//                   {loc.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <button onClick={handleFindRoute} style={styles.button}>
//           Find Accessible Route
//         </button>
//       </div>

//       {/* --- Map Placeholder --- */}
//       <div style={styles.mapPlaceholder}>
//         <p style={{ color: '#aaa', fontSize: '24px' }}>Map will be displayed here</p>
//       </div>
//     </div>
//   );
// }

// // --- Styles Object for UMBC Branding ---
// const umbcGold = '#FFC20E';
// const umbcBlack = '#000000';

// const styles = {
//   appContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     height: '100vh',
//     fontFamily: 'sans-serif'
//   },
//   header: {
//     padding: '20px',
//     backgroundColor: umbcBlack,
//     color: umbcGold,
//     textAlign: 'center',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
//   },
//   controlsContainer: {
//     padding: '20px',
//     backgroundColor: '#f8f9fa',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '15px',
//     borderBottom: '1px solid #ddd'
//   },
//   searchWrapper: {
//     position: 'relative',
//     width: '300px'
//   },
//   searchInput: {
//     width: '100%',
//     padding: '10px',
//     fontSize: '16px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//     boxSizing: 'border-box'
//   },
//   resultsContainer: {
//     position: 'absolute',
//     width: '100%',
//     backgroundColor: 'white',
//     border: '1px solid #ddd',
//     borderTop: 'none',
//     borderRadius: '0 0 5px 5px',
//     maxHeight: '200px',
//     overflowY: 'auto',
//     zIndex: 1000,
//     textAlign: 'left'
//   },
//   resultItem: {
//     padding: '10px',
//     cursor: 'pointer'
//   },
//   button: {
//     padding: '10px 20px',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     borderRadius: '5px',
//     border: '1px solid ' + umbcBlack,
//     backgroundColor: umbcGold,
//     color: umbcBlack
//   },
//   mapPlaceholder: {
//     flexGrow: 1,
//     margin: '20px',
//     border: '2px dashed #ccc',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f9f9f9'
//   }
// };

// export default App;



import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css'; 
import axios from 'axios'; // Import axios for making API calls

// The address of your running Flask backend server
const API_BASE_URL = "http://127.0.0.1:5000"; 

function App() {
  // State for all locations fetched from the backend
  const [allLocations, setAllLocations] = useState([]); 

  // State for user selections and search
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [startSearch, setStartSearch] = useState("");
  const [endSearch, setEndSearch] = useState("");
  const [startResults, setStartResults] = useState([]);
  const [endResults, setEndResults] = useState([]);
  
  // State for the final path and loading indicator
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Step 1: Fetch all locations from the backend when the app first loads ---
  useEffect(() => {
    // This function runs once when the component loads
    axios.get(`${API_BASE_URL}/api/locations`)
      .then(response => {
        setAllLocations(response.data);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        alert("Could not connect to the backend server. Make sure it's running!");
      });
  }, []); // The empty array [] means this runs only once

  // --- Step 2: Handle search and selection (uses live data) ---
  const handleSearchChange = (e, type) => {
    const query = e.target.value;
    const setter = type === 'start' ? setStartSearch : setEndSearch;
    const resultsSetter = type === 'start' ? setStartResults : setEndResults;

    setter(query);
    if (query.length > 0) {
      // Filter locations from the list we fetched from the backend
      const filtered = allLocations.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
      resultsSetter(filtered);
    } else {
      resultsSetter([]);
    }
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

  // --- Step 3: Call the backend to find the route! ---
  const handleFindRoute = () => {
    if (!startLocation || !endLocation) {
      alert("Please select a valid starting and ending location from the search results.");
      return;
    }
    setLoading(true); // Show a loading message on the button
    setPath([]); // Clear any old path from the map

    // Make the API call to your backend's pathfinding endpoint
    axios.get(`${API_BASE_URL}/api/path?start=${startLocation.name}&end=${endLocation.name}`)
      .then(response => {
        if (response.data.path && response.data.path.length > 0) {
          setPath(response.data.path); // Update the map with the new path
        } else {
          alert("No accessible path could be found between these locations.");
        }
      })
      .catch(error => {
        console.error("Error fetching path:", error);
        alert("An error occurred while calculating the route.");
      })
      .finally(() => {
        setLoading(false); // Hide the loading message
      });
  };

  // Define the map boundaries
  const mapBounds = [[39.250, -76.718], [39.260, -76.705]];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>UMBC Accessibility GPS System</h1>
      </header>

      <div className="controls-container">
        <div className="search-wrapper">
          <input type="text" placeholder="Select a Starting Location" value={startSearch} onChange={(e) => handleSearchChange(e, 'start')} className="search-input"/>
          {startResults.length > 0 && (
            <div className="results-container">
              {startResults.map(loc => (<div key={loc.id} className="result-item" onClick={() => handleSelectLocation(loc, 'start')}>{loc.name}</div>))}
            </div>
          )}
        </div>
        <div className="search-wrapper">
          <input type="text" placeholder="Select a Destination" value={endSearch} onChange={(e) => handleSearchChange(e, 'end')} className="search-input"/>
          {endResults.length > 0 && (
            <div className="results-container">
              {endResults.map(loc => (<div key={loc.id} className="result-item" onClick={() => handleSelectLocation(loc, 'end')}>{loc.name}</div>))}
            </div>
          )}
        </div>

        <button onClick={handleFindRoute} className="find-route-button" disabled={loading}>
          {loading ? 'Calculating...' : 'Find Accessible Route'}
        </button>
      </div>

      <div className="map-wrapper">
        <MapContainer bounds={mapBounds} scrollWheelZoom={true} className="leaflet-container">
          <ImageOverlay 
            url="https://placehold.co/1500x1000/e2e8f0/64748b?text=UMBC+Campus+Map" 
            bounds={mapBounds} 
          />
          {path.length > 0 && (
            <Polyline positions={path} color="#007bff" weight={6} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;