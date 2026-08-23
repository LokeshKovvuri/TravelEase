import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

import {
  CheckCircle,
  Hotel,
  CalendarMonth,
  People,
  ConfirmationNumber,
  ArrowForward,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";


function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    booking,
    hotel,
    room,
    checkIn,
    checkOut,
    guests,
    total,
    paymentMethod,
  } = location.state || {};


  // --------------------------------------------------
  // Safety check
  // --------------------------------------------------

  if (!booking || !hotel) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0B0F17",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            background: "#161B22",
            border: "1px solid #2A3441",
            borderRadius: 4,
          }}
        >
          <CardContent
            sx={{
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: "#fff" }}
            >
              Booking details not found
            </Typography>

            <Typography
              sx={{
                color: "#8F98A8",
                mt: 1,
                mb: 3,
              }}
            >
              Please open your bookings to see your reservation.
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
              My Bookings
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }


  // --------------------------------------------------
  // Display total
  // --------------------------------------------------

  const displayTotal =
    total ??
    booking.total_price ??
    0;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0B0F17",
        py: {
          xs: 4,
          md: 7,
        },
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 850,
          mx: "auto",
        }}
      >

        {/* ============================================== */}
        {/* SUCCESS ICON */}
        {/* ============================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "rgba(34,197,94,0.12)",
              border:
                "1px solid rgba(34,197,94,0.35)",
            }}
          >
            <CheckCircle
              sx={{
                fontSize: 58,
                color: "#22C55E",
              }}
            />
          </Box>
        </Box>


        {/* ============================================== */}
        {/* HEADER */}
        {/* ============================================== */}

        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              color: "#22C55E",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Booking confirmed
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
            You're all set!
          </Typography>

          <Typography
            sx={{
              color: "#8F98A8",
              mt: 1,
              fontSize: "1rem",
            }}
          >
            Your hotel booking has been confirmed successfully.
          </Typography>
        </Box>


        {/* ============================================== */}
        {/* BOOKING CARD */}
        {/* ============================================== */}

        <Card
          sx={{
            background: "#161B22",
            border: "1px solid #2A3441",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >

          {/* ========================================== */}
          {/* HOTEL */}
          {/* ========================================== */}

          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
            }}
          >

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >

              {/* Image */}

              <Box
                sx={{
                  width: 100,
                  height: 90,
                  borderRadius: 3,
                  overflow: "hidden",
                  flexShrink: 0,
                  background:
                    "linear-gradient(135deg, #202938, #11161F)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Hotel
                    sx={{
                      fontSize: 42,
                      color: "#6C63FF",
                    }}
                  />
                )}

              </Box>


              {/* Hotel info */}

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  {hotel.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#8F98A8",
                    mt: 0.5,
                  }}
                >
                  {hotel.location}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#B8C0CC",
                    mt: 0.8,
                  }}
                >
                  {room?.room_type ||
                    "Selected room"}
                </Typography>
              </Box>

            </Box>

          </CardContent>


          <Divider
            sx={{
              borderColor: "#2A3441",
            }}
          />


          {/* ========================================== */}
          {/* DETAILS */}
          {/* ========================================== */}

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
                mb: 3,
              }}
            >
              Booking details
            </Typography>


            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >

              {/* Booking ID */}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#11161F",
                  border:
                    "1px solid #2A3441",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <ConfirmationNumber
                    sx={{
                      color: "#6C63FF",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#8F98A8",
                    }}
                  >
                    Booking ID
                  </Typography>
                </Box>

                <Typography
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  #{booking.id}
                </Typography>
              </Box>


              {/* Guests */}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#11161F",
                  border:
                    "1px solid #2A3441",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <People
                    sx={{
                      color: "#00D4FF",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#8F98A8",
                    }}
                  >
                    Guests
                  </Typography>
                </Box>

                <Typography
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  {guests ||
                    booking.guests ||
                    1}{" "}
                  {(guests ||
                    booking.guests ||
                    1) === 1
                    ? "Guest"
                    : "Guests"}
                </Typography>
              </Box>


              {/* Check in */}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#11161F",
                  border:
                    "1px solid #2A3441",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <CalendarMonth
                    sx={{
                      color: "#8B5CF6",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#8F98A8",
                    }}
                  >
                    Check-in
                  </Typography>
                </Box>

                <Typography
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  {checkIn ||
                    booking.check_in}
                </Typography>
              </Box>


              {/* Check out */}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#11161F",
                  border:
                    "1px solid #2A3441",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <CalendarMonth
                    sx={{
                      color: "#8B5CF6",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#8F98A8",
                    }}
                  >
                    Check-out
                  </Typography>
                </Box>

                <Typography
                  fontWeight={700}
                  sx={{
                    color: "#fff",
                  }}
                >
                  {checkOut ||
                    booking.check_out}
                </Typography>
              </Box>

            </Box>

          </CardContent>


          <Divider
            sx={{
              borderColor: "#2A3441",
            }}
          />


          {/* ========================================== */}
          {/* PAYMENT */}
          {/* ========================================== */}

          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
            }}
          >

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#8F98A8",
                  }}
                >
                  Payment status
                </Typography>

                <Typography
                  sx={{
                    color: "#22C55E",
                    fontWeight: 700,
                    mt: 0.5,
                  }}
                >
                  ✓ Successful
                </Typography>

                {paymentMethod && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#667080",
                    }}
                  >
                    Paid via{" "}
                    {paymentMethod.toUpperCase()}
                  </Typography>
                )}
              </Box>


              <Box
                sx={{
                  textAlign: "right",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8F98A8",
                  }}
                >
                  Total paid
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    color: "#fff",
                  }}
                >
                  ₹
                  {Number(
                    displayTotal
                  ).toLocaleString()}
                </Typography>
              </Box>

            </Box>

          </CardContent>

        </Card>


        {/* ============================================== */}
        {/* EMAIL MESSAGE */}
        {/* ============================================== */}

        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: 3,
            background:
              "rgba(34,197,94,0.07)",
            border:
              "1px solid rgba(34,197,94,0.2)",
            textAlign: "center",
          }}
        >

          <Typography
            sx={{
              color: "#B8C0CC",
            }}
          >
            📧 Your booking confirmation has been sent to your registered email address.
          </Typography>

        </Box>


        {/* ============================================== */}
        {/* ACTIONS */}
        {/* ============================================== */}

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "center",
            gap: 2,
            mt: 4,
          }}
        >

          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() =>
              navigate("/my-bookings")
            }
            sx={{
              minHeight: 52,
              px: 4,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              background:
                "linear-gradient(135deg, #6C63FF, #8B5CF6)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #7C73FF, #9B6CFF)",
              },
            }}
          >
            View My Bookings
          </Button>


          <Button
            variant="outlined"
            onClick={() =>
              navigate("/hotels")
            }
            sx={{
              minHeight: 52,
              px: 4,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              color: "#B8C0CC",
              borderColor: "#2A3441",
              "&:hover": {
                borderColor: "#6C63FF",
                color: "#fff",
              },
            }}
          >
            Explore More Hotels
          </Button>

        </Box>

      </Box>
    </Box>
  );
}

export default BookingSuccess;