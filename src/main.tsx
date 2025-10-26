import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import GlobalContext from "./context/globalContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <CartProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <GlobalContext>
                    <App />
                </GlobalContext>
            </Suspense>
        </CartProvider>
    </AuthProvider>
);
