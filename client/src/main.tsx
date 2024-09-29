import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import CombinedProvider from "@/context/CombinedProvider";

createRoot(document.getElementById("root")!).render(
  <CombinedProvider>
    <App />
  </CombinedProvider>
);
