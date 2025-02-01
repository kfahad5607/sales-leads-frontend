import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="my-2 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
