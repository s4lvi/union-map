// frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container); // Create a root.

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
