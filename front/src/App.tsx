import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import Register from "./views/register/Register";
import Login from "./views/login/Login";
import Sandbox from "./views/sandbox/Sandbox";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/sandbox" element={<Sandbox/>}/>
      </Routes>
    </div>
  );
}

export default App;
