import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import { AccountProvider } from "@/context/AccountContext/AccountContext";
import { ProductProvider } from "@/context/ProductContext/ProductContext";

createRoot(document.getElementById("root")!).render(
  <AccountProvider>
    <ProductProvider>
      <App />
    </ProductProvider>
  </AccountProvider>
);
