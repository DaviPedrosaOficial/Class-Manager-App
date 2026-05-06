import AppRoutes from "./routes"
import "./styles/table.css";
import "./styles/institution.css"
import "./styles/navbar.css"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App
