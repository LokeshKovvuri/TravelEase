import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack, CheckCircle, KingBed } from "@mui/icons-material";

import api from "../services/api";


const inputSx = {
  "& .MuiOutlinedInput-root": { background: "#0F141C", borderRadius: 2, color: "#fff" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2A3441" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6C63FF" },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6C63FF" },
  "& input[type='date']::-webkit-calendar-picker-indicator": { filter: "invert(1)" },
};


function Booking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state: routeState = {} } = useLocation();
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const nights = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return 0;
    return Math.round((new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`)) / 86400000);
  }, [checkIn, checkOut]);
  const stayTotal = nights * Number(room?.price || 0);
  const validDates = Boolean(room && checkIn && checkOut && checkOut > checkIn);

  useEffect(() => {
    let active = true;

    const loadBookingContext = async () => {
      try {
        setPageLoading(true);
        setError("");
        const [hotelResponse, roomsResponse] = await Promise.all([
          api.get(`/hotels/${id}`),
          api.get("/rooms/", { params: { hotel_id: id } }),
        ]);
        if (!active) return;

        const rooms = roomsResponse.data || [];
        const requestedRoom = rooms.find((item) => item.id === Number(routeState.roomId));
        const firstAvailableRoom = rooms.find((item) => item.available_rooms > 0);
        setHotel(hotelResponse.data);
        setRoom(requestedRoom || firstAvailableRoom || rooms[0] || null);
        if (!requestedRoom && !firstAvailableRoom && rooms.length === 0) {
          setError("This hotel does not have any bookable rooms yet.");
        }
      } catch (loadError) {
        if (active) setError(loadError.response?.data?.detail || "Unable to load the current stay details.");
      } finally {
        if (active) setPageLoading(false);
      }
    };

    loadBookingContext();
    return () => { active = false; };
  }, [id, routeState.roomId]);

  useEffect(() => {
    if (!validDates) {
      setAvailability(null);
      return undefined;
    }

    let active = true;
    const refreshAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        const response = await api.get(`/rooms/${room.id}/availability`, {
          params: { check_in: checkIn, check_out: checkOut },
        });
        if (active) setAvailability(response.data);
      } catch (availabilityError) {
        if (active) {
          setAvailability(null);
          setError(availabilityError.response?.data?.detail || "Unable to check room availability.");
        }
      } finally {
        if (active) setAvailabilityLoading(false);
      }
    };

    refreshAvailability();
    const refreshTimer = window.setInterval(refreshAvailability, 30000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [checkIn, checkOut, room?.id, validDates]);

  const handleContinue = async () => {
    setError("");
    if (!room) return setError("No room is available for this stay. Please choose another hotel.");
    if (!checkIn || !checkOut || nights <= 0) return setError("Choose a valid check-in and check-out date.");
    if (checkIn < today) return setError("Check-in date cannot be in the past.");
    if (guests < 1 || guests > room.capacity) {
      return setError(`This room accommodates up to ${room.capacity} guest${room.capacity === 1 ? "" : "s"}.`);
    }
    if (availability && availability.available_rooms <= 0) {
      return setError("This room is no longer available for those dates. Try different dates or choose another room.");
    }

    try {
      setLoading(true);
      const response = await api.post("/bookings/", {
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: Number(guests),
      });
      const booking = response.data;
      navigate(`/payment/${booking.id}`, {
        state: {
          booking,
          hotel: {
            id: hotel.id,
            name: hotel.name,
            location: [hotel.address, hotel.city, hotel.country].filter(Boolean).join(", "),
            image: hotel.image_url || "",
            price: Number(room.price),
          },
          room,
          checkIn,
          checkOut,
          guests,
          roomPrice: Number(booking.total_price),
          taxes: 0,
          total: Number(booking.total_price),
        },
      });
    } catch (bookingError) {
      setError(bookingError.response?.data?.detail || "Unable to create your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}><CircularProgress sx={{ color: "#8B5CF6" }} /></Box>;
  }

  if (!hotel || !room) {
    return (
      <Container sx={{ py: 5 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(`/hotels/${id}`)} sx={{ color: "#B8C0CC", textTransform: "none" }}>Back to hotel</Button>
        <Alert severity="error" sx={{ mt: 3 }}>{error || "This stay is not available for booking."}</Alert>
      </Container>
    );
  }

  const availabilityText = availability
    ? availability.available_rooms > 0
      ? `${availability.available_rooms} room${availability.available_rooms === 1 ? "" : "s"} available for these dates`
      : "Sold out for these dates"
    : "Select both dates to check live availability";

  return (
    <Box sx={{ minHeight: "100vh", background: "#0B0F17", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(`/hotels/${hotel.id}`)} sx={{ color: "#B8C0CC", mb: 3, textTransform: "none" }}>Back to hotel</Button>
        <Typography sx={{ color: "#00D4FF", fontSize: "0.8rem", fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>Secure reservation</Typography>
        <Typography variant="h2" sx={{ color: "#fff", fontWeight: 800, mt: 0.75, fontSize: { xs: "2.25rem", md: "3.4rem" } }}>Complete your booking</Typography>
        <Typography sx={{ color: "#9AA4B2", mt: 1 }}>Availability refreshes automatically while you choose your dates.</Typography>
        {error && <Alert severity="error" onClose={() => setError("")} sx={{ mt: 3 }}>{error}</Alert>}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.35fr 0.85fr" }, gap: 3, mt: 4 }}>
          <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 4, background: "#161B22", border: "1px solid #2A3441" }}>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, mb: 2.5 }}>Your trip</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField label="Check-in" type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: today }} sx={inputSx} />
              <TextField label="Check-out" type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: checkIn || today }} sx={inputSx} />
              <TextField select label="Guests" value={guests} onChange={(event) => setGuests(Number(event.target.value))} sx={inputSx}>
                {Array.from({ length: room.capacity }, (_, index) => index + 1).map((value) => <MenuItem key={value} value={value}>{value} guest{value === 1 ? "" : "s"}</MenuItem>)}
              </TextField>
            </Box>
            <Box sx={{ mt: 2.5, p: 2, borderRadius: 2.5, background: availability?.available_rooms === 0 ? "rgba(239,68,68,.12)" : "rgba(16,185,129,.1)", border: "1px solid #2A3441", display: "flex", alignItems: "center", gap: 1.25 }}>
              {availabilityLoading ? <CircularProgress size={18} sx={{ color: "#8B7DFF" }} /> : <CheckCircle sx={{ color: availability?.available_rooms === 0 ? "#F87171" : "#34D399" }} />}
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{availabilityText}</Typography>
                {availability && <Typography sx={{ color: "#9AA4B2", fontSize: "0.75rem", mt: 0.25 }}>Live inventory includes reservations currently at checkout.</Typography>}
              </Box>
            </Box>
          </Paper>

          <Card sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4, height: "fit-content" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>Your stay</Typography>
              <Divider sx={{ borderColor: "#2A3441", my: 2 }} />
              <Typography sx={{ color: "#fff", fontWeight: 800 }}>{hotel.name}</Typography>
              <Typography sx={{ color: "#9AA4B2", fontSize: "0.85rem", mt: 0.5 }}>{hotel.city}, {hotel.country}</Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}><KingBed sx={{ color: "#8B7DFF" }} /><Typography sx={{ color: "#D7DBE3" }}>{room.room_type}</Typography></Box>
              <Typography sx={{ color: "#9AA4B2", fontSize: "0.8rem", mt: 0.5 }}>Sleeps up to {room.capacity}</Typography>
              <Divider sx={{ borderColor: "#2A3441", my: 2.5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", color: "#B8C0CC" }}><Typography>₹{Number(room.price).toLocaleString("en-IN")} × {nights || 0} nights</Typography><Typography>₹{stayTotal.toLocaleString("en-IN")}</Typography></Box>
              <Typography sx={{ color: "#8992A5", fontSize: "0.75rem", mt: 1 }}>The confirmed total comes from the server at payment. No extra client-side taxes are added.</Typography>
              <Button fullWidth variant="contained" disabled={loading || !validDates || availability?.available_rooms === 0} onClick={handleContinue} sx={{ mt: 3, height: 52, borderRadius: 2, textTransform: "none", fontWeight: 800, background: "linear-gradient(135deg, #6C63FF, #00B4E8)" }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : "Continue to payment"}
              </Button>
              <Typography sx={{ color: "#8992A5", textAlign: "center", fontSize: "0.72rem", mt: 1.5 }}>Live availability refreshes every 30 seconds.</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}


export default Booking;
