// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwtDecode(token);
        setAuth({ token, user });
      } catch (error) {
        console.error("Invalid token:", error);
        setAuth({ token: null, user: null });
      }
    }
  }, []);

  const login = (token) => {
    try {
      const user = jwtDecode(token);
      localStorage.setItem("token", token);
      setAuth({ token, user });
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
