import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = () => {
    // Clear auth state
    setAuth({});

    // Remove tokens or user info from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user"); // Optional, if stored

    // You can also clear all localStorage (optional)
    // localStorage.clear();
  };

  return logout;
};

export default useLogout;
