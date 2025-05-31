import { Link } from "react-router-dom";
import { User } from "lucide-react";
import useAuth from "../hooks/useAuth";

const AccountLink = () => {
  const { auth } = useAuth();
  const name = auth?.name;

  // Determine the route based on role
  let destination = "/login";
  if (auth?.role === "Admin") {
    destination = "/admin/dashboard";
  } else if (auth?.role === "Customer") {
    destination = "/customer/dashboard";
  }

  return (
    <Link
      to={destination}
      className="text-gray-700 hover:text-green-600 transition flex justify-center items-center gap-1"
    >
      <User className="h-6 w-6" /> {name ? name : "Account"}
    </Link>
  );
};

export default AccountLink;
