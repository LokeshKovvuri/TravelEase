import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  CalendarMonth,
  Hotel,
  People,
  Payment,
  FlightTakeoff,
} from "@mui/icons-material";

import api from "../services/api";

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [flight, setFlight] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // ---------------------------------------------
        // GET BOOKING
        // ---------------------------------------------

        const bookingResponse = await api.get(
          `/bookings/${bookingId}`
        );

        const bookingData = bookingResponse.data;

        setBooking(bookingData);

        // Flight bookings have no room or hotel relationship. Fetch their
        // flight record directly so the detail page remains useful for both
        // booking types.
        if (bookingData.flight_id) {
          const flightResponse = await api.get(
            `/flights/${bookingData.flight_id}`
          );
          setFlight(flightResponse.data);
          return;
        }

        // ---------------------------------------------
        // GET ROOM
        // ---------------------------------------------

        const roomResponse = await api.get(
          `/rooms/${bookingData.room_id}`
        );

        const roomData = roomResponse.data;

        setRoom(roomData);

        // ---------------------------------------------
        // GET HOTEL
        // ---------------------------------------------

        const hotelResponse = await api.get(
          `/hotels/${roomData.hotel_id}`
        );

        setHotel(hotelResponse.data);

      } catch (err) {
        console.error(
          "Failed to load booking details:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Unable to load booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  // ---------------------------------------------
  // DATE FORMAT
  // ---------------------------------------------

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }

    return new Date(dateString).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ---------------------------------------------
  // BOOKING ID
  // ---------------------------------------------

  const formatBookingId = (id) => {
    return `TEA-${String(id).padStart(6, "0")}`;
  };

  // ---------------------------------------------
  // STATUS
  // ---------------------------------------------

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "#22C55E";

      case "PENDING_PAYMENT":
        return "#F59E0B";

      case "CANCELLED":
        return "#EF4444";

      default:
        return "#94A3B8";
    }
  };

  const isFlightBooking = Boolean(booking?.flight_id);
  const BookingTypeIcon = isFlightBooking ? FlightTakeoff : Hotel;
  const bookingTitle = isFlightBooking
    ? `${flight?.airline || "Flight"} ${flight?.flight_number || "Booking"}`
    : hotel?.name || "Hotel Booking";
  const bookingLocation = isFlightBooking
    ? `${flight?.origin || "--"} → ${flight?.destination || "--"}`
    : hotel?.location;
  const firstDate = isFlightBooking
    ? flight?.departure_time
    : booking?.check_in;
  const secondDate = isFlightBooking
    ? flight?.arrival_time
    : booking?.check_out;

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0B0F17",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          sx={{
            color: "#6C63FF",
          }}
        />
      </Box>
    );
  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (error || !booking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0B0F17",
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/my-bookings")}
            sx={{
              color: "#fff",
              mb: 3,
              textTransform: "none",
            }}
          >
            Back to My Bookings
          </Button>

          <Alert
            severity="error"
            sx={{
              background: "#2A1619",
              color: "#fff",
            }}
          >
            {error || "Booking not found."}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0B0F17",
        py: {
          xs: 4,
          md: 6,
        },
      }}
    >
      <Container maxWidth="md">

        {/* --------------------------------------------- */}
        {/* BACK */}
        {/* --------------------------------------------- */}

        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/my-bookings")}
          sx={{
            color: "#fff",
            mb: 3,
            textTransform: "none",
          }}
        >
          Back to My Bookings
        </Button>

        {/* --------------------------------------------- */}
        {/* HEADER */}
        {/* --------------------------------------------- */}

        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#00D4FF",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            TravelEase Atlas
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mt: 1,
            }}
          >
            Booking Details
          </Typography>

          <Typography
            sx={{
              color: "#8F98A8",
              mt: 1,
            }}
          >
            {formatBookingId(booking.id)}
          </Typography>
        </Box>

        {/* --------------------------------------------- */}
        {/* BOOKING CARD */}
        {/* --------------------------------------------- */}

        <Card
          sx={{
            background: "#161B22",
            border: "1px solid #2A3441",
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>

            {/* HOTEL */}

            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                color: "#fff",
                mb: 1,
              }}
            >
              {bookingTitle}
            </Typography>

            {bookingLocation && (
              <Typography
                sx={{
                  color: "#8F98A8",
                  mb: 3,
                }}
              >
                {bookingLocation}
              </Typography>
            )}

            <Divider
              sx={{
                borderColor: "#2A3441",
                mb: 3,
              }}
            />

            {/* ROOM */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <BookingTypeIcon
                sx={{
                  color: "#6C63FF",
                }}
              />

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8F98A8",
                  }}
                >
                  {isFlightBooking ? "FLIGHT" : "ROOM"}
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {isFlightBooking
                    ? `Flight #${booking.flight_id}`
                    : room?.room_type || "Selected Room"}
                </Typography>
              </Box>
            </Box>

            {/* DATES */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 3,
                mb: 3,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <CalendarMonth
                  sx={{
                    color: "#6C63FF",
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#8F98A8",
                    }}
                  >
                    {isFlightBooking ? "DEPARTURE" : "CHECK-IN"}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {formatDate(firstDate)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <CalendarMonth
                  sx={{
                    color: "#8B5CF6",
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#8F98A8",
                    }}
                  >
                    {isFlightBooking ? "ARRIVAL" : "CHECK-OUT"}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {formatDate(secondDate)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* GUESTS */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              <People
                sx={{
                  color: "#00D4FF",
                }}
              />

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8F98A8",
                  }}
                >
                  {isFlightBooking ? "PASSENGERS" : "GUESTS"}
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {booking.guests}
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                borderColor: "#2A3441",
                mb: 3,
              }}
            />

            {/* TOTAL */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  color: "#8F98A8",
                }}
              >
                Total Amount
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                ₹
                {Number(
                  booking.total_price
                ).toLocaleString("en-IN")}
              </Typography>
            </Box>

            {/* STATUS */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                background: "#0F141C",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  color: "#8F98A8",
                }}
              >
                Booking Status
              </Typography>

              <Typography
                sx={{
                  color: getStatusColor(
                    booking.status
                  ),
                  fontWeight: 800,
                }}
              >
                {booking.status}
              </Typography>
            </Box>

            {/* PAYMENT */}

            {booking.status ===
              "PENDING_PAYMENT" && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<Payment />}
                onClick={() =>
                  navigate(
                    `/payment/${booking.id}`
                  )
                }
                sx={{
                  height: 50,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                }}
              >
                Continue to Payment
              </Button>
            )}

            {/* BACK */}

            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                navigate("/my-bookings")
              }
              sx={{
                mt: 2,
                height: 50,
                borderRadius: 2,
                color: "#fff",
                borderColor: "#2A3441",
                textTransform: "none",
              }}
            >
              Back to My Bookings
            </Button>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default BookingDetails;
