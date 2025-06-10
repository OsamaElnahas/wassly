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

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />, 
        children: [
            { 
                path: "/", 
                element: <Layout />, 
                children: [
                    { index: true, element:<Home/> },
                    { path: "/shops", element: <Shops/> },
                    { path: "/shopsDetails/:id", element: <ShopsDetails/> },
                    { path: "/addShop", element:<AddShop/> },
                    { path: "/orders", element:<Orders/> },
                    { path: "/orderDetails/:id", element:<OrderDetails/> },
                    { path: "/tayareen", element:<Tayareen/> },
                    { path: "/transactions", element:<Transactions/> },
                ],
            }
        ],
    },
    { path: "login", element: <Login/> },
    { path: "*", element: <NotFound/> }
]);

export default router;
