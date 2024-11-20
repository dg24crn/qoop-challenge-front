import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import Register from "./views/register/Register";
import Login from "./views/login/Login";
import Sandbox from "./views/sandbox/Sandbox";
import Pricing from "./views/pricing/Pricing";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sandbox" element={<Sandbox/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
      </Routes>
    </div>
  );
}

export default App;
