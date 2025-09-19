import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useFlash } from "./FlashContext"; // 🔹 import FlashContext

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const { setFlash } = useFlash(); // 🔹 access flash

  // Check auth once app loads
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/check-auth`, { withCredentials: true })
      .then((res) => {
        if (res.data.isAuth) {
          setAuth(true);
          setUser(res.data.user);
        } else {
          setAuth(false);
          setUser(null);
        }
      })
      .catch(() => {
        setAuth(false);
        setUser(null);
      });
  }, []);

  // 🔹 Logout function
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, { withCredentials: true });
      setAuth(false);
      setUser(null);
      setFlash({ type: "success", message: "Logged out successfully!" });
    } catch (err) {
      setFlash({ type: "error", message: "Logout failed, please try again." });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
