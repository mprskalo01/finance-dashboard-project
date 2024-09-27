import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import { AccountProvider } from "@/context/AccountContext/AccountContext";

createRoot(document.getElementById("root")!).render(
  <AccountProvider>
    <App />
  </AccountProvider>
);
