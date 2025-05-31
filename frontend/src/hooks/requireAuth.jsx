import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth?.name || !allowedRoles?.includes(auth?.role)) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [auth, allowedRoles, navigate, location]);

  if (!auth?.name || !allowedRoles?.includes(auth?.role)) {
    return null;
  }

  return <Outlet />;
};

export default RequireAuth;
