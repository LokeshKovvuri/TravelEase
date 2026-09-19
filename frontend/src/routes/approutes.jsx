import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { lazy, Suspense } from "react";


// ==============================
// PUBLIC PAGES
// ==============================

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));


// ==============================
// LAYOUT
// ==============================

import TEALayout from "../components/layout/TEALayout";


// ==============================
// MAIN PAGES
// ==============================

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Explore = lazy(() => import("../pages/Explore"));
const Hotels = lazy(() => import("../pages/Hotels"));
const HotelDetails = lazy(() => import("../pages/HotelDetails"));


// ==============================
// HOTEL BOOKING
// ==============================

const Booking = lazy(() => import("../pages/Booking"));


// ==============================
// BOOKINGS
// ==============================

const MyBookings = lazy(() => import("../pages/MyBookings"));
const BookingDetails = lazy(() => import("../pages/BookingDetails"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Profile = lazy(() => import("../pages/Profile"));
const Reviews = lazy(() => import("../pages/Reviews"));


// ==============================
// PAYMENT
// ==============================

const Payment = lazy(() => import("../pages/Payment"));
const BookingSuccess = lazy(() => import("../pages/BookingSuccess"));


// ==============================
// FLIGHTS
// ==============================

const FlightSearch = lazy(() => import("../pages/flights/FlightSearch"));
const FlightResults = lazy(() => import("../pages/flights/FlightResults"));
const FlightBooking = lazy(() => import("../pages/FlightBooking"));
const Trains = lazy(() => import("../pages/Trains"));
const Buses = lazy(() => import("../pages/Buses"));
const Cabs = lazy(() => import("../pages/Cabs"));
const Offers = lazy(() => import("../pages/Offers"));
const AIPlanner = lazy(() => import("../pages/AIPlanner"));


// ==============================
// AUTH
// ==============================

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {

  return (

    <BrowserRouter>

      <Suspense
        fallback={
          <div
            style={{
              minHeight: "100vh",
              display: "grid",
              placeItems: "center",
              background: "#060A13",
              color: "#C9C5FF",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Loading TravelEase…
          </div>
        }
      >
        <Routes>

        {/* =====================================================
            PUBLIC
        ===================================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Explore />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Explore />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            HOTELS
        ===================================================== */}

        <Route
          path="/hotels"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Hotels />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hotels/:id"
          element={
            <ProtectedRoute>
              <TEALayout>
                <HotelDetails />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hotels/:id/booking"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Booking />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            FLIGHTS - SEARCH
        ===================================================== */}

        <Route
          path="/flights"
          element={
            <ProtectedRoute>
              <TEALayout>
                <FlightSearch />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            FLIGHTS - RESULTS
        ===================================================== */}

        <Route
          path="/flights/results"
          element={
            <ProtectedRoute>
              <TEALayout>
                <FlightResults />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            FLIGHTS - BOOKING
        ===================================================== */}

        <Route
          path="/flights/:id/booking"
          element={
            <ProtectedRoute>
              <TEALayout>
                <FlightBooking />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            MY BOOKINGS
        ===================================================== */}

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <TEALayout>
                <MyBookings />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trains/*"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Trains />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/buses/*"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Buses />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cabs/*"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Cabs />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/offers/*"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Offers />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-planner/*"
          element={
            <ProtectedRoute>
              <TEALayout>
                <AIPlanner />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Wishlist />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Profile />
              </TEALayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Reviews />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            BOOKING DETAILS
        ===================================================== */}

        <Route
          path="/booking-details/:bookingId"
          element={
            <ProtectedRoute>
              <TEALayout>
                <BookingDetails />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            PAYMENT
        ===================================================== */}

        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Payment />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            BOOKING SUCCESS
        ===================================================== */}

        <Route
          path="/booking-success"
          element={
            <ProtectedRoute>
              <TEALayout>
                <BookingSuccess />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TEALayout>
                <Dashboard />
              </TEALayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            FALLBACK
        ===================================================== */}

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",

                background:
                  "#060A13",

                color:
                  "#FFFFFF",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                fontSize:
                  "24px",
              }}
            >
              Page not found
            </div>
          }
        />

        </Routes>
      </Suspense>

    </BrowserRouter>
  );
}


export default AppRoutes;
