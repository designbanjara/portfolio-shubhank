
import React from 'react';
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-portfolio-dark text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-4">Page not found at {location.pathname}</p>
        <a href="/" className="text-portfolio-link hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
