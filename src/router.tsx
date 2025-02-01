import { createBrowserRouter } from "react-router-dom";
import AllLeads from "./pages/AllLeads";
import Layout from "./pages/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <AllLeads />,
      },
    ],
  },
]);

export default router;
