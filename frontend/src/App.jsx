import { Routes, Route } from "react-router-dom";

import "./App.css";
import Chatpages from "./pages/Chatpages";
import ServicePage from "./pages/service/service";
import Pharmacy from "./pages/pharmacy/Pharmacy";
import LandingPage from "./pages/landingPage/landingPage";
import Game from "./pages/game/game";
import News from "./pages/news/news";
import Menu from "./pages/menu/menu";
import Consultation from "./pages/consultation/consultation";
import Profile from "./pages/profile/profile";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "./components/Authentication/login";
import Signup from "./components/Authentication/signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Hospital from "./pages/hospital/Hospital";
import OurTeamPage from "./pages/OurTeamPage";
import NewsPage from "./pages/NewsPage";
import ArticlesPage from "./pages/ArticlesPage";
import ServicesPage from "./pages/ServicesPage";
import ErrorPage from "./pages/ErrorPage";
import BookingOnSmallDevice from "./pages/BookingOnSmallDevice";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chats" element={<Chatpages />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/hospital" element={<Hospital />} />
        <Route path="/game" element={<Game />} />
        <Route path="/news" element={<News />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/our-teamm" element={<OurTeamPage />} />
        <Route path="/our-services" element={<ServicesPage />} />
        <Route path="/our-news" element={<NewsPage />} />
        <Route path="/our-articles" element={<ArticlesPage />} />
        <Route path="/book" element={<BookingOnSmallDevice />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="consultations" element={<Dashboard />} />
          <Route path="users" element={<Dashboard />} />
          <Route path="doctors" element={<Dashboard />} />
          <Route path="messages" element={<Dashboard />} />
          <Route path="game" element={<Dashboard />} />
          <Route path="content" element={<Dashboard />} />
          <Route path="analytics" element={<Dashboard />} />
          <Route path="settings" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
