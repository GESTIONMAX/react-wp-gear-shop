import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Debug log for Vercel
console.log("🚀 MyTechGear app starting...");
console.log("Environment:", import.meta.env.MODE);
console.log("Supabase URL exists:", !!import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key exists:", !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
