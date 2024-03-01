import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import "./App.css";
import Chatpages from "./pages/Chatpages";
import ServicePage from "./pages/service/service";
import LandingPage from "./pages/landingPage/landingPage";
import Game from "./pages/game/game";
import News from "./pages/news/news";
import Menu from "./pages/menu/menu";
import Consultation from "./pages/consultation/consultation";
import Profile from "./pages/profile/profile";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpages />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/news" element={<News />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
