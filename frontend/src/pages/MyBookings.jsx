import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import {
  CalendarMonth,
  Hotel,
  People,
  Visibility,
  Cancel,
  Payment as PaymentIcon,
  FlightTakeoff,
  Download,
  RateReview,
} from "@mui/icons-material";

import api from "../services/api";


function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ============================================================
  // GET MY BOOKINGS
  // ============================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/");

      setBookings(response.data || []);

    } catch (err) {
      console.error(
        "Failed to fetch bookings:",
        err
      );

      setError(
        "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // LOAD BOOKINGS
  // ============================================================

  useEffect(() => {
    fetchBookings();
  }, []);


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }

    return new Date(
      dateString
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ============================================================
  // BOOKING ID
  // ============================================================

  const formatBookingId = (id) => {
    return `TEA-${String(id).padStart(6, "0")}`;
  };


  // ============================================================
  // VIEW BOOKING
  // ============================================================

  const handleViewBooking = (bookingId) => {
    navigate(
      `/booking-details/${bookingId}`
    );
  };


  // ============================================================
  // GO TO PAYMENT
  // ============================================================

  const handlePayment = (bookingId) => {
    navigate(
      `/payment/${bookingId}`
    );
  };


  // ============================================================
  // CANCEL BOOKING
  // ============================================================

  const handleCancelBooking = async (
    bookingId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      await api.delete(
        `/bookings/${bookingId}`
      );

      await fetchBookings();

    } catch (err) {

      console.error(
        "Failed to cancel booking:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to cancel this booking."
      );
    }
  };


  // ============================================================
  // DOWNLOAD INVOICE
  // ============================================================

  const handleInvoiceDownload = async (bookingId) => {
    try {
      setError("");

      const response = await api.get(
        `/invoices/booking/${bookingId}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = `TEA-Invoice-${String(bookingId).padStart(6, "0")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download invoice:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to download the invoice."
      );
    }
  };


  // ============================================================
  // STATUS CONFIGURATION
  // ============================================================

  const getStatusStyles = (
    status
  ) => {

    switch (status) {

      case "CONFIRMED":
        return {
          background:
            "rgba(34,197,94,0.15)",
          color: "#22C55E",
        };

      case "PENDING_PAYMENT":
        return {
          background:
            "rgba(245,158,11,0.15)",
          color: "#F59E0B",
        };

      case "CANCELLED":
        return {
          background:
            "rgba(239,68,68,0.15)",
          color: "#EF4444",
        };

      default:
        return {
          background:
            "rgba(148,163,184,0.15)",
          color: "#94A3B8",
        };
    }
  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0B0F17",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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


  // ============================================================
  // PAGE
  // ============================================================

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

      <Container maxWidth="lg">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <Box sx={{ mb: 4 }}>

          <Typography
            sx={{
              color: "#00D4FF",
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              mb: 1,
            }}
          >
            TravelEase Atlas
          </Typography>


          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: {
                xs: "2.2rem",
                md: "3.5rem",
              },
            }}
          >
            My Bookings
          </Typography>


          <Typography
            sx={{
              color: "#8F98A8",
              mt: 1,
            }}
          >
            Manage your hotel reservations
            and trips.
          </Typography>

        </Box>


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 3,
              background: "#2A1619",
              color: "#fff",
              border:
                "1px solid #7F1D1D",
            }}
          >
            {error}
          </Alert>

        )}


        {/* ================================================== */}
        {/* NO BOOKINGS */}
        {/* ================================================== */}

        {bookings.length === 0 &&
          !error && (

            <Card
              sx={{
                background: "#161B22",
                border:
                  "1px solid #2A3441",
                borderRadius: 4,
              }}
            >

              <CardContent
                sx={{
                  py: 8,
                  textAlign: "center",
                }}
              >

                <Hotel
                  sx={{
                    fontSize: 60,
                    color: "#6C63FF",
                    mb: 2,
                  }}
                />


                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  No bookings yet
                </Typography>


                <Typography
                  sx={{
                    color: "#8F98A8",
                    mt: 1,
                    mb: 3,
                  }}
                >
                  Start exploring hotels
                  and book your next stay.
                </Typography>


                <Button
                  variant="contained"
                  onClick={() =>
                    navigate("/hotels")
                  }
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    background:
                      "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                  }}
                >
                  Explore Hotels
                </Button>

              </CardContent>

            </Card>

          )}


        {/* ================================================== */}
        {/* BOOKINGS */}
        {/* ================================================== */}

        {bookings.length > 0 && (

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >

            {bookings.map(
              (booking) => {

                const statusStyles =
                  getStatusStyles(
                    booking.status
                  );

                const isPendingPayment =
                  booking.status ===
                  "PENDING_PAYMENT";

                const isConfirmed =
                  booking.status ===
                  "CONFIRMED";

                const isFlightBooking = Boolean(
                  booking.flight_id
                );

                const canCancel = isPendingPayment;

                return (

                  <Card
                    key={booking.id}
                    sx={{
                      background:
                        "#161B22",
                      border:
                        "1px solid #2A3441",
                      borderRadius: 4,
                      overflow: "hidden",
                      transition:
                        "all 0.25s ease",

                      "&:hover": {
                        borderColor:
                          "#6C63FF",
                        boxShadow:
                          "0 15px 45px rgba(108,99,255,0.12)",
                      },
                    }}
                  >

                    <CardContent
                      sx={{
                        p: {
                          xs: 2.5,
                          md: 3,
                        },
                      }}
                    >

                      {/* ================================== */}
                      {/* TOP */}
                      {/* ================================== */}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: {
                            xs: "flex-start",
                            md: "center",
                          },
                          gap: 2,
                          flexDirection: {
                            xs: "column",
                            md: "row",
                          },
                        }}
                      >

                        <Box>

                          <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                              color: "#fff",
                            }}
                          >
                            {isFlightBooking
                              ? "Flight Booking"
                              : "Hotel Booking"}
                          </Typography>


                          <Typography
                            sx={{
                              color:
                                "#8F98A8",
                              mt: 0.5,
                            }}
                          >
                            Booking ID:{" "}
                            {formatBookingId(
                              booking.id
                            )}
                          </Typography>

                        </Box>


                        <Chip
                          label={
                            booking.status
                          }
                          sx={{
                            fontWeight: 700,
                            ...statusStyles,
                          }}
                        />

                      </Box>


                      <Divider
                        sx={{
                          my: 3,
                          borderColor:
                            "#2A3441",
                        }}
                      />


                      {/* ================================== */}
                      {/* BOOKING INFORMATION */}
                      {/* ================================== */}

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                            md: "repeat(4, 1fr)",
                          },
                          gap: 3,
                        }}
                      >

                        {/* CHECK-IN */}

                        <Box>

                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >

                            {isFlightBooking ? (
                              <FlightTakeoff
                                sx={{
                                  color: "#6C63FF",
                                }}
                              />
                            ) : (
                              <CalendarMonth
                              sx={{
                                color:
                                  "#6C63FF",
                              }}
                              />
                            )}

                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  "#8F98A8",
                              }}
                            >
                              {isFlightBooking
                                ? "FLIGHT"
                                : "CHECK-IN"}
                            </Typography>

                          </Box>


                          <Typography
                            fontWeight={700}
                            sx={{
                              color: "#fff",
                            }}
                          >
                            {isFlightBooking
                              ? `Flight #${booking.flight_id}`
                              : formatDate(booking.check_in)}
                          </Typography>

                        </Box>


                        {/* CHECK-OUT */}

                        <Box>

                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >

                            <CalendarMonth
                              sx={{
                                color:
                                  "#8B5CF6",
                              }}
                            />

                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  "#8F98A8",
                              }}
                            >
                              {isFlightBooking
                                ? "BOOKED ON"
                                : "CHECK-OUT"}
                            </Typography>

                          </Box>


                          <Typography
                            fontWeight={700}
                            sx={{
                              color: "#fff",
                            }}
                          >
                            {isFlightBooking
                              ? formatDate(booking.created_at)
                              : formatDate(booking.check_out)}
                          </Typography>

                        </Box>


                        {/* GUESTS */}

                        <Box>

                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >

                            <People
                              sx={{
                                color:
                                  "#00D4FF",
                              }}
                            />

                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  "#8F98A8",
                              }}
                            >
                              {isFlightBooking
                                ? "PASSENGERS"
                                : "GUESTS"}
                            </Typography>

                          </Box>


                          <Typography
                            fontWeight={700}
                            sx={{
                              color: "#fff",
                            }}
                          >
                            {booking.guests}
                          </Typography>

                        </Box>


                        {/* TOTAL */}

                        <Box>

                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                "#8F98A8",
                            }}
                          >
                            TOTAL
                          </Typography>


                          <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{
                              color: "#fff",
                              mt: 0.5,
                            }}
                          >
                            ₹
                            {Number(
                              booking.total_price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>

                        </Box>

                      </Box>


                      <Divider
                        sx={{
                          my: 3,
                          borderColor:
                            "#2A3441",
                        }}
                      />


                      {/* ================================== */}
                      {/* ROOM */}
                      {/* ================================== */}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1,
                          mb: 3,
                        }}
                      >

                        {isFlightBooking ? (
                          <FlightTakeoff
                            sx={{
                              color:
                                "#6C63FF",
                            }}
                          />
                        ) : (
                          <Hotel
                          sx={{
                            color:
                              "#6C63FF",
                          }}
                          />
                        )}


                        <Typography
                          sx={{
                            color:
                              "#B8C0CC",
                          }}
                        >
                          {isFlightBooking ? "Flight ID:" : "Room ID:"}{" "}

                          <strong
                            style={{
                              color: "#fff",
                            }}
                          >
                            {isFlightBooking
                              ? booking.flight_id
                              : booking.room_id}
                          </strong>

                        </Typography>

                      </Box>


                      {/* ================================== */}
                      {/* ACTIONS */}
                      {/* ================================== */}

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >

                        {/* -------------------------------- */}
                        {/* PENDING PAYMENT → PAY NOW */}
                        {/* -------------------------------- */}

                        {isPendingPayment && (

                          <Button
                            variant="contained"
                            startIcon={
                              <PaymentIcon />
                            }
                            onClick={() =>
                              handlePayment(
                                booking.id
                              )
                            }
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              fontWeight: 700,
                              color: "#fff",

                              background:
                                "linear-gradient(135deg, #6C63FF, #8B5CF6)",

                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #7C73FF, #9B6CFF)",
                              },
                            }}
                          >
                            Pay Now
                          </Button>

                        )}

                        {isConfirmed && (
                          <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() =>
                              handleInvoiceDownload(booking.id)
                            }
                            sx={{
                              color: "#fff",
                              borderColor: "#2A3441",
                              "&:hover": {
                                borderColor: "#22C55E",
                                background: "rgba(34,197,94,0.08)",
                              },
                            }}
                          >
                            Download Invoice
                          </Button>
                        )}

                        {isConfirmed && !isFlightBooking && (
                          <Button
                            variant="outlined"
                            startIcon={<RateReview />}
                            onClick={() =>
                              navigate(`/reviews?bookingId=${booking.id}`)
                            }
                            sx={{
                              color: "#fff",
                              borderColor: "#2A3441",
                              "&:hover": {
                                borderColor: "#8B7DFF",
                                background: "rgba(108,99,255,0.08)",
                              },
                            }}
                          >
                            Write Review
                          </Button>
                        )}


                        {/* -------------------------------- */}
                        {/* VIEW DETAILS */}
                        {/* -------------------------------- */}

                        <Button
                          variant="outlined"
                          startIcon={
                            <Visibility />
                          }
                          onClick={() =>
                            handleViewBooking(
                              booking.id
                            )
                          }
                          sx={{
                            color: "#fff",
                            borderColor:
                              "#2A3441",

                            "&:hover": {
                              borderColor:
                                "#6C63FF",
                              background:
                                "rgba(108,99,255,0.08)",
                            },
                          }}
                        >
                          View Details
                        </Button>


                        {/* -------------------------------- */}
                        {/* CANCEL UNPAID HOLD */}
                        {/* -------------------------------- */}

                        {canCancel && (

                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={
                              <Cancel />
                            }
                            onClick={() =>
                              handleCancelBooking(
                                booking.id
                              )
                            }
                          >
                            Cancel Booking
                          </Button>

                        )}

                      </Box>

                    </CardContent>

                  </Card>

                );
              }
            )}

          </Box>

        )}

      </Container>

    </Box>
  );
}


export default MyBookings;
