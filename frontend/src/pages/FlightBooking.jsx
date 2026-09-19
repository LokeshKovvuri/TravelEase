import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";

import {
 AirplanemodeActive,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Person,
  Schedule,
} from "@mui/icons-material";

import api from "../services/api";


function FlightBooking() {

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const passedFlight = location.state?.flight;

  const passedPassengers =
    Number(location.state?.passengers) || 1;


  const [flight, setFlight] =
    useState(passedFlight || null);

  const [passengers, setPassengers] =
    useState(passedPassengers);

  const [loading, setLoading] =
    useState(!passedFlight);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // ============================================================
  // LOAD FLIGHT
  // ============================================================

  useEffect(() => {

    const loadFlight = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await api.get(
          `/flights/${id}`
        );

        setFlight(response.data);

      } catch (err) {

        console.error(
          "Unable to load flight:",
          err
        );

        setError(
          err.response?.data?.detail ||
          "Unable to load flight details."
        );

      } finally {

        setLoading(false);

      }
    };


    if (!passedFlight) {
      loadFlight();
    } else {
      setLoading(false);
    }

  }, [id, passedFlight]);


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {

    if (!value) {
      return "--";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatTime = (value) => {

    if (!value) {
      return "--:--";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    );
  };


  // ============================================================
  // DURATION
  // ============================================================

  const duration = useMemo(() => {

    if (
      !flight?.departure_time ||
      !flight?.arrival_time
    ) {
      return "--";
    }

    const departure =
      new Date(flight.departure_time);

    const arrival =
      new Date(flight.arrival_time);

    const minutes = Math.round(
      (arrival - departure) / 60000
    );

    if (minutes <= 0) {
      return "--";
    }

    const hours =
      Math.floor(minutes / 60);

    const mins =
      minutes % 60;

    return `${hours}h ${mins}m`;

  }, [flight]);


  // ============================================================
  // TOTAL PRICE
  // ============================================================

  const totalPrice = useMemo(() => {

    if (!flight) {
      return 0;
    }

    return (
      Number(flight.economy_price || 0) *
      passengers
    );

  }, [flight, passengers]);


  // ============================================================
  // CREATE BOOKING
  // ============================================================

  const handleBooking = async () => {

    if (!flight) {
      return;
    }

    if (passengers < 1) {

      setError(
        "At least one passenger is required."
      );

      return;
    }

    if (
      passengers >
      Number(flight.available_seats || 0)
    ) {

      setError(
        `Only ${flight.available_seats} seats are available.`
      );

      return;
    }


    try {

      setBookingLoading(true);
      setError("");

      const response = await api.post(
        "/bookings/",
        {
          room_id: null,
          flight_id: flight.id,
          check_in: null,
          check_out: null,
          guests: passengers,
        }
      );

      const booking =
        response.data;


      // --------------------------------------------------------
      // Move to payment
      // --------------------------------------------------------

      navigate(
        `/payment/${booking.id}`,
        {
          state: {
            booking,
            flight,
          },
        }
      );

    } catch (err) {

      console.error(
        "Flight booking failed:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to create flight booking."
      );

    } finally {

      setBookingLoading(false);

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
          background: "#060A13",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <CircularProgress
          sx={{
            color: "#7C6CFF",
          }}
        />

      </Box>
    );

  }


  // ============================================================
  // ERROR / FLIGHT NOT FOUND
  // ============================================================

  if (!flight) {

    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#060A13",
          color: "#FFFFFF",
          py: 6,
        }}
      >

        <Container maxWidth="md">

          <Card
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: "center",
              background:
                "linear-gradient(145deg, rgba(18,25,39,0.96), rgba(9,14,25,0.98))",
              border:
                "1px solid rgba(255,255,255,0.08)",
              color: "#FFFFFF",
            }}
          >

            <AirplanemodeActive
              sx={{
                fontSize: 60,
                color: "#6C63FF",
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
              }}
            >
              Flight not found
            </Typography>

            <Button
              startIcon={<ArrowBack />}
              onClick={() =>
                navigate("/flights")
              }
              sx={{
                mt: 3,
                color: "#FFFFFF",
                textTransform: "none",
              }}
            >
              Back to Flights
            </Button>

          </Card>

        </Container>

      </Box>
    );

  }


  // ============================================================
  // MAIN UI
  // ============================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",

        background:
          "radial-gradient(circle at 80% 0%, rgba(91,70,255,0.12), transparent 30%), #060A13",

        color: "#FFFFFF",

        py: {
          xs: 3,
          md: 5,
        },
      }}
    >

      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1120px",
          mx: "auto",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >

        {/* =====================================================
            BACK
        ===================================================== */}

        <Button
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(-1)
          }
          sx={{
            color: "#9CA6BA",
            textTransform: "none",
            mb: 3,
          }}
        >
          Back to flight results
        </Button>


        {/* =====================================================
            PAGE TITLE
        ===================================================== */}

        <Typography
          sx={{
            fontSize: {
              xs: "2rem",
              md: "2.7rem",
            },
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Complete your booking
        </Typography>

        <Typography
          sx={{
            color: "#8F9AAF",
            mt: 0.7,
            mb: 4,
          }}
        >
          Review your flight and passenger details before payment.
        </Typography>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (

          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{
              mb: 3,
              borderRadius: 3,
            }}
          >
            {error}
          </Alert>

        )}


        {/* =====================================================
            CONTENT
        ===================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1.5fr 0.8fr",
            },

            gap: 3,
          }}
        >

          {/* ===================================================
              FLIGHT CARD
          =================================================== */}

          <Card
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },

              borderRadius: 4,

              background:
                "linear-gradient(145deg, rgba(18,25,39,0.97), rgba(9,14,25,0.99))",

              border:
                "1px solid rgba(255,255,255,0.08)",

              color: "#FFFFFF",
            }}
          >

            {/* Airline */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "rgba(108,99,255,0.12)",
                    border:
                      "1px solid rgba(108,99,255,0.25)",
                  }}
                >

                  <AirplanemodeActive
                    sx={{
                      color: "#7C6CFF",
                    }}
                  />

                </Box>

                <Box>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.15rem",
                    }}
                  >
                    {flight.airline}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#7F8A9E",
                      fontSize: "0.82rem",
                    }}
                  >
                    {flight.flight_number}
                  </Typography>

                </Box>

              </Box>


              <Chip
                icon={<CheckCircle />}
                label="Scheduled"
                size="small"
                sx={{
                  color: "#42E6A4",
                  background:
                    "rgba(34,197,94,0.10)",
                  border:
                    "1px solid rgba(34,197,94,0.25)",
                }}
              />

            </Box>


            <Divider
              sx={{
                my: 3,
                borderColor:
                  "rgba(255,255,255,0.07)",
              }}
            />


            {/* Route */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr auto 1fr",
                },

                alignItems: "center",

                gap: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >

              {/* Departure */}

              <Box>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "2rem",
                      md: "2.4rem",
                    },
                    fontWeight: 800,
                  }}
                >
                  {formatTime(
                    flight.departure_time
                  )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}
                >
                  {flight.origin}
                </Typography>

                <Typography
                  sx={{
                    color: "#7F8A9E",
                    mt: 0.5,
                    fontSize: "0.82rem",
                  }}
                >
                  {formatDate(
                    flight.departure_time
                  )}
                </Typography>

              </Box>


              {/* Center */}

              <Box
                sx={{
                  textAlign: "center",
                  minWidth: {
                    sm: 110,
                  },
                }}
              >

                <Schedule
                  sx={{
                    color: "#7C6CFF",
                  }}
                />

                <Typography
                  sx={{
                    color: "#AEB6C7",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    mt: 0.3,
                  }}
                >
                  {duration}
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    height: 1,
                    background:
                      "rgba(255,255,255,0.15)",
                    my: 1,
                  }}
                />

                <Typography
                  sx={{
                    color: "#657086",
                    fontSize: "0.72rem",
                  }}
                >
                  Direct flight
                </Typography>

              </Box>


              {/* Arrival */}

              <Box
                sx={{
                  textAlign: {
                    xs: "left",
                    sm: "right",
                  },
                }}
              >

                <Typography
                  sx={{
                    fontSize: {
                      xs: "2rem",
                      md: "2.4rem",
                    },
                    fontWeight: 800,
                  }}
                >
                  {formatTime(
                    flight.arrival_time
                  )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}
                >
                  {flight.destination}
                </Typography>

                <Typography
                  sx={{
                    color: "#7F8A9E",
                    mt: 0.5,
                    fontSize: "0.82rem",
                  }}
                >
                  {formatDate(
                    flight.arrival_time
                  )}
                </Typography>

              </Box>

            </Box>


            <Divider
              sx={{
                my: 3,
                borderColor:
                  "rgba(255,255,255,0.07)",
              }}
            />


            {/* Availability */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#42E6A4",
              }}
            >

              <CheckCircle
                sx={{
                  fontSize: 18,
                }}
              />

              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                {flight.available_seats} seats currently available
              </Typography>

            </Box>

          </Card>


          {/* ===================================================
              BOOKING SUMMARY
          =================================================== */}

          <Card
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },

              borderRadius: 4,

              background:
                "linear-gradient(145deg, rgba(19,27,43,0.98), rgba(10,15,27,0.99))",

              border:
                "1px solid rgba(108,99,255,0.35)",

              color: "#FFFFFF",

              height: "fit-content",

              position: {
                md: "sticky",
              },

              top: {
                md: 24,
              },
            }}
          >

            <Typography
              sx={{
                color: "#7D71FF",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                mb: 1,
              }}
            >
              BOOKING SUMMARY
            </Typography>


            <Typography
              sx={{
                fontSize: "1.35rem",
                fontWeight: 800,
                mb: 3,
              }}
            >
              {flight.origin} → {flight.destination}
            </Typography>


            {/* Passenger selector */}

            <Typography
              sx={{
                color: "#AEB6C7",
                fontSize: "0.8rem",
                fontWeight: 700,
                mb: 1,
              }}
            >
              PASSENGERS
            </Typography>

            <Select
              fullWidth
              value={passengers}
              onChange={(event) =>
                setPassengers(
                  Number(event.target.value)
                )
              }
              sx={{
                color: "#FFFFFF",

                background:
                  "rgba(255,255,255,0.04)",

                borderRadius: 2.5,

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    "rgba(255,255,255,0.12)",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    "rgba(108,99,255,0.55)",
                },

                "& .MuiSvgIcon-root": {
                  color: "#9CA6BA",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: "#111827",
                    color: "#FFFFFF",
                  },
                },
              }}
            >

              {Array.from(
                {
                  length: Math.min(
                    9,
                    Number(
                      flight.available_seats || 0
                    )
                  ),
                },
                (_, index) => index + 1
              ).map((count) => (

                <MenuItem
                  key={count}
                  value={count}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Person fontSize="small" />

                    {count} passenger
                    {count > 1 ? "s" : ""}

                  </Box>
                </MenuItem>

              ))}

            </Select>


            <Divider
              sx={{
                my: 3,
                borderColor:
                  "rgba(255,255,255,0.08)",
              }}
            />


            {/* Price */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >

              <Typography
                sx={{
                  color: "#8F9AAF",
                }}
              >
                Economy × {passengers}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                ₹{totalPrice.toLocaleString("en-IN")}
              </Typography>

            </Box>


            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1rem",
                }}
              >
                Total
              </Typography>

              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "1.6rem",
                }}
              >
                ₹{totalPrice.toLocaleString("en-IN")}
              </Typography>

            </Box>


            <Button
              fullWidth
              variant="contained"
              endIcon={
                bookingLoading
                  ? <CircularProgress
                      size={18}
                      sx={{
                        color: "#FFFFFF",
                      }}
                    />
                  : <ArrowForward />
              }
              onClick={handleBooking}
              disabled={
                bookingLoading ||
                Number(flight.available_seats || 0) <= 0
              }
              sx={{
                mt: 3,

                py: 1.4,

                borderRadius: 2.5,

                textTransform: "none",

                fontWeight: 800,

                fontSize: "1rem",

                background:
                  "linear-gradient(135deg,#6655FF,#00AEEF)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#5746FF,#009DDD)",
                },
              }}
            >
              {bookingLoading
                ? "Creating booking..."
                : "Continue to payment"}
            </Button>


            <Typography
              sx={{
                color: "#657086",
                fontSize: "0.72rem",
                textAlign: "center",
                mt: 2,
                lineHeight: 1.5,
              }}
            >
              Your booking will be held as
              PENDING PAYMENT until payment is completed.
            </Typography>

          </Card>

        </Box>

      </Container>


      {/* =======================================================
          SUCCESS SNACKBAR
      ======================================================= */}

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() =>
          setSuccessMessage("")
        }
        message={successMessage}
      />

    </Box>
  );
}


export default FlightBooking;
