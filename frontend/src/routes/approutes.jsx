import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";

import Hotels from "../pages/Hotels";
import HotelDetails from "../pages/HotelDetails";
import Booking from "../pages/Booking";
import MyBookings from "../pages/MyBookings";
import Payment from "../pages/Payment";

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================================================== */}
        {/* PUBLIC ROUTES */}
        {/* ================================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================================== */}
        {/* HOME */}
        {/* ================================================== */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Hotels />
            </ProtectedRoute>
          }
        />


        {/* ================================================== */}
        {/* HOTELS */}
        {/* ================================================== */}

        <Route
          path="/hotels"
          element={
            <ProtectedRoute>
              <Hotels />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hotels/:id"
          element={
            <ProtectedRoute>
              <HotelDetails />
            </ProtectedRoute>
          }
        />


        {/* ================================================== */}
        {/* BOOKING */}
        {/* ================================================== */}

        <Route
          path="/hotels/:id/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />


        {/* ================================================== */}
        {/* MY BOOKINGS */}
        {/* ================================================== */}

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />


        {/* ================================================== */}
        {/* PAYMENT */}
        {/* ================================================== */}

        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />


        {/* ================================================== */}
        {/* OLD DASHBOARD */}
        {/* ================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ================================================== */}
        {/* FALLBACK */}
        {/* ================================================== */}

        <Route
          path="*"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default AppRoutes;