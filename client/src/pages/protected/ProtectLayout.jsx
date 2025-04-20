import { Outlet } from "react-router";

function ProtectLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ProtectLayout;