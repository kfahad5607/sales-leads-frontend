import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/shadcn/toaster";

const Layout = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="my-2 ">
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;
