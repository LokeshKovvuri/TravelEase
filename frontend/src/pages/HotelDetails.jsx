import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Rating,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  KingBed,
  LocationOn,
  Pool,
  Refresh,
  Restaurant,
  Wifi,
} from "@mui/icons-material";

import api from "../services/api";


function HotelDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || null,
    [rooms, selectedRoomId]
  );

  useEffect(() => {
    let active = true;

    const loadHotel = async () => {
      try {
        setLoading(true);
        setError("");
        const [hotelResponse, roomsResponse, wishlistResponse] = await Promise.all([
          api.get(`/hotels/${id}`),
          api.get("/rooms/", { params: { hotel_id: id } }),
          api.get("/wishlist/"),
        ]);
        if (!active) return;

        const availableRooms = roomsResponse.data || [];
        setHotel(hotelResponse.data);
        setRooms(availableRooms);
        setSelectedRoomId(
          availableRooms.find((room) => room.available_rooms > 0)?.id ||
          availableRooms[0]?.id ||
          null
        );
        setSaved(
          (wishlistResponse.data || []).some(
            (item) => item.hotel_id === Number(id)
          )
        );
        setLastUpdated(new Date());
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError.response?.data?.detail ||
          "Unable to load this hotel."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadHotel();
    return () => {
      active = false;
    };
  }, [id]);

  const refreshInventory = useCallback(async () => {
    try {
      setRefreshing(true);
      setError("");
      const [hotelResponse, roomsResponse] = await Promise.all([
        api.get(`/hotels/${id}`),
        api.get("/rooms/", { params: { hotel_id: id } }),
      ]);
      const refreshedRooms = roomsResponse.data || [];
      setHotel(hotelResponse.data);
      setRooms(refreshedRooms);
      setSelectedRoomId((currentRoomId) => {
        const currentRoom = refreshedRooms.find((room) => room.id === currentRoomId);
        if (currentRoom && currentRoom.available_rooms > 0) return currentRoomId;
        return refreshedRooms.find((room) => room.available_rooms > 0)?.id || null;
      });
      setLastUpdated(new Date());
    } catch (refreshError) {
      setError(
        refreshError.response?.data?.detail ||
        "Unable to refresh current room inventory."
      );
    } finally {
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    const refreshTimer = window.setInterval(refreshInventory, 30000);
    return () => window.clearInterval(refreshTimer);
  }, [refreshInventory]);

  const handleWishlist = async () => {
    if (!hotel || saving) return;

    try {
      setSaving(true);
      setError("");
      if (saved) {
        await api.delete(`/wishlist/${hotel.id}`);
        setSaved(false);
      } else {
        await api.post("/wishlist/", { hotel_id: hotel.id });
        setSaved(true);
      }
    } catch (saveError) {
      setError(
        saveError.response?.data?.detail ||
        "Unable to update your wishlist."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBookRoom = () => {
    if (!selectedRoom || selectedRoom.available_rooms <= 0) {
      setError("Choose an available room before continuing.");
      return;
    }

    navigate(`/hotels/${hotel.id}/booking`, {
      state: {
        roomId: selectedRoom.id,
        roomType: selectedRoom.room_type,
        roomPrice: selectedRoom.price,
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelLocation: `${hotel.city}, ${hotel.country}`,
        hotelImage: hotel.image_url || "",
        roomCapacity: selectedRoom.capacity,
        roomDescription: selectedRoom.description || "",
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#8B5CF6" }} />
      </Box>
    );
  }

  if (error && !hotel) {
    return (
      <Container sx={{ py: 5 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/hotels")}>
          Back to stays
        </Button>
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#0B0F17", py: 5 }}>
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/hotels")}
          sx={{ color: "#B8C0CC", mb: 3, textTransform: "none" }}
        >
          Back to stays
        </Button>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: "2.2rem", md: "3.25rem" } }}
            >
              {hotel.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
              <LocationOn sx={{ color: "#6C63FF" }} />
              <Typography sx={{ color: "#B8C0CC" }}>
                {hotel.city}, {hotel.country}
              </Typography>
            </Box>
          </Box>

          <Button
            startIcon={saved ? <Favorite /> : <FavoriteBorder />}
            onClick={handleWishlist}
            disabled={saving}
            sx={{
              border: "1px solid #2A3441",
              color: saved ? "#FF5C8A" : "#fff",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            {saved ? "Saved" : "Save"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2, alignItems: "center" }}>
          {lastUpdated && (
            <Typography sx={{ color: "#8992A5", fontSize: "0.75rem" }}>
              Inventory updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
          <Button
            size="small"
            startIcon={refreshing ? <CircularProgress size={14} color="inherit" /> : <Refresh />}
            disabled={refreshing}
            onClick={refreshInventory}
            sx={{ color: "#B8C0CC", textTransform: "none" }}
          >
            Refresh rooms
          </Button>
        </Box>

        <Box
          sx={{
            minHeight: { xs: 260, md: 420 },
            borderRadius: 4,
            overflow: "hidden",
            mb: 4,
            background: "linear-gradient(135deg, #202938, #11161F)",
          }}
        >
          {hotel.image_url ? (
            <Box
              component="img"
              src={hotel.image_url}
              alt={hotel.name}
              sx={{ width: "100%", height: "100%", minHeight: "inherit", objectFit: "cover" }}
            />
          ) : (
            <Box sx={{ minHeight: "inherit", display: "grid", placeItems: "center", fontSize: "7rem" }}>
              🏨
            </Box>
          )}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.45fr 0.9fr" }, gap: 3 }}>
          <Card sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Rating value={Number(hotel.rating) || 0} precision={0.1} readOnly />
                <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                  {Number(hotel.rating || 0).toFixed(1)} / 5
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800, mb: 1.5 }}>
                About this stay
              </Typography>
              <Typography sx={{ color: "#AAB2BF", lineHeight: 1.8 }}>
                {hotel.description || "A comfortable TravelEase stay in a great location."}
              </Typography>
              <Divider sx={{ borderColor: "#2A3441", my: 3 }} />
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
                Popular amenities
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
                {[
                  [<Wifi key="wifi" />, "Wi-Fi"],
                  [<Pool key="pool" />, "Pool"],
                  [<Restaurant key="restaurant" />, "Restaurant"],
                ].map(([icon, label]) => (
                  <Chip
                    key={label}
                    icon={icon}
                    label={label}
                    sx={{ color: "#D7DBE3", background: "#0F141C", border: "1px solid #293242" }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4, height: "fit-content" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
                Choose a room
              </Typography>
              {rooms.length === 0 ? (
                <Alert severity="info">No rooms have been added for this hotel yet.</Alert>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                  {rooms.map((room) => {
                    const available = room.available_rooms > 0;
                    const selected = room.id === selectedRoomId;
                    return (
                      <Box
                        key={room.id}
                        component="button"
                        type="button"
                        disabled={!available}
                        onClick={() => setSelectedRoomId(room.id)}
                        sx={{
                          textAlign: "left",
                          cursor: available ? "pointer" : "not-allowed",
                          p: 1.75,
                          borderRadius: 2.5,
                          background: selected ? "rgba(108,99,255,0.16)" : "#0F141C",
                          border: selected ? "1px solid #7768FF" : "1px solid #2A3441",
                          color: "#fff",
                          opacity: available ? 1 : 0.55,
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                          <Box>
                            <Typography sx={{ fontWeight: 800 }}>{room.room_type}</Typography>
                            <Typography sx={{ color: "#8992A5", fontSize: "0.78rem", mt: 0.3 }}>
                              Sleeps up to {room.capacity} · {available ? `${room.available_rooms} available` : "Sold out"}
                            </Typography>
                          </Box>
                          <KingBed sx={{ color: "#8B7DFF" }} />
                        </Box>
                        <Typography sx={{ color: "#fff", fontWeight: 800, mt: 1 }}>
                          ₹{Number(room.price).toLocaleString("en-IN")}
                          <Box component="span" sx={{ color: "#8992A5", fontWeight: 400, fontSize: "0.78rem" }}> / night</Box>
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
              <Button
                fullWidth
                variant="contained"
                disabled={!selectedRoom || selectedRoom.available_rooms <= 0}
                onClick={handleBookRoom}
                sx={{
                  mt: 2.5,
                  height: 50,
                  borderRadius: 2,
                  fontWeight: 800,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                }}
              >
                Reserve room
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default HotelDetails;
