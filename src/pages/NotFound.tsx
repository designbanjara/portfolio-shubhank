
import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { track } from "@/lib/analytics";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    track('page_not_found', { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-portfolio-dark text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Page not found at {location.pathname}</p>
        <a href="/" className="text-portfolio-link hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
