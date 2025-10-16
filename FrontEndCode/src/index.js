import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// This is the standard entry point for a modern React application.
// 1. It finds the 'root' div in your public/index.html file.
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// 2. It tells React to render your entire <App /> component inside that div.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
