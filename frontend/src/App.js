import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResumeHistory from "./pages/ResumeHistory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// AI Interview
import AIInterview from "./components/AIInterview";

// Analytics
import Analytics from "./components/Analytics";


// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children }) {

  const token =
    localStorage.getItem("token");


  // If user is not logged in
  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // If user is logged in
  return children;
}


// ==========================================
// APP
// ==========================================

function App() {

  return (

    <BrowserRouter>

      {/* Navbar */}

      <Navbar />


      <Routes>


        {/* ==============================
            PUBLIC ROUTES
        ============================== */}


        <Route
          path="/"
          element={
            <Home />
          }
        />


        <Route
          path="/login"
          element={
            <Login />
          }
        />


        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* ==============================
            PROTECTED ROUTES
        ============================== */}


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ResumeHistory />
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
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            AI MOCK INTERVIEW
        ============================== */}


        <Route
          path="/ai-interview"
          element={
            <ProtectedRoute>
              <AIInterview />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            ANALYTICS
        ============================== */}


        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            PAGE NOT FOUND
        ============================== */}


        <Route
          path="*"
          element={
            <NotFound />
          }
        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;