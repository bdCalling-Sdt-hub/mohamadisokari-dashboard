import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  // Check if token exists
  if (!adminToken) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  try {
    // Decode the JWT token
    // JWT tokens are split into three parts: header.payload.signature
    const payload = adminToken.split('.')[1];
    // The payload is base64 encoded, so we need to decode it
    const decodedPayload = JSON.parse(atob(payload));

    // Check if the token has the required role and valid email
    if (decodedPayload.role === "SUPER_ADMIN" &&
      decodedPayload.email &&
      decodedPayload.email.includes('@')) {
      // Valid token with SUPER_ADMIN role and valid email, render the children (dashboard)
      return children;
    } else {
      // Invalid role or email, redirect to login
      return <Navigate to="/auth/login" state={{ from: location }} />;
    }
  } catch (error) {
    // If there's an error in token decoding, redirect to login
    console.error("Error decoding token:", error);
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }
};

export default ProtectedRoute;