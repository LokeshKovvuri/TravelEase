import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  ArrowBack,
  Lock,
  CheckCircle,
} from "@mui/icons-material";

import api from "../services/api";


function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();

  // ------------------------------------------------------------
  // Optional data passed from MyBookings
  // ------------------------------------------------------------

  const stateData = location.state || {};

  const [booking, setBooking] = useState(
    stateData.booking || null
  );

  const [hotel, setHotel] = useState(
    stateData.hotel || null
  );

  const [room, setRoom] = useState(
    stateData.room || null
  );

  const [checkIn, setCheckIn] = useState(
    stateData.checkIn || ""
  );

  const [checkOut, setCheckOut] = useState(
    stateData.checkOut || ""
  );

  const [guests, setGuests] = useState(
    stateData.guests || ""
  );

  const [loading, setLoading] = useState(
    !stateData.booking
  );

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [upiId, setUpiId] = useState("");

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // LOAD BOOKING
  // ============================================================

  useEffect(() => {
    const loadBooking = async () => {
      // If booking already came through navigation state,
      // no need to call the API again.
      if (stateData.booking) {
        setLoading(false);
        return;
      }

      if (!bookingId) {
        setError(
          "Booking ID is missing."
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log(
          "Loading booking:",
          bookingId
        );

        const response = await api.get(
          `/bookings/${bookingId}`
        );

        console.log(
          "Booking response:",
          response.data
        );

        const bookingData =
          response.data;

        setBooking(bookingData);

        // --------------------------------------------------------
        // Booking data
        // --------------------------------------------------------

        setCheckIn(
          bookingData.check_in || ""
        );

        setCheckOut(
          bookingData.check_out || ""
        );

        setGuests(
          bookingData.guests || ""
        );

        // --------------------------------------------------------
        // If API returns nested room information
        // --------------------------------------------------------

        if (bookingData.room) {
          setRoom(
            bookingData.room
          );
        }

        // --------------------------------------------------------
        // If API returns nested hotel information
        // --------------------------------------------------------

        if (bookingData.hotel) {
          setHotel(
            bookingData.hotel
          );
        }

      } catch (err) {
        console.error(
          "Failed to load booking:",
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

    loadBooking();
  }, [bookingId]);


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
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <CircularProgress
            sx={{
              color: "#6C63FF",
            }}
          />

          <Typography
            sx={{
              color: "#8F98A8",
              mt: 2,
            }}
          >
            Loading booking details...
          </Typography>
        </Box>
      </Box>
    );
  }


  // ============================================================
  // BOOKING NOT FOUND
  // ============================================================

  if (!booking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0B0F17",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Card
          sx={{
            background: "#161B22",
            border:
              "1px solid #2A3441",
            borderRadius: 4,
            p: 4,
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "#fff",
            }}
          >
            Booking not found
          </Typography>

          <Typography
            sx={{
              color: "#8F98A8",
              mt: 1,
              mb: 3,
            }}
          >
            We couldn't load this booking.
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              navigate("/my-bookings")
            }
            sx={{
              borderRadius: 2,
              px: 4,
              background:
                "linear-gradient(135deg, #6C63FF, #8B5CF6)",
            }}
          >
            Back to My Bookings
          </Button>
        </Card>
      </Box>
    );
  }


  // ============================================================
  // PRICE
  // ============================================================

  const roomPrice = Number(
    booking.total_price ??
    room?.price ??
    hotel?.price ??
    0
  );

  const taxes = Math.round(
    roomPrice * 0.12
  );

  const total =
    roomPrice + taxes;


  // ============================================================
  // PAYMENT
  // ============================================================

  const handlePayment = async () => {
    setError("");

    if (!booking.id) {
      setError(
        "Booking ID is missing."
      );
      return;
    }

    if (
      paymentMethod === "upi" &&
      !upiId.trim()
    ) {
      setError(
        "Please enter your UPI ID."
      );
      return;
    }

    try {
      setProcessing(true);

      const paymentMethodMap = {
        upi: "UPI",
        card: "CARD",
        netbanking: "NET_BANKING",
      };

      const backendPaymentMethod =
        paymentMethodMap[
          paymentMethod
        ];

      console.log(
        "Creating payment:",
        {
          booking_id: booking.id,
          payment_method:
            backendPaymentMethod,
        }
      );

      const response = await api.post(
        "/payments/",
        {
          booking_id: booking.id,
          payment_method:
            backendPaymentMethod,
        }
      );

      console.log(
        "Payment successful:",
        response.data
      );

      setProcessing(false);

      navigate(
        "/booking-success",
        {
          state: {
            booking,
            hotel,
            room,
            checkIn,
            checkOut,
            guests,
            roomPrice,
            taxes,
            total,
            paymentMethod:
              backendPaymentMethod,
            payment:
              response.data,
          },
        }
      );

    } catch (err) {
      console.error(
        "Payment failed:",
        err
      );

      setProcessing(false);

      setError(
        err.response?.data?.detail ||
        "Payment failed. Please try again."
      );
    }
  };


  // ============================================================
  // DISPLAY HELPERS
  // ============================================================

  const hotelName =
    hotel?.name ||
    booking.hotel_name ||
    "Hotel Booking";

  const hotelLocation =
    hotel?.location ||
    hotel?.city ||
    booking.hotel_location ||
    "TravelEase";

  const roomName =
    room?.room_type ||
    room?.name ||
    booking.room_type ||
    "Selected Room";


  // ============================================================
  // UI
  // ============================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0B0F17",
        color: "#fff",
        py: 5,
      }}
    >

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: {
            xs: 2,
            md: 4,
          },
        }}
      >

        {/* ================================================== */}
        {/* BACK */}
        {/* ================================================== */}

        <Button
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(-1)
          }
          sx={{
            color: "#B8C0CC",
            mb: 3,
          }}
        >
          Back to booking
        </Button>


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <Box sx={{ mb: 4 }}>

          <Typography
            sx={{
              color: "#00D4FF",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: 2,
              textTransform:
                "uppercase",
            }}
          >
            Secure checkout
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mt: 0.5,
              fontSize: {
                xs: "2.2rem",
                md: "3.5rem",
              },
            }}
          >
            Complete your payment
          </Typography>

          <Typography
            sx={{
              color: "#8F98A8",
              mt: 1,
            }}
          >
            Review your booking and
            choose your payment method.
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
        {/* MAIN */}
        {/* ================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1.5fr 0.8fr",
            },

            gap: 3,
            alignItems: "start",
          }}
        >

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <Box>

            {/* ================================================= */}
            {/* STAY */}
            {/* ================================================= */}

            <Card
              sx={{
                background: "#161B22",
                border:
                  "1px solid #2A3441",
                borderRadius: 4,
                mb: 3,
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

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                    mb: 2,
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

                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #202938, #11161F)",
                      display: "flex",
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      fontSize: "2.5rem",
                    }}
                  >
                    🏨
                  </Box>


                  <Box>

                    <Typography
                      fontWeight={700}
                      sx={{
                        color: "#fff",
                      }}
                    >
                      {hotelName}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#9AA4B2",
                        mt: 0.5,
                      }}
                    >
                      {hotelLocation}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#B8C0CC",
                        mt: 1,
                      }}
                    >
                      🛏 {roomName}
                    </Typography>

                  </Box>

                </Box>

              </CardContent>

            </Card>


            {/* ================================================= */}
            {/* TRIP */}
            {/* ================================================= */}

            <Card
              sx={{
                background: "#161B22",
                border:
                  "1px solid #2A3441",
                borderRadius: 4,
                mb: 3,
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

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                    mb: 2,
                  }}
                >
                  Your trip
                </Typography>


                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },

                    gap: 2,
                  }}
                >

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#8F98A8",
                      }}
                    >
                      Check-in
                    </Typography>

                    <Typography
                      sx={{
                        color: "#fff",
                        mt: 0.5,
                      }}
                    >
                      {checkIn ||
                        booking.check_in ||
                        "Not selected"}
                    </Typography>
                  </Box>


                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#8F98A8",
                      }}
                    >
                      Check-out
                    </Typography>

                    <Typography
                      sx={{
                        color: "#fff",
                        mt: 0.5,
                      }}
                    >
                      {checkOut ||
                        booking.check_out ||
                        "Not selected"}
                    </Typography>
                  </Box>


                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#8F98A8",
                      }}
                    >
                      Guests
                    </Typography>

                    <Typography
                      sx={{
                        color: "#fff",
                        mt: 0.5,
                      }}
                    >
                      {guests ||
                        booking.guests ||
                        1}{" "}
                      Guests
                    </Typography>
                  </Box>

                </Box>

              </CardContent>

            </Card>


            {/* ================================================= */}
            {/* PAYMENT METHODS */}
            {/* ================================================= */}

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
                  p: {
                    xs: 2.5,
                    md: 3,
                  },
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                    mb: 2,
                  }}
                >
                  Payment method
                </Typography>


                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                >

                  {/* UPI */}

                  <Box
                    sx={{
                      border:
                        paymentMethod ===
                        "upi"
                          ? "1px solid #6C63FF"
                          : "1px solid #2A3441",
                      borderRadius: 3,
                      mb: 2,
                      p: 1,
                    }}
                  >

                    <FormControlLabel
                      value="upi"
                      control={
                        <Radio
                          sx={{
                            color:
                              "#8F98A8",

                            "&.Mui-checked":
                              {
                                color:
                                  "#6C63FF",
                              },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#fff",
                          }}
                        >
                          UPI
                        </Typography>
                      }
                    />


                    {paymentMethod ===
                      "upi" && (
                      <TextField
                        fullWidth
                        value={upiId}
                        onChange={(e) =>
                          setUpiId(
                            e.target.value
                          )
                        }
                        placeholder="example@upi"
                        sx={{
                          mt: 1,

                          "& .MuiOutlinedInput-root":
                            {
                              color: "#fff",

                              "& fieldset":
                                {
                                  borderColor:
                                    "#2A3441",
                                },

                              "&:hover fieldset":
                                {
                                  borderColor:
                                    "#6C63FF",
                                },

                              "&.Mui-focused fieldset":
                                {
                                  borderColor:
                                    "#6C63FF",
                                },
                            },
                        }}
                      />
                    )}

                  </Box>


                  {/* CARD */}

                  <Box
                    sx={{
                      border:
                        paymentMethod ===
                        "card"
                          ? "1px solid #6C63FF"
                          : "1px solid #2A3441",
                      borderRadius: 3,
                      mb: 2,
                      p: 1,
                    }}
                  >

                    <FormControlLabel
                      value="card"
                      control={
                        <Radio
                          sx={{
                            color:
                              "#8F98A8",

                            "&.Mui-checked":
                              {
                                color:
                                  "#6C63FF",
                              },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#fff",
                          }}
                        >
                          Credit / Debit Card
                        </Typography>
                      }
                    />

                  </Box>


                  {/* NET BANKING */}

                  <Box
                    sx={{
                      border:
                        paymentMethod ===
                        "netbanking"
                          ? "1px solid #6C63FF"
                          : "1px solid #2A3441",
                      borderRadius: 3,
                      p: 1,
                    }}
                  >

                    <FormControlLabel
                      value="netbanking"
                      control={
                        <Radio
                          sx={{
                            color:
                              "#8F98A8",

                            "&.Mui-checked":
                              {
                                color:
                                  "#6C63FF",
                              },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#fff",
                          }}
                        >
                          Net Banking
                        </Typography>
                      }
                    />

                  </Box>

                </RadioGroup>

              </CardContent>

            </Card>

          </Box>


          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <Card
            sx={{
              background: "#161B22",
              border:
                "1px solid #2A3441",
              borderRadius: 4,

              position: {
                md: "sticky",
              },

              top: 20,
            }}
          >

            <CardContent
              sx={{
                p: 3,
              }}
            >

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: "#fff",
                  mb: 3,
                }}
              >
                Booking summary
              </Typography>


              {/* BOOKING ID */}

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
                    color: "#8F98A8",
                  }}
                >
                  Booking ID
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                  }}
                >
                  TEA-
                  {String(
                    booking.id
                  ).padStart(6, "0")}
                </Typography>

              </Box>


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
                    color: "#8F98A8",
                  }}
                >
                  Room
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                  }}
                >
                  ₹
                  {roomPrice.toLocaleString(
                    "en-IN"
                  )}
                </Typography>

              </Box>


              {/* TAX */}

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
                    color: "#8F98A8",
                  }}
                >
                  Taxes & fees
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                  }}
                >
                  ₹
                  {taxes.toLocaleString(
                    "en-IN"
                  )}
                </Typography>

              </Box>


              <Divider
                sx={{
                  borderColor:
                    "#2A3441",
                  my: 2,
                }}
              />


              {/* TOTAL */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  mb: 3,
                }}
              >

                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                  }}
                >
                  Total
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    color: "#fff",
                  }}
                >
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </Typography>

              </Box>


              {/* PAY */}

              <Button
                fullWidth
                variant="contained"
                disabled={processing}
                onClick={handlePayment}
                startIcon={
                  processing ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <Lock />
                  )
                }
                sx={{
                  minHeight: 54,
                  borderRadius: 2,
                  fontWeight: 700,

                  background:
                    "linear-gradient(135deg, #6C63FF, #8B5CF6)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #7C73FF, #9B6CFF)",
                  },
                }}
              >
                {processing
                  ? "Processing payment..."
                  : `Pay ₹${total.toLocaleString(
                      "en-IN"
                    )}`}
              </Button>


              {/* SECURE */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  gap: 0.5,
                  mt: 2,
                }}
              >

                <CheckCircle
                  sx={{
                    fontSize: 15,
                    color: "#22C55E",
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    color: "#8F98A8",
                  }}
                >
                  Secure booking · No
                  hidden fees
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Box>

      </Box>

    </Box>
  );
}


export default Payment;