import { createBrowserRouter, useNavigate } from "react-router-dom";
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
import AddOrder from "../Orders/AddOrder";
import ActiveOrders from "../Orders/ActiveOrders";
import CancelationOrders from "../Orders/CancelationOrders";
import OrdersHistory from "../Orders/OrdersHistory";
import RevenuesHandover from "../RevenuesHandover/RevenuesHandover";
import Revenue from "../RevenuesHandover/Revenue";
import HandOver from "../RevenuesHandover/handOver";
import { Navigate } from "react-router-dom";
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
          // { path: "/orders", element: <Orders /> },
          {
            path: "/orders",
            element: <Orders />,
            children: [
              { index: true, element: <Navigate to="active" replace /> },
              { path: "active", element: <ActiveOrders /> },
              { path: "/orders/cancelation", element: <CancelationOrders /> },
              { path: "history", element: <OrdersHistory /> },
            ],
          },
          {
            path: "/RevenuesHandover",
            element: <RevenuesHandover />,
            children: [
              { index: true, element: <Navigate to="handOver" replace /> },
              { path: "handOver", element: <HandOver /> },
              { path: "revenue", element: <Revenue /> },
              // {path:"/RevenuesHandover/history",element:<RevenuesHistory />},
            ],
          },
          {
            path: "/orders/active/orderDetails/:id",
            element: <OrderDetails />,
          },
          { path: "/tayareen", element: <Tayareen /> },
          { path: "/transactions", element: <Transactions /> },
          { path: "/tayareen/addTayar", element: <AddTayar /> },
          { path: "/tayareen/tayaarDetails/:id", element: <TayarDetails /> },
          { path: "/orders/AddOrder", element: <AddOrder /> },
          { path: "/analytics", element: <Analytics /> },
        ],
      },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
