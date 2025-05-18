import { Outlet, useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";

function ProtectLayout() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Token is stored in cookies, so we send the request with credentials
        const response = await axios.get("http://localhost:5000/verify-token", {
          withCredentials: true, // This allows cookies to be sent with the request
        });

        if (response?.data?.user) {
          setLoading(false);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ProtectLayout;
