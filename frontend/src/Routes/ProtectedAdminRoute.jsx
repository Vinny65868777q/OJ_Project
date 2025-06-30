import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedAdminRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null); // null = loading

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/check-admin', {
      withCredentials: true
    })
    .then(res => setAuthorized(res.data.isAdmin))
    .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) return <div>Loading...</div>;
  if (authorized === false) return <Navigate to="/login" />;

  return children;
};

export default ProtectedAdminRoute;
