import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Layout from "../layout/Layout";
import Home from "../Home/Home";
import Shops from "../Shops/Shops";
import Login from "../Login/Login";
import ShopsDetails from "../Shops/ShopsDetails";
import AddShop from "../Shops/AddShop";
import Orders from "../Orders/Orders";
import OrderDetails from "../Orders/OrderDetails";
import Tayareen from "../Tayareen/Tayareen";
import NotFound from "../NotFound/NotFound";
import Transactions from "../Transactions/Transactions";
import AddTayar from "../Tayareen/AddTayar";
import TayarDetails from "../Tayareen/TayarDetails";
import Analytics from "../../Analytics/Analytics";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: "/shops", element: <Shops /> },
          { path: "/shops/shopsDetails/:id", element: <ShopsDetails /> },
          { path: "/shops/AddShop", element: <AddShop /> },
          { path: "/orders", element: <Orders /> },
          { path: "/orders/orderDetails/:id", element: <OrderDetails /> },
          { path: "/tayareen", element: <Tayareen /> },
          { path: "/transactions", element: <Transactions /> },
          { path: "/addTayaar", element: <AddTayar /> },
          { path: "/tayareen/tayaarDetails/:id", element: <TayarDetails /> },
          { path: "/analytics", element: <Analytics /> },
        ],
      },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
