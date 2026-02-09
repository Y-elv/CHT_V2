import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Box,
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  theme as chakraTheme,
  useToast,
} from "@chakra-ui/react";
import ChatProvider from "./components/Context/chatProvider";
import { ProtectedRoute, DoctorProtectedRoute, PatientProtectedRoute, AdminProtectedRoute } from "./components/ProtectedRoute";
import { initAuthErrorHandler } from "./utils/authErrorHandler";
import ErrorBoundary from "./components/ErrorBoundary";
import QuickAssist from "./components/QuickAssist/QuickAssist";

// Lazy load components
const LandingPage = React.lazy(() => import("./pages/landingPage/landingPage"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./components/Authentication/signup"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const AuthVerification = React.lazy(() => import("./pages/AuthVerification/AuthVerification"));
const DoctorDashboard = React.lazy(() => import("./pages/DoctorDashboard"));
const PatientDashboard = React.lazy(() => import("./pages/patient/Dashboard"));
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const Profile = React.lazy(() => import("./pages/profile/profile"));
const Appointments = React.lazy(() => import("./pages/profile/Appointments"));
const Consultation = React.lazy(() => import("./pages/consultation/consultation"));
const Game = React.lazy(() => import("./pages/game/game"));
const News = React.lazy(() => import("./pages/news/news"));
const Menu = React.lazy(() => import("./pages/menu/menu"));
const OurTeamPage = React.lazy(() => import("./pages/OurTeamPage"));
const Hospital = React.lazy(() => import("./pages/hospital/Hospital"));
const Pharmacy = React.lazy(() => import("./pages/pharmacy/Pharmacy"));
const Service = React.lazy(() => import("./pages/service/service"));
const Chatpages = React.lazy(() => import("./pages/Chatpages"));

// Doctor components
const DoctorMessages = React.lazy(() => import("./pages/doctor/Messages"));
const DoctorSchedule = React.lazy(() => import("./pages/doctor/Schedule"));
const DoctorPatients = React.lazy(() => import("./pages/doctor/MyPatients"));
const DoctorNotifications = React.lazy(() => import("./pages/doctor/Notifications"));
const DoctorProfile = React.lazy(() => import("./pages/doctor/Profile"));
const DoctorSettings = React.lazy(() => import("./pages/doctor/Settings"));
const DoctorAnalytics = React.lazy(() => import("./pages/doctor/Analytics"));
const DoctorAvailability = React.lazy(() => import("./pages/doctor/Availability"));
const DoctorPatientRecords = React.lazy(() => import("./pages/doctor/PatientRecords"));

// Admin components
const AdminDoctors = React.lazy(() => import("./pages/admin/Doctors"));
const AdminLayout = React.lazy(() => import("./pages/admin/AdminLayout"));

// Extend Chakra theme
const theme = extendTheme({
  ...chakraTheme,
  colors: {
    brand: {
      50: "#0D47A1",
      100: "#1E40AF",
      200: "#3182CE",
      300: "#4C1D95",
      400: "#6366F1",
      500: "#9333EA",
      600: "#C41E3A",
      700: "#E53E3E",
      800: "#2D3748",
      900: "#1A202C",
    },
  },
});

// Loading component for lazy loading
const PageLoader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minH="100vh"
  >
    <div>Loading...</div>
  </Box>
);

function App() {
  const toast = useToast();
  
  // Initialize global auth error handler with toast instance
  useEffect(() => {
    initAuthErrorHandler(toast);
  }, [toast]);

  return (
    <ErrorBoundary>
      <Box>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth-verification" element={<AuthVerification />} />

          {/* Public Information Pages */}
          <Route path="/news" element={<News />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/our-team" element={<OurTeamPage />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/service" element={<Service />} />

          {/* Patient Protected Routes */}
          <Route
            path="/profile"
            element={
              <PatientProtectedRoute>
                <Profile />
              </PatientProtectedRoute>
            }
          />
          <Route
            path="/profile/appointments"
            element={
              <PatientProtectedRoute>
                <Appointments />
              </PatientProtectedRoute>
            }
          />
          <Route
            path="/consultation"
            element={
              <PatientProtectedRoute>
                <Consultation />
              </PatientProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <PatientProtectedRoute>
                <Game />
              </PatientProtectedRoute>
            }
          />
          <Route
            path="/chatpages"
            element={
              <PatientProtectedRoute>
                <Chatpages />
              </PatientProtectedRoute>
            }
          />

          {/* Doctor Protected Routes */}
          <Route
            path="/doctor/*"
            element={
              <DoctorProtectedRoute>
                <DoctorDashboard />
              </DoctorProtectedRoute>
            }
          />
          {/* Individual Doctor Routes for Navigation */}
          <Route
            path="/doctor/messages"
            element={
              <DoctorProtectedRoute>
                <DoctorMessages />
              </DoctorProtectedRoute>
            }
          />
          <Route
            path="/doctor/schedule"
            element={
              <DoctorProtectedRoute>
                <DoctorSchedule />
              </DoctorProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <DoctorProtectedRoute>
                <DoctorPatients />
              </DoctorProtectedRoute>
            }
          />
          <Route
            path="/doctor/notifications"
            element={
              <DoctorProtectedRoute>
                <DoctorNotifications />
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
                <DoctorSettings />
              </DoctorProtectedRoute>
            }
          />
          <Route
            path="/doctor/analytics"
            element={
              <DoctorProtectedRoute>
                <DoctorAnalytics />
              </DoctorProtectedRoute>
            }
          />
          <Route
            path="/doctor/availability"
            element={
              <DoctorProtectedRoute>
                <DoctorAvailability />
              </DoctorProtectedRoute>
            }
          />
          <Route
            path="/doctor/patient-records"
            element={
              <DoctorProtectedRoute>
                <DoctorPatientRecords />
              </DoctorProtectedRoute>
            }
          />

          {/* Patient Dashboard Routes */}
          <Route
            path="/patient/*"
            element={
              <PatientProtectedRoute>
                <PatientDashboard />
              </PatientProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          {/* Individual Admin Routes */}
          <Route
            path="/admin/doctors"
            element={
              <AdminProtectedRoute>
                <AdminDoctors />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/layout"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <QuickAssist />
    </Box>
    </ErrorBoundary>
  );
}

export default App;
