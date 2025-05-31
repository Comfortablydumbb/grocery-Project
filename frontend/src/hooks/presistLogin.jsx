import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("user"));

    if (storedAuth?.accessToken) {
      const isValid = isTokenValid(storedAuth.accessToken);

      if (isValid) {
        setAuth(storedAuth);
      } else {
        localStorage.removeItem("user");
        setAuth({});
        navigate("/login");
      }
    }

    setIsLoading(false);
  }, [setAuth, navigate]);

  const isTokenValid = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch (err) {
      return false; // Invalid token format
    }
  };

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
