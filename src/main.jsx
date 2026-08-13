import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/tokens.css";

// ✅ Hide loading screen with your theme
function hideLoadingScreen() {
  // Try global function first
  if (window.__hideLoadingScreen) {
    window.__hideLoadingScreen();
    return;
  }

  // Fallback: Direct DOM manipulation
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      if (loadingScreen && loadingScreen.parentNode) {
        loadingScreen.classList.add('removed');
      }
    }, 700);
  }
}

// ✅ Create root
const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ Render app
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// ✅ Wait for React to paint
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        hideLoadingScreen();
      }, 200);
    });
  });
});

// ✅ Safety timeout
setTimeout(hideLoadingScreen, 3000);