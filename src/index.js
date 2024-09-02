import React from "react";
import ReactDOM from "react-dom/client"; // Change the import path
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App"; // Adjust the import according to your project structure // Get the root element

const rootElement = document.getElementById("root"); // Create a root
const root = ReactDOM.createRoot(rootElement); // Render the app

root.render(
  <Router>
    <App />
  </Router>
);
