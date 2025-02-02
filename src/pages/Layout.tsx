import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/shadcn/toaster";

const Layout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Outlet />
      <Toaster />
    </div>
  );
};

export default Layout;
