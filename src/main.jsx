import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/tokens.css";

// ✅ Hide loading screen when React is ready
function hideLoadingScreen() {
  // Call the global function from index.html
  if (window.__hideLoadingScreen) {
    window.__hideLoadingScreen();
  } else {
    // Fallback: directly hide if function not available
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        if (loadingScreen.parentNode) {
          loadingScreen.style.display = 'none';
        }
      }, 700);
    }
  }
}

// ✅ Create root and render
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// ✅ Hide loading screen after React renders
// Use requestAnimationFrame to ensure React has painted
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    // Small delay to ensure DOM updates are committed
    setTimeout(hideLoadingScreen, 150);
  });
});

// ✅ Additional safety: Hide after 2 seconds max
setTimeout(hideLoadingScreen, 2000);