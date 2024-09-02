import "./App.css";
import Detail from "./pages/Detail/detail";
import Home from "./pages/Home/home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail" element={<Detail />} />
    </Routes>
  );
}
export default App;
