import React, { useState } from 'react';

// Note: To add the map functionality later, you will need to run:
// npm install react-leaflet leaflet

function App() {
  // --- FIX ---
  // We are now using the useState hook to create state variables.
  // 'startLocation' will hold the ID of the selected starting point.
  // 'setStartLocation' is the function we call to update it.
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');

  // This function logs the selected values to the console.
  const handleFindRoute = () => {
    if (!startLocation || !endLocation) {
      alert("Please select both a starting and an ending location.");
      return;
    }
    console.log(`Finding route from Node ID: ${startLocation} to Node ID: ${endLocation}`);
    alert("Check the browser's developer console to see the selected IDs! Backend is not yet connected.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>UMBC Accessibility GPS System</h1>
        <p style={{ margin: '10px 0 0 0', color: '#555' }}>Your guide to a more inclusive campus.</p>
      </header>

      <div className="controls" style={{ padding: '20px', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
        {/* The `value` and `onChange` props now connect the dropdown to our state */}
        <select 
          value={startLocation} 
          onChange={(e) => setStartLocation(e.target.value)}
          style={{ padding: '10px', margin: '0 5px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">-- Select a Starting Location --</option>
          <option value="101">ITE Building Entrance</option>
          <option value="102">Library - First Floor</option>
        </select>
        
        <select 
          value={endLocation} 
          onChange={(e) => setEndLocation(e.target.value)}
          style={{ padding: '10px', margin: '0 5px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">-- Select a Destination --</option>
          <option value="103">Commons Main Entrance</option>
          <option value="104">Performing Arts Center</option>
        </select>

        <button 
          onClick={handleFindRoute}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          Find Accessible Route
        </button>
      </div>

      {/* --- Map Placeholder --- */}
      <div style={{ flexGrow: 1, margin: '20px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
        <p style={{ color: '#aaa', fontSize: '24px' }}>Map will be displayed here</p>
      </div>
    </div>
  );
}

export default App;

