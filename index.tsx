import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// --- Service Worker Registration ---
// We wait for the 'load' event to ensure the page is fully loaded before registering.
// This is the most reliable way to avoid "document is in an invalid state" errors.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Construct the full URL to the service worker to avoid cross-origin errors.
    const swUrl = `${location.origin}/sw.js`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker registered successfully with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
