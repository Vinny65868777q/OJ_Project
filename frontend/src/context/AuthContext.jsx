import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();/*creating a context object called AuthContext.*/

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [loading, setLoading] = useState(true);
 useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        credentials: "include",
      });

      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsLoggedIn(false);/*If an error happened (e.g., server not responding), assume the user is not logged in for safety. */
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);


  const login  = () => setIsLoggedIn(true); 
  
  const logout = async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }
  
  setIsLoggedIn(false);
  console.log("VERIFY RESULT:", res.status);

};


  return (
    <AuthContext.Provider value={{ isLoggedIn,login, logout,loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
