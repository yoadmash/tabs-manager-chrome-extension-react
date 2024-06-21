import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StorageProvider } from './contexts/AppContext';
import './index.css';
import { NavProvider } from './contexts/NavContext';

const root = document.createElement("div")
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <StorageProvider>
    <React.StrictMode>
      <NavProvider>
        <App />
      </NavProvider>
    </React.StrictMode>
  </StorageProvider>
);