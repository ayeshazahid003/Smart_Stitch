import { Outlet } from "react-router";
import { useUser } from "../../context/UserContext";

function ProtectLayout() {
  const { user } = useUser();

  console.log("user from protect layout", user);

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
