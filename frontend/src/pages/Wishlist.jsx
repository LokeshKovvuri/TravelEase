import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import {
  Delete,
  Favorite,
  LocationOn,
  Search,
} from "@mui/icons-material";

import api from "../services/api";


function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/wishlist/");
      setItems(response.data || []);
    } catch (loadError) {
      setError(
        loadError.response?.data?.detail ||
        "Unable to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeHotel = async (hotelId) => {
    try {
      setRemovingId(hotelId);
      setError("");
      await api.delete(`/wishlist/${hotelId}`);
      setItems((currentItems) => currentItems.filter(
        (item) => item.hotel_id !== hotelId
      ));
    } catch (removeError) {
      setError(
        removeError.response?.data?.detail ||
        "Unable to remove this hotel from your wishlist."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#8B5CF6" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#0B0F17", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: "#00D4FF", fontWeight: 800, fontSize: "0.78rem", letterSpacing: 1.6 }}>
            YOUR COLLECTION
          </Typography>
          <Typography variant="h3" sx={{ color: "#fff", fontWeight: 900, mt: 0.8 }}>
            Saved stays
          </Typography>
          <Typography sx={{ color: "#8992A5", mt: 1 }}>
            Keep the places you love close for your next trip.
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {items.length === 0 ? (
          <Card sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4 }}>
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Favorite sx={{ color: "#8B7DFF", fontSize: 54, mb: 1 }} />
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800 }}>
                Nothing saved yet
              </Typography>
              <Typography sx={{ color: "#8992A5", mt: 1, mb: 3 }}>
                Browse stays and save the ones that feel right.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={() => navigate("/hotels")}
                sx={{ borderRadius: 2, px: 3, textTransform: "none", background: "linear-gradient(135deg, #6C63FF, #8B5CF6)" }}
              >
                Explore stays
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }, gap: 2.25 }}>
            {items.map((item) => {
              const hotel = item.hotel;
              return (
                <Card
                  key={item.id}
                  sx={{
                    overflow: "hidden",
                    background: "#161B22",
                    border: "1px solid #2A3441",
                    borderRadius: 4,
                    transition: "transform .2s ease, border-color .2s ease",
                    "&:hover": { transform: "translateY(-4px)", borderColor: "#6C63FF" },
                  }}
                >
                  <Box sx={{ height: 190, position: "relative", background: "#202938" }}>
                    {hotel.image_url ? (
                      <Box component="img" src={hotel.image_url} alt={hotel.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Box sx={{ height: "100%", display: "grid", placeItems: "center", fontSize: "4rem" }}>🏨</Box>
                    )}
                    <IconButton
                      aria-label={`Remove ${hotel.name} from wishlist`}
                      onClick={() => removeHotel(item.hotel_id)}
                      disabled={removingId === item.hotel_id}
                      sx={{
                        position: "absolute", top: 12, right: 12,
                        background: "rgba(11,15,23,.78)", color: "#FF6B8F",
                        "&:hover": { background: "rgba(11,15,23,.95)" },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 2.25 }}>
                    <Typography variant="h6" noWrap sx={{ color: "#fff", fontWeight: 800 }}>
                      {hotel.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.8 }}>
                      <LocationOn sx={{ color: "#8B7DFF", fontSize: 17 }} />
                      <Typography noWrap sx={{ color: "#8992A5", fontSize: "0.82rem" }}>
                        {hotel.city}, {hotel.country}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1.4 }}>
                      <Rating value={Number(hotel.rating) || 0} precision={0.1} size="small" readOnly />
                      <Typography sx={{ color: "#DDE1E8", fontSize: "0.8rem", fontWeight: 700 }}>
                        {Number(hotel.rating || 0).toFixed(1)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 1 }}>
                      <Box>
                        <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: "1.1rem" }}>
                          ₹{Number(hotel.price_per_night).toLocaleString("en-IN")}
                        </Typography>
                        <Typography sx={{ color: "#8992A5", fontSize: "0.72rem" }}>per night</Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                        sx={{ color: "#fff", textTransform: "none", background: "rgba(108,99,255,.18)", borderRadius: 2 }}
                      >
                        View stay
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Wishlist;
