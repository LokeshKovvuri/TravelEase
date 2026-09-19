import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import {
  AirplanemodeActive,
  ArrowBack,
  ArrowForward,
  Event,
  Person,
  Schedule,
} from "@mui/icons-material";


function FlightResults() {

  const navigate = useNavigate();

  const location = useLocation();

  const {
    flights = [],
    origin = "",
    destination = "",
    departureDate = "",
    passengers = 1,
  } = location.state || {};


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {

    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
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

  const getDuration = (
    departure,
    arrival
  ) => {

    if (!departure || !arrival) {
      return "--";
    }

    const start =
      new Date(departure);

    const end =
      new Date(arrival);

    const minutes = Math.round(
      (end - start) / 60000
    );

    if (minutes <= 0) {
      return "--";
    }

    const hours =
      Math.floor(minutes / 60);

    const mins =
      minutes % 60;

    return `${hours}h ${mins}m`;
  };


  // ============================================================
  // SELECT FLIGHT
  // ============================================================

  const selectFlight = (flight) => {

    navigate(
      `/flights/${flight.id}/booking`,
      {
        state: {
          flight,
          origin,
          destination,
          departureDate,
          passengers,
        },
      }
    );
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
          maxWidth: "1100px",
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
            navigate("/flights")
          }
          sx={{
            color: "#9CA6BA",
            textTransform: "none",
            mb: 3,
          }}
        >
          Modify search
        </Button>


        {/* =====================================================
            SEARCH SUMMARY
        ===================================================== */}

        <Card
          sx={{
            p: {
              xs: 2,
              md: 3,
            },

            borderRadius: 4,

            background:
              "linear-gradient(145deg, rgba(19,27,43,0.95), rgba(10,15,27,0.98))",

            border:
              "1px solid rgba(108,99,255,0.35)",

            color: "#FFFFFF",

            mb: 5,
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
            FLIGHT SEARCH
          </Typography>


          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >

            <Typography
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  md: "1.9rem",
                },
                fontWeight: 800,
              }}
            >
              {origin || "Departure"}
            </Typography>


            <ArrowForward
              sx={{
                color: "#6C63FF",
              }}
            />


            <Typography
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  md: "1.9rem",
                },
                fontWeight: 800,
              }}
            >
              {destination || "Destination"}
            </Typography>


            <Chip
              icon={<Event />}
              label={
                formatDate(departureDate)
              }
              sx={chipStyles}
            />


            <Chip
              icon={<Person />}
              label={`${passengers} Passenger${passengers > 1 ? "s" : ""}`}
              sx={chipStyles}
            />

          </Box>

        </Card>


        {/* =====================================================
            TITLE
        ===================================================== */}

        <Box
          sx={{
            mb: 3,
          }}
        >

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
            Available flights
          </Typography>

          <Typography
            sx={{
              color: "#8F9AAF",
              mt: 0.5,
            }}
          >
            {flights.length} flight
            {flights.length === 1 ? "" : "s"} found
          </Typography>

        </Box>


        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {flights.length === 0 && (

          <Card
            sx={{
              minHeight: 300,

              display: "flex",
              flexDirection: "column",

              alignItems: "center",
              justifyContent: "center",

              textAlign: "center",

              borderRadius: 4,

              background:
                "rgba(16,22,34,0.85)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              color: "#FFFFFF",

              p: 4,
            }}
          >

            <AirplanemodeActive
              sx={{
                fontSize: 55,
                color: "#657086",
                mb: 2,
              }}
            />

            <Typography
              sx={{
                fontSize: "1.3rem",
                fontWeight: 800,
              }}
            >
              No flights found
            </Typography>

            <Typography
              sx={{
                color: "#7D879B",
                mt: 1,
                mb: 3,
              }}
            >
              Try another route or departure date.
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                navigate("/flights")
              }
              sx={{
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                background:
                  "linear-gradient(135deg,#6655FF,#00AEEF)",
              }}
            >
              Search Again
            </Button>

          </Card>

        )}


        {/* =====================================================
            FLIGHT CARDS
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >

          {flights.map((flight) => (

            <Card
              key={flight.id}
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },

                borderRadius: 4,

                background:
                  "linear-gradient(145deg, rgba(18,25,39,0.96), rgba(9,14,25,0.98))",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "#FFFFFF",

                transition:
                  "all .2s ease",

                "&:hover": {
                  borderColor:
                    "rgba(108,99,255,0.55)",

                  transform:
                    "translateY(-2px)",

                  boxShadow:
                    "0 15px 45px rgba(0,0,0,0.25)",
                },
              }}
            >

              {/* =================================================
                  TOP
              ================================================= */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >

                <Box>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.1rem",
                    }}
                  >
                    {flight.airline}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#7F8A9E",
                      fontSize: "0.8rem",
                      mt: 0.3,
                    }}
                  >
                    {flight.flight_number}
                  </Typography>

                </Box>


                <Chip
                  label={flight.status}
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
                  my: 2,
                  borderColor:
                    "rgba(255,255,255,0.07)",
                }}
              />


              {/* =================================================
                  FLIGHT TIMING
              ================================================= */}

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },

                  alignItems: "center",

                  gap: 2,
                }}
              >

                {/* DEPARTURE */}

                <Box>

                  <Typography
                    sx={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                    }}
                  >
                    {formatTime(
                      flight.departure_time
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#9CA6BA",
                    }}
                  >
                    {flight.origin}
                  </Typography>

                </Box>


                {/* DURATION */}

                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >

                  <Typography
                    sx={{
                      color: "#7F8A9E",
                      fontSize: "0.75rem",
                    }}
                  >
                    Duration
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.7,
                      mt: 0.5,
                    }}
                  >

                    <Schedule
                      sx={{
                        fontSize: 17,
                        color: "#7C6CFF",
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {getDuration(
                        flight.departure_time,
                        flight.arrival_time
                      )}
                    </Typography>

                  </Box>

                </Box>


                {/* ARRIVAL */}

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
                      fontSize: "1.6rem",
                      fontWeight: 800,
                    }}
                  >
                    {formatTime(
                      flight.arrival_time
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#9CA6BA",
                    }}
                  >
                    {flight.destination}
                  </Typography>

                </Box>

              </Box>


              <Divider
                sx={{
                  my: 2,
                  borderColor:
                    "rgba(255,255,255,0.07)",
                }}
              />


              {/* =================================================
                  BOTTOM
              ================================================= */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >

                <Box>

                  <Typography
                    sx={{
                      color: "#7F8A9E",
                      fontSize: "0.75rem",
                    }}
                  >
                    Economy from
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "1.45rem",
                      fontWeight: 800,
                    }}
                  >
                    ₹{Number(
                      flight.economy_price
                    ).toLocaleString("en-IN")}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#42E6A4",
                      fontSize: "0.75rem",
                      mt: 0.3,
                    }}
                  >
                    {flight.available_seats} seats available
                  </Typography>

                </Box>


                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() =>
                    selectFlight(flight)
                  }
                  disabled={
                    flight.available_seats <= 0
                  }
                  sx={{
                    borderRadius: 2.5,

                    px: 3,

                    py: 1.2,

                    textTransform: "none",

                    fontWeight: 800,

                    background:
                      "linear-gradient(135deg,#6655FF,#00AEEF)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#5746FF,#009DDD)",
                    },
                  }}
                >
                  Select Flight
                </Button>

              </Box>

            </Card>

          ))}

        </Box>

      </Container>

    </Box>
  );
}


const chipStyles = {
  color: "#C6CCDA",
  background:
    "rgba(255,255,255,0.05)",
  border:
    "1px solid rgba(255,255,255,0.08)",
};


export default FlightResults;