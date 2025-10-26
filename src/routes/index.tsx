import AppLayout from "@/components/AppLayout";
import ErrorBoundary from "@/components/errorBoundary";
import NotFound from "@/pages/NotFound";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Admin = lazy(() => import("@/pages/Admin"));
export default createBrowserRouter([
    { path: "/login", element: <Login /> },
    {
        path: "/",
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            { index: true, element: <Home /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "checkout", element: <Checkout /> },
            { path: "admin", element: <Admin /> },
        ],
    },
    { path: "*", element: <NotFound /> },
])