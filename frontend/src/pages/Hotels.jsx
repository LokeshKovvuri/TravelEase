import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import {
  Hotel,
  Search,
} from "@mui/icons-material";

import HotelCard from "../components/hotel/HotelCard";
import api from "../services/api";


function Hotels() {
  const [searchParams] = useSearchParams();
  const cityFromUrl = searchParams.get("city") || "";
  const [hotels, setHotels] = useState([]);
  const [destination, setDestination] = useState(cityFromUrl);
  const [savedHotelIds, setSavedHotelIds] = useState(new Set());
  const [savingHotelIds, setSavingHotelIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHotels = async (city = "") => {
    setLoading(true);
    setError("");

    try {
      const response = city.trim()
        ? await api.get("/hotels/search", { params: { city: city.trim(), limit: 100 } })
        : await api.get("/hotels/");
      setHotels(response.data || []);
    } catch (requestError) {
      setHotels([]);
      setError(
        requestError.response?.data?.detail ||
        "We could not load stays right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDestination(cityFromUrl);
    loadHotels(cityFromUrl);

    api.get("/wishlist/")
      .then((response) => {
        setSavedHotelIds(new Set((response.data || []).map((item) => item.hotel_id)));
      })
      .catch(() => {
        // Browsing stays should remain available if saved stays cannot load.
      });
  }, [cityFromUrl]);

  const handleSearch = (event) => {
    event?.preventDefault();
    loadHotels(destination);
  };

  const clearSearch = () => {
    setDestination("");
    loadHotels();
  };

  const toggleWishlist = async (hotelId) => {
    if (savingHotelIds.has(hotelId)) return;

    const isSaved = savedHotelIds.has(hotelId);
    setSavingHotelIds((current) => new Set(current).add(hotelId));
    setError("");

    try {
      if (isSaved) await api.delete(`/wishlist/${hotelId}`);
      else await api.post("/wishlist/", { hotel_id: hotelId });

      setSavedHotelIds((current) => {
        const next = new Set(current);
        if (isSaved) next.delete(hotelId);
        else next.add(hotelId);
        return next;
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
        "Unable to update your saved stays."
      );
    } finally {
      setSavingHotelIds((current) => {
        const next = new Set(current);
        next.delete(hotelId);
        return next;
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        py: { xs: 3, md: 4 },
        color: "#FFFFFF",
        background: "radial-gradient(circle at 76% 0%, rgba(108,99,255,.13), transparent 28%), #060A13",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 760, mb: 3 }}>
          <Typography sx={{ color: "#9187FF", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
            TEA · STAYS
          </Typography>
          <Typography sx={{ mt: 0.6, fontSize: { xs: 28, md: 38 }, fontWeight: 900, letterSpacing: "-1px" }}>
            Find your next stay
          </Typography>
          <Typography sx={{ mt: 1, color: "#8D97AA" }}>
            Search real hotel inventory, open a stay for full details, then choose an available room.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            gap: 1,
            p: 1,
            mb: 3,
            borderRadius: 3,
            border: "1px solid rgba(123,111,255,.4)",
            background: "rgba(10,16,29,.88)",
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Search by city"
            InputProps={{ startAdornment: <Hotel sx={{ mr: 1, color: "#8B7FFF" }} /> }}
            sx={searchFieldStyle}
          />
          <Button type="submit" disabled={loading} startIcon={<Search />} sx={searchButtonStyle}>
            Search
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
              {destination.trim() ? `Stays in ${destination.trim()}` : "Available stays"}
            </Typography>
            <Typography sx={{ mt: 0.2, color: "#7C879B", fontSize: 13 }}>
              {loading ? "Updating inventory…" : `${hotels.length} ${hotels.length === 1 ? "stay" : "stays"} found`}
            </Typography>
          </Box>
          {destination && (
            <Button onClick={clearSearch} sx={{ color: "#C0BAFF", textTransform: "none" }}>
              Show all
            </Button>
          )}
        </Box>

        {loading && (
          <Box sx={emptyStateStyle}>
            <CircularProgress size={28} sx={{ color: "#8B7FFF" }} />
            <Typography sx={{ mt: 1.5, color: "#9BA4B5" }}>Loading stays…</Typography>
          </Box>
        )}

        {!loading && hotels.length === 0 && (
          <Box sx={emptyStateStyle}>
            <Hotel sx={{ fontSize: 42, color: "#8B7FFF" }} />
            <Typography sx={{ mt: 1.5, fontWeight: 800 }}>No stays found</Typography>
            <Typography sx={{ mt: 0.5, color: "#8C96A9", fontSize: 14 }}>
              Try a different city, or return to the full catalogue.
            </Typography>
            {destination && <Button onClick={clearSearch} sx={{ mt: 1.25, color: "#C0BAFF" }}>Show all stays</Button>}
          </Box>
        )}

        {!loading && hotels.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={{
                  id: hotel.id,
                  name: hotel.name,
                  location: `${hotel.city}, ${hotel.country}`,
                  price: hotel.price_per_night,
                  rating: hotel.rating,
                  description: hotel.description,
                  image: hotel.image_url,
                  availableRooms: hotel.available_rooms,
                }}
                isSaved={savedHotelIds.has(hotel.id)}
                saving={savingHotelIds.has(hotel.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}


const searchFieldStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    borderRadius: 2,
    background: "rgba(255,255,255,.025)",
    "& fieldset": { borderColor: "rgba(255,255,255,.08)" },
    "&:hover fieldset": { borderColor: "rgba(139,127,255,.6)" },
    "&.Mui-focused fieldset": { borderColor: "#8B7FFF" },
  },
  "& input::placeholder": { color: "#7F8A9E", opacity: 1 },
};


const searchButtonStyle = {
  minWidth: { xs: 105, sm: 130 },
  color: "#FFFFFF",
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 800,
  background: "linear-gradient(135deg, #6C63FF, #00AEEF)",
};


const emptyStateStyle = {
  py: 6,
  px: 3,
  textAlign: "center",
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,.08)",
  background: "rgba(13,19,32,.75)",
};


export default Hotels;
