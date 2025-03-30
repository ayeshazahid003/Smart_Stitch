import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainLayout() {
  return (
    <div>
      <ToastContainer />

      <Outlet />
    </div>
  );
}

export default MainLayout;
