import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StorageProvider } from './contexts/AppContext';
import './index.css';

const root = document.createElement("div")
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <StorageProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </StorageProvider>
);