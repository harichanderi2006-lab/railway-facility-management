import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { SocketProvider } from './context/SocketContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>
);
