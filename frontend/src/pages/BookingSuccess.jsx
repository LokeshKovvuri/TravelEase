import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../services/api";


function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateData = location.state || {};
  const bookingId = searchParams.get("booking_id");

  const [loadedBooking, setLoadedBooking] = useState(null);
  const [loading, setLoading] = useState(
    Boolean(bookingId && !stateData.booking)
  );
  const [loadError, setLoadError] = useState("");

  // A hosted checkout returns without React navigation state. Reload the
  // booking and briefly poll while the payment-provider webhook is processed.
  useEffect(() => {
    if (stateData.booking || !bookingId) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    let attempts = 0;
    let timer;

    const loadBooking = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        if (cancelled) return;

        setLoadedBooking(response.data);
        setLoadError("");
        setLoading(false);
        attempts += 1;

        if (
          response.data.status === "PENDING_PAYMENT" &&
          attempts < 10
        ) {
          timer = window.setTimeout(loadBooking, 3000);
        }
      } catch (error) {
        if (cancelled) return;
        setLoading(false);
        setLoadError(
          error.response?.data?.detail ||
          "Unable to load the booking confirmation."
        );
      }
    };

    loadBooking();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [bookingId, stateData.booking]);

  const booking = stateData.booking || loadedBooking;
  const payment = stateData.payment;
  const isConfirmed = (
    booking?.status === "CONFIRMED" ||
    payment?.status === "SUCCESS"
  );
  const isFlightBooking = Boolean(booking?.flight_id);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0B0F17",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 650,
          background: "#161B22",
          border: "1px solid #2A3441",
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 5, textAlign: "center" }}>
          {loading ? (
            <CircularProgress sx={{ color: "#8B5CF6", mb: 2 }} />
          ) : isConfirmed ? (
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "#22C55E", mb: 2 }}
            />
          ) : (
            <HourglassTopIcon
              sx={{ fontSize: 80, color: "#F59E0B", mb: 2 }}
            />
          )}

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "#FFFFFF", mb: 1 }}
          >
            {isConfirmed ? "Booking Confirmed!" : "Payment Processing"}
          </Typography>

          <Typography sx={{ color: "#8F98A8", mb: 4 }}>
            {isConfirmed
              ? "Your payment was successful and your booking has been confirmed."
              : "We are waiting for the payment provider to confirm your booking."}
          </Typography>

          {loadError && (
            <Typography sx={{ color: "#FCA5A5", mb: 3 }}>
              {loadError}
            </Typography>
          )}

          {booking && (
            <Box
              sx={{
                textAlign: "left",
                background: "#0F141C",
                borderRadius: 3,
                p: 3,
                mb: 3,
              }}
            >
              <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
                Booking ID: TEA-{String(booking.id).padStart(6, "0")}
              </Typography>

              <Typography sx={{ color: "#B8C0CC", mb: 1 }}>
                {isFlightBooking
                  ? "Type: Flight booking"
                  : `Hotel: ${stateData.hotel?.name || "Hotel booking"}`}
              </Typography>

              {!isFlightBooking && (
                <>
                  <Typography sx={{ color: "#B8C0CC", mb: 1 }}>
                    Room: {stateData.room?.room_type || "Selected room"}
                  </Typography>
                  <Typography sx={{ color: "#B8C0CC", mb: 1 }}>
                    Check-in: {stateData.checkIn || booking.check_in}
                  </Typography>
                  <Typography sx={{ color: "#B8C0CC", mb: 1 }}>
                    Check-out: {stateData.checkOut || booking.check_out}
                  </Typography>
                </>
              )}

              <Typography sx={{ color: "#B8C0CC", mb: 1 }}>
                Guests: {stateData.guests || booking.guests}
              </Typography>

              <Typography sx={{ color: isConfirmed ? "#22C55E" : "#F59E0B" }}>
                Payment: {isConfirmed ? "Successful" : "Processing"}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={() => navigate("/my-bookings")}
            sx={{
              px: 4,
              height: 50,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #6C63FF, #8B5CF6)",
            }}
          >
            View My Bookings
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BookingSuccess;
