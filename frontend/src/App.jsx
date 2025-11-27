import { Routes, Route } from "react-router-dom";
import { useNotificationListener } from "./hooks/useNotificationListener";

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
import DoctorRegister from "./components/Authentication/doctorRegister";
import OTP from "./components/Authentication/otp";
import VerificationSuccess from "./components/Authentication/verificationSuccess";
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
import DoctorsPage from "./pages/admin/Doctors";
import DoctorDashboard from "./pages/DoctorDashboard";
import QuickActions from "./pages/doctor/QuickActions";
import MyPatients from "./pages/doctor/MyPatients";
import Messages from "./pages/doctor/Messages";
import Schedule from "./pages/doctor/Schedule";
import PatientRecords from "./pages/doctor/PatientRecords";
import Availability from "./pages/doctor/Availability";
import Notifications from "./pages/doctor/Notifications";
import Analytics from "./pages/doctor/Analytics";
import DoctorProfile from "./pages/doctor/Profile";
import Settings from "./pages/doctor/Settings";
import {
  AdminProtectedRoute,
  DoctorProtectedRoute,
  ProtectedRoute,
} from "./components/ProtectedRoute";
import QuickAssist from "./components/QuickAssist/QuickAssist";

function App() {
  // Initialize notification listener (auto-fetch and toast alerts)
  useNotificationListener();

  return (
    <div>
      {/* Quick Assist - Available on all pages */}
      <QuickAssist />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/our-teamm" element={<OurTeamPage />} />
        <Route path="/our-services" element={<ServicesPage />} />
        <Route path="/our-news" element={<NewsPage />} />
        <Route path="/our-articles" element={<ArticlesPage />} />
        <Route path="/consultation" element={<Consultation />} />

        {/* Protected Public Routes */}
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chatpages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacy"
          element={
            <ProtectedRoute>
              <Pharmacy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital"
          element={
            <ProtectedRoute>
              <Hospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <BookingOnSmallDevice />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="consultations" element={<Dashboard />} />
          <Route path="users" element={<Dashboard />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="messages" element={<Dashboard />} />
          <Route path="game" element={<Dashboard />} />
          <Route path="content" element={<Dashboard />} />
          <Route path="analytics" element={<Dashboard />} />
          <Route path="settings" element={<Dashboard />} />
        </Route>

        {/* Doctor Routes - Protected */}
        <Route
          path="/doctor/dashboard"
          element={
            <DoctorProtectedRoute>
              <DoctorDashboard />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/consultations"
          element={
            <DoctorProtectedRoute>
              <QuickActions />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <DoctorProtectedRoute>
              <MyPatients />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/messages"
          element={
            <DoctorProtectedRoute>
              <Messages />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <DoctorProtectedRoute>
              <Schedule />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/records"
          element={
            <DoctorProtectedRoute>
              <PatientRecords />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/availability"
          element={
            <DoctorProtectedRoute>
              <Availability />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/notifications"
          element={
            <DoctorProtectedRoute>
              <Notifications />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/analytics"
          element={
            <DoctorProtectedRoute>
              <Analytics />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <DoctorProtectedRoute>
              <DoctorProfile />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="/doctor/settings"
          element={
            <DoctorProtectedRoute>
              <Settings />
            </DoctorProtectedRoute>
          }
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
