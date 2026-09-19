import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import {
  AirplanemodeActive,
  CalendarMonth,
  Person,
  Search,
  SwapHoriz,
  ArrowBack,
} from "@mui/icons-material";

import api from "../../services/api";


function FlightSearch() {

  const navigate = useNavigate();

  const [tripType, setTripType] = useState("oneway");

  const [origin, setOrigin] = useState("");

  const [destination, setDestination] = useState("");

  const [departureDate, setDepartureDate] = useState("");

  const [passengers, setPassengers] = useState(1);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // SWAP CITIES
  // ============================================================

  const swapLocations = () => {

    const oldOrigin = origin;

    setOrigin(destination);

    setDestination(oldOrigin);
  };


  // ============================================================
  // SEARCH
  // ============================================================

  const searchFlights = async () => {

    setError("");

    if (!origin.trim()) {
      setError("Please enter your departure city.");
      return;
    }

    if (!destination.trim()) {
      setError("Please enter your destination.");
      return;
    }

    if (!departureDate) {
      setError("Please select a departure date.");
      return;
    }

    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError("Departure and destination cannot be the same.");
      return;
    }

    try {

      setLoading(true);

      const response = await api.get(
        "/flights/search",
        {
          params: {
            origin: origin.trim(),
            destination: destination.trim(),
            departure_date: departureDate,
          },
        }
      );

      console.log(
        "FLIGHT SEARCH RESPONSE:",
        response.data
      );

      navigate(
        "/flights/results",
        {
          state: {
            flights: response.data,
            origin: origin.trim(),
            destination: destination.trim(),
            departureDate,
            passengers,
          },
        }
      );

    } catch (err) {

      console.error(
        "Flight search failed:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to search flights. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  // ============================================================
  // POPULAR DESTINATION
  // ============================================================

  const selectDestination = (city) => {
    setDestination(city);
  };


  return (

    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 0%, rgba(91,70,255,0.10), transparent 30%), #060A13",
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
          maxWidth: "1200px",
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
          onClick={() => navigate("/home")}
          sx={{
            color: "#AAB3C5",
            textTransform: "none",
            mb: 3,

            "&:hover": {
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Back to explore
        </Button>


        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box
          sx={{
            textAlign: "center",
            mb: 5,
          }}
        >

          <Typography
            sx={{
              fontSize: {
                xs: "2.2rem",
                sm: "3rem",
                md: "3.6rem",
              },
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
            }}
          >
            Where do you want to fly?
          </Typography>

          <Typography
            sx={{
              color: "#8F9AAF",
              mt: 1.5,
              fontSize: "1rem",
            }}
          >
            Find flights, compare fares and book your journey with TEA.
          </Typography>

        </Box>


        {/* =====================================================
            SEARCH CARD
        ===================================================== */}

        <Box
          sx={{
            maxWidth: "1080px",
            mx: "auto",
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },

            borderRadius: 5,

            background:
              "linear-gradient(145deg, rgba(19,27,43,0.96), rgba(10,15,27,0.98))",

            border:
              "1px solid rgba(112,91,255,0.45)",

            boxShadow:
              "0 25px 80px rgba(0,0,0,0.35)",
          }}
        >

          {/* =================================================
              TRIP TYPE
          ================================================= */}

          <Box
            sx={{
              display: "flex",
              width: "fit-content",
              borderRadius: 2.5,
              overflow: "hidden",
              border:
                "1px solid rgba(255,255,255,0.10)",
              mb: 4,
            }}
          >

            {[
              ["oneway", "One Way"],
              ["roundtrip", "Round Trip"],
              ["multicity", "Multi City"],
            ].map(([value, label]) => (

              <Button
                key={value}
                onClick={() => setTripType(value)}
                sx={{
                  minWidth: {
                    xs: 90,
                    sm: 120,
                  },

                  px: 2,

                  py: 1.2,

                  borderRadius: 0,

                  textTransform: "none",

                  color:
                    tripType === value
                      ? "#FFFFFF"
                      : "#8993A8",

                  background:
                    tripType === value
                      ? "linear-gradient(135deg,#6655FF,#358CFF)"
                      : "transparent",

                  fontWeight:
                    tripType === value
                      ? 700
                      : 500,

                  "&:hover": {
                    background:
                      tripType === value
                        ? "linear-gradient(135deg,#6655FF,#358CFF)"
                        : "rgba(255,255,255,0.05)",
                  },
                }}
              >
                {label}
              </Button>

            ))}

          </Box>


          {/* =================================================
              LOCATION ROW
          ================================================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 54px 1fr",
              },
              gap: 1.5,
              alignItems: "center",
            }}
          >

            {/* FROM */}

            <TextField
              fullWidth
              label="From"
              placeholder="City or airport"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <AirplanemodeActive
                      sx={{
                        color: "#7C6CFF",
                        mr: 1,
                      }}
                    />
                  ),
                },
              }}
              sx={fieldStyles}
            />


            {/* SWAP */}

            <IconButton
              onClick={swapLocations}
              sx={{
                width: 52,
                height: 52,
                justifySelf: "center",

                border:
                  "1px solid rgba(255,255,255,0.12)",

                background:
                  "rgba(255,255,255,0.04)",

                color: "#FFFFFF",

                "&:hover": {
                  background:
                    "rgba(108,99,255,0.18)",
                  borderColor: "#6C63FF",
                },
              }}
            >
              <SwapHoriz />
            </IconButton>


            {/* TO */}

            <TextField
              fullWidth
              label="To"
              placeholder="City or airport"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <AirplanemodeActive
                      sx={{
                        color: "#00C2FF",
                        mr: 1,
                      }}
                    />
                  ),
                },
              }}
              sx={fieldStyles}
            />

          </Box>


          {/* =================================================
              DATE + PASSENGERS
          ================================================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 1.5,
              mt: 2,
            }}
          >

            {/* DATE */}

            <TextField
              fullWidth
              label="Departure"
              type="date"
              value={departureDate}
              onChange={(e) =>
                setDepartureDate(e.target.value)
              }
              InputLabelProps={{
                shrink: true,
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <CalendarMonth
                      sx={{
                        color: "#7C6CFF",
                        mr: 1,
                      }}
                    />
                  ),
                },
              }}
              sx={{
                ...fieldStyles,

                "& input": {
                  colorScheme: "dark",
                },
              }}
            />


            {/* PASSENGERS */}

            <TextField
              fullWidth
              label="Passengers"
              type="number"
              value={passengers}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Number(e.target.value) || 1
                );

                setPassengers(value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <Person
                      sx={{
                        color: "#7C6CFF",
                        mr: 1,
                      }}
                    />
                  ),
                },

                htmlInput: {
                  min: 1,
                  max: 9,
                },
              }}
              sx={fieldStyles}
            />

          </Box>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <Box
              sx={{
                mt: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2.5,

                border:
                  "1px solid rgba(248,113,113,0.35)",

                background:
                  "rgba(248,113,113,0.08)",

                color: "#FF8585",

                fontSize: "0.9rem",
              }}
            >
              {error}
            </Box>

          )}


          {/* =================================================
              SEARCH BUTTON
          ================================================= */}

          <Button
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={<Search />}
            onClick={searchFlights}
            sx={{
              mt: 3,
              minHeight: 58,

              borderRadius: 3,

              textTransform: "none",

              fontSize: "1rem",

              fontWeight: 800,

              background:
                "linear-gradient(135deg,#6655FF,#00AEEF)",

              boxShadow:
                "0 12px 35px rgba(82,92,255,0.30)",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#5746FF,#009DDD)",
              },
            }}
          >
            {loading
              ? "Searching..."
              : "Search Flights"}
          </Button>

        </Box>


        {/* =====================================================
            POPULAR DESTINATIONS
        ===================================================== */}

        <Box
          sx={{
            maxWidth: "1080px",
            mx: "auto",
            mt: 5,
          }}
        >

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              mb: 2,
            }}
          >
            Popular destinations
          </Typography>


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
              gap: 1.5,
            }}
          >

            {[
              "Hyderabad",
              "Delhi",
              "Mumbai",
              "Bengaluru",
            ].map((city) => (

              <Button
                key={city}
                onClick={() =>
                  selectDestination(city)
                }
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",

                  textAlign: "left",

                  p: 2.2,

                  minHeight: 75,

                  borderRadius: 3,

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  background:
                    "rgba(255,255,255,0.025)",

                  color: "#FFFFFF",

                  textTransform: "none",

                  fontWeight: 700,

                  "&:hover": {
                    borderColor:
                      "rgba(108,99,255,0.6)",

                    background:
                      "rgba(108,99,255,0.08)",
                  },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {city}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#727D92",
                      fontSize: "0.75rem",
                      mt: 0.3,
                    }}
                  >
                    Explore flights
                  </Typography>
                </Box>
              </Button>

            ))}

          </Box>

        </Box>

      </Container>

    </Box>
  );
}


// ============================================================
// COMMON TEXT FIELD STYLE
// ============================================================

const fieldStyles = {

  "& .MuiOutlinedInput-root": {

    minHeight: 58,

    borderRadius: 3,

    background:
      "rgba(255,255,255,0.025)",

    "& fieldset": {
      borderColor:
        "rgba(255,255,255,0.10)",
    },

    "&:hover fieldset": {
      borderColor:
        "rgba(108,99,255,0.55)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6C63FF",
      borderWidth: 1,
    },
  },

  "& .MuiInputLabel-root": {
    color: "#8D97AA",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#8B7FFF",
  },

  "& .MuiOutlinedInput-input": {
    color: "#FFFFFF",
    fontSize: "0.95rem",
  },

  "& .MuiOutlinedInput-input::placeholder": {
    color: "#626D81",
    opacity: 1,
  },
};


export default FlightSearch;