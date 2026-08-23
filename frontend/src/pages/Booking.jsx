import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  ArrowBack,
  KingBed,
  CheckCircle,
} from "@mui/icons-material";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";


function Booking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const bookingData = location.state || {};

  const roomId = bookingData.roomId;


  // =========================================================
  // HOTEL / ROOM DATA
  // =========================================================

  const hotel = {
    id: id,

    name:
      bookingData.hotelName ||
      "Ocean Pearl Resort",

    location:
      bookingData.hotelLocation ||
      "Calangute, Goa, India",

    room:
      bookingData.roomType ||
      "Deluxe King Room",

    price:
      Number(bookingData.roomPrice) ||
      4500,

    image:
      bookingData.hotelImage ||
      "",
  };


  // =========================================================
  // FORM STATE
  // =========================================================

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // =========================================================
  // TODAY
  // =========================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];


  // =========================================================
  // DATE CALCULATION
  // =========================================================

  let nights = 0;

  if (checkIn && checkOut) {
    const start = new Date(
      `${checkIn}T00:00:00`
    );

    const end = new Date(
      `${checkOut}T00:00:00`
    );

    const difference =
      end.getTime() - start.getTime();

    nights = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  }


  // =========================================================
  // PRICE CALCULATION
  // =========================================================

  const roomTotal =
    nights > 0
      ? hotel.price * nights
      : 0;

  const taxes =
    nights > 0
      ? Math.round(roomTotal * 0.12)
      : 0;

  const total =
    roomTotal + taxes;


  // =========================================================
  // CREATE BOOKING
  // =========================================================

  const handleContinue = async () => {
    setError("");


    // -----------------------------------------
    // Validate room
    // -----------------------------------------

    if (!roomId) {
      setError(
        "No room has been selected. Please go back and select a room."
      );

      return;
    }


    // -----------------------------------------
    // Validate check-in
    // -----------------------------------------

    if (!checkIn) {
      setError(
        "Please select your check-in date."
      );

      return;
    }


    // -----------------------------------------
    // Validate check-out
    // -----------------------------------------

    if (!checkOut) {
      setError(
        "Please select your check-out date."
      );

      return;
    }


    // -----------------------------------------
    // Validate dates
    // -----------------------------------------

    if (checkIn < today) {
      setError(
        "Check-in date cannot be in the past."
      );

      return;
    }


    if (checkOut <= checkIn) {
      setError(
        "Check-out date must be after check-in date."
      );

      return;
    }


    // -----------------------------------------
    // Validate guests
    // -----------------------------------------

    if (guests < 1) {
      setError(
        "At least one guest is required."
      );

      return;
    }


    // -----------------------------------------
    // Validate nights
    // -----------------------------------------

    if (nights <= 0) {
      setError(
        "Please select valid check-in and check-out dates."
      );

      return;
    }


    try {
      setLoading(true);


      // =======================================
      // CREATE BOOKING
      // =======================================

      // IMPORTANT:
      // api.js already has:
      //
      // http://127.0.0.1:8000/api/v1
      //
      // Therefore we use only /bookings/
      // here.

      const response = await api.post(
        "/bookings/",
        {
          room_id: Number(roomId),

          check_in: checkIn,

          check_out: checkOut,

          guests: Number(guests),
        }
      );


      const booking = response.data;


      console.log(
        "Booking created successfully:",
        booking
      );


      // =======================================
      // PREPARE ROOM DATA
      // =======================================

      const room = {
        id: Number(roomId),

        room_type: hotel.room,

        price: hotel.price,
      };


      // =======================================
      // GO TO PAYMENT
      // =======================================

      navigate(
        `/hotels/${id}/payment`,
        {
          state: {

            // Backend booking
            booking,

            // Hotel information
            hotel: {
              id: hotel.id,

              name: hotel.name,

              location: hotel.location,

              image: hotel.image,

              price: hotel.price,
            },

            // Selected room
            room,

            // Booking dates
            checkIn,

            checkOut,

            // Guests
            guests,

            // Special request
            specialRequest,

            // Price information
            nights,

            roomTotal,

            taxes,

            total,
          },
        }
      );


    } catch (err) {
      console.error(
        "Booking creation failed:",
        err
      );


      const message =
        err?.response?.data?.detail ||
        "Unable to create booking. Please try again.";


      setError(message);


    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",

        background: "#0B0F17",

        py: {
          xs: 3,
          md: 5,
        },
      }}
    >

      <Container maxWidth="xl">

        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        <Button
          startIcon={<ArrowBack />}

          onClick={() =>
            navigate(-1)
          }

          sx={{
            color: "#B8C0CC",

            mb: 3,

            textTransform: "none",

            "&:hover": {
              color: "#FFFFFF",

              background:
                "transparent",
            },
          }}
        >
          Back to hotel
        </Button>


        {/* ================================================= */}
        {/* HEADING */}
        {/* ================================================= */}

        <Box sx={{ mb: 4 }}>

          <Typography
            sx={{
              color: "#00D4FF",

              fontSize: "0.85rem",

              fontWeight: 700,

              textTransform:
                "uppercase",

              letterSpacing: 2,

              mb: 1,
            }}
          >
            Complete your booking
          </Typography>


          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,

              fontSize: {
                xs: "2.2rem",
                md: "3.5rem",
              },

              color: "#FFFFFF",
            }}
          >
            Almost there
          </Typography>


          <Typography
            sx={{
              color: "#8F98A8",

              mt: 1,
            }}
          >
            Enter your stay details and review your booking.
          </Typography>

        </Box>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <Alert
            severity="error"

            onClose={() =>
              setError("")
            }

            sx={{
              mb: 3,

              background:
                "#2A1619",

              color: "#FFFFFF",

              border:
                "1px solid #5A252B",

              "& .MuiAlert-icon": {
                color: "#EF4444",
              },
            }}
          >
            {error}
          </Alert>
        )}


        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              lg: "1fr 380px",
            },

            gap: 4,
          }}
        >

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <Box>

            {/* ================================================= */}
            {/* HOTEL SUMMARY */}
            {/* ================================================= */}

            <Paper
              elevation={0}

              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },

                mb: 3,

                borderRadius: 4,

                background:
                  "#161B22",

                border:
                  "1px solid #2A3441",
              }}
            >

              <Typography
                variant="h6"

                fontWeight={700}

                sx={{
                  mb: 2,

                  color: "#FFFFFF",
                }}
              >
                Your stay
              </Typography>


              <Box
                sx={{
                  display: "flex",

                  gap: 2,

                  alignItems:
                    "center",
                }}
              >

                {/* HOTEL IMAGE */}

                <Box
                  sx={{
                    width: 90,

                    height: 90,

                    borderRadius: 3,

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    overflow:
                      "hidden",

                    flexShrink: 0,

                    background:
                      "linear-gradient(135deg, #202938, #11161F)",
                  }}
                >

                  {hotel.image ? (
                    <Box
                      component="img"

                      src={hotel.image}

                      alt={hotel.name}

                      sx={{
                        width: "100%",

                        height: "100%",

                        objectFit:
                          "cover",
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize:
                          "2.5rem",
                      }}
                    >
                      🏖️
                    </Typography>
                  )}

                </Box>


                {/* HOTEL DETAILS */}

                <Box>

                  <Typography
                    variant="h6"

                    fontWeight={700}

                    sx={{
                      color:
                        "#FFFFFF",
                    }}
                  >
                    {hotel.name}
                  </Typography>


                  <Typography
                    variant="body2"

                    sx={{
                      color:
                        "#8F98A8",
                    }}
                  >
                    {hotel.location}
                  </Typography>


                  <Box
                    sx={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: 1,

                      mt: 1,
                    }}
                  >

                    <KingBed
                      sx={{
                        fontSize: 18,

                        color:
                          "#8B5CF6",
                      }}
                    />


                    <Typography
                      variant="body2"

                      sx={{
                        color:
                          "#B8C0CC",
                      }}
                    >
                      {hotel.room}
                    </Typography>

                  </Box>

                </Box>

              </Box>

            </Paper>


            {/* ================================================= */}
            {/* YOUR TRIP */}
            {/* ================================================= */}

            <Paper
              elevation={0}

              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },

                mb: 3,

                borderRadius: 4,

                background:
                  "#161B22",

                border:
                  "1px solid #2A3441",
              }}
            >

              <Typography
                variant="h6"

                fontWeight={700}

                sx={{
                  mb: 3,

                  color:
                    "#FFFFFF",
                }}
              >
                Your trip
              </Typography>


              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",

                    sm: "1fr",

                    md: "1fr 1fr 180px",
                  },

                  gap: 2,

                  alignItems:
                    "end",
                }}
              >

                {/* CHECK-IN */}

                <Box
                  sx={{
                    width:
                      "100%",
                  }}
                >

                  <Typography
                    sx={{
                      color:
                        "#9AA4B2",

                      fontSize:
                        "0.78rem",

                      fontWeight: 500,

                      mb: 0.8,

                      ml: 0.5,
                    }}
                  >
                    Check-in
                  </Typography>


                  <TextField
                    fullWidth

                    type="date"

                    value={checkIn}

                    onChange={(e) =>
                      setCheckIn(
                        e.target.value
                      )
                    }

                    inputProps={{
                      min: today,
                    }}

                    sx={{
                      "& .MuiOutlinedInput-root":
                        {
                          height: 56,

                          background:
                            "#161B22",

                          borderRadius: 2,

                          color:
                            "#FFFFFF",
                        },

                      "& .MuiOutlinedInput-input":
                        {
                          color:
                            "#FFFFFF",

                          padding:
                            "16px 14px",

                          fontSize:
                            "0.95rem",
                        },

                      "& .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#2A3441",
                        },

                      "&:hover .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#6C63FF",
                        },

                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#6C63FF",

                          borderWidth:
                            "1px",
                        },

                      "& input[type='date']::-webkit-calendar-picker-indicator":
                        {
                          filter:
                            "invert(1)",

                          opacity: 0.8,

                          cursor:
                            "pointer",

                          width: 18,

                          height: 18,
                        },
                    }}
                  />

                </Box>


                {/* CHECK-OUT */}

                <Box
                  sx={{
                    width:
                      "100%",
                  }}
                >

                  <Typography
                    sx={{
                      color:
                        "#9AA4B2",

                      fontSize:
                        "0.78rem",

                      fontWeight: 500,

                      mb: 0.8,

                      ml: 0.5,
                    }}
                  >
                    Check-out
                  </Typography>


                  <TextField
                    fullWidth

                    type="date"

                    value={checkOut}

                    onChange={(e) =>
                      setCheckOut(
                        e.target.value
                      )
                    }

                    inputProps={{
                      min:
                        checkIn ||
                        today,
                    }}

                    sx={{
                      "& .MuiOutlinedInput-root":
                        {
                          height: 56,

                          background:
                            "#161B22",

                          borderRadius: 2,

                          color:
                            "#FFFFFF",
                        },

                      "& .MuiOutlinedInput-input":
                        {
                          color:
                            "#FFFFFF",

                          padding:
                            "16px 14px",

                          fontSize:
                            "0.95rem",
                        },

                      "& .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#2A3441",
                        },

                      "&:hover .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#6C63FF",
                        },

                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#6C63FF",

                          borderWidth:
                            "1px",
                        },

                      "& input[type='date']::-webkit-calendar-picker-indicator":
                        {
                          filter:
                            "invert(1)",

                          opacity: 0.8,

                          cursor:
                            "pointer",

                          width: 18,

                          height: 18,
                        },
                    }}
                  />

                </Box>


                {/* GUESTS */}

                <Box
                  sx={{
                    width:
                      "100%",
                  }}
                >

                  <Typography
                    sx={{
                      color:
                        "#9AA4B2",

                      fontSize:
                        "0.78rem",

                      fontWeight: 500,

                      mb: 0.8,

                      ml: 0.5,
                    }}
                  >
                    Guests
                  </Typography>


                  <TextField
                    select

                    fullWidth

                    value={guests}

                    onChange={(e) =>
                      setGuests(
                        Number(
                          e.target.value
                        )
                      )
                    }

                    sx={{
                      "& .MuiOutlinedInput-root":
                        {
                          height: 56,

                          background:
                            "#161B22",

                          borderRadius: 2,

                          color:
                            "#FFFFFF",
                        },

                      "& .MuiOutlinedInput-input":
                        {
                          padding:
                            "16px 14px",

                          color:
                            "#FFFFFF",
                        },

                      "& .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#2A3441",
                        },

                      "&:hover .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#6C63FF",
                        },

                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#6C63FF",
                        },
                    }}
                  >

                    {[1, 2, 3, 4, 5, 6].map(
                      (number) => (
                        <MenuItem
                          key={number}

                          value={number}
                        >
                          {number}{" "}

                          {number === 1
                            ? "Guest"
                            : "Guests"}
                        </MenuItem>
                      )
                    )}

                  </TextField>

                </Box>

              </Box>


              {/* NIGHTS */}

              {nights > 0 && (
                <Typography
                  sx={{
                    color:
                      "#22C55E",

                    mt: 2,

                    fontSize:
                      "0.9rem",
                  }}
                >
                  {nights}{" "}

                  {nights === 1
                    ? "night"
                    : "nights"}{" "}

                  selected
                </Typography>
              )}

            </Paper>


            {/* ================================================= */}
            {/* SPECIAL REQUEST */}
            {/* ================================================= */}

            <Paper
              elevation={0}

              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },

                borderRadius: 4,

                background:
                  "#161B22",

                border:
                  "1px solid #2A3441",
              }}
            >

              <Typography
                variant="h6"

                fontWeight={700}

                sx={{
                  mb: 2,

                  color:
                    "#FFFFFF",
                }}
              >
                Special requests
              </Typography>


              <TextField
                fullWidth

                multiline

                minRows={4}

                placeholder="Anything you'd like the hotel to know?"

                value={
                  specialRequest
                }

                onChange={(e) =>
                  setSpecialRequest(
                    e.target.value
                  )
                }

                sx={{
                  "& .MuiInputBase-root":
                    {
                      color:
                        "#FFFFFF",
                    },

                  "& .MuiInputBase-input":
                    {
                      color:
                        "#FFFFFF",
                    },

                  "& .MuiInputBase-input::placeholder":
                    {
                      color:
                        "#8F98A8",

                      opacity: 1,
                    },

                  "& .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor:
                        "#2A3441",
                    },

                  "&:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor:
                        "#6C63FF",
                    },

                  "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor:
                        "#6C63FF",
                    },
                }}
              />

            </Paper>

          </Box>


          {/* ================================================= */}
          {/* RIGHT - BOOKING SUMMARY */}
          {/* ================================================= */}

          <Box>

            <Paper
              elevation={0}

              sx={{
                p: 3,

                borderRadius: 4,

                background:
                  "#161B22",

                border:
                  "1px solid #2A3441",

                position: {
                  lg: "sticky",
                },

                top: {
                  lg: 100,
                },
              }}
            >

              <Typography
                variant="h5"

                fontWeight={800}

                sx={{
                  mb: 3,

                  color:
                    "#FFFFFF",
                }}
              >
                Booking summary
              </Typography>


              {/* ROOM */}

              <Box
                sx={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  mb: 2,
                }}
              >

                <Typography
                  sx={{
                    color:
                      "#8F98A8",
                  }}
                >
                  Room
                </Typography>


                <Typography
                  sx={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  ₹
                  {roomTotal.toLocaleString()}
                </Typography>

              </Box>


              {/* TAXES */}

              <Box
                sx={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  mb: 2,
                }}
              >

                <Typography
                  sx={{
                    color:
                      "#8F98A8",
                  }}
                >
                  Taxes & fees
                </Typography>


                <Typography
                  sx={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  ₹
                  {taxes.toLocaleString()}
                </Typography>

              </Box>


              <Divider
                sx={{
                  borderColor:
                    "#2A3441",

                  my: 3,
                }}
              />


              {/* TOTAL */}

              <Box
                sx={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  mb: 3,
                }}
              >

                <Typography
                  variant="h6"

                  fontWeight={700}

                  sx={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  Total
                </Typography>


                <Typography
                  variant="h5"

                  fontWeight={800}

                  sx={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  ₹
                  {total.toLocaleString()}
                </Typography>

              </Box>


              {/* CONTINUE */}

              <Button
                fullWidth

                size="large"

                variant="contained"

                disabled={loading}

                onClick={
                  handleContinue
                }

                sx={{
                  height: 55,

                  borderRadius: 2,

                  fontWeight: 700,

                  textTransform:
                    "none",

                  background:
                    "linear-gradient(135deg, #6C63FF, #8B5CF6)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #7C73FF, #9B6CFF)",
                  },

                  "&.Mui-disabled": {
                    background:
                      "#3B356B",

                    color:
                      "#999",
                  },
                }}
              >

                {loading ? (
                  <Box
                    sx={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: 1,
                    }}
                  >

                    <CircularProgress
                      size={20}

                      sx={{
                        color:
                          "#FFFFFF",
                      }}
                    />

                    Creating booking...

                  </Box>
                ) : (
                  "Continue to payment"
                )}

              </Button>


              {/* SECURITY */}

              <Box
                sx={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: 1,

                  mt: 2,

                  justifyContent:
                    "center",
                }}
              >

                <CheckCircle
                  sx={{
                    fontSize: 17,

                    color:
                      "#22C55E",
                  }}
                />


                <Typography
                  variant="caption"

                  sx={{
                    color:
                      "#667080",
                  }}
                >
                  Secure booking · No hidden fees
                </Typography>

              </Box>

            </Paper>

          </Box>

        </Box>

      </Container>

    </Box>
  );
}


export default Booking;