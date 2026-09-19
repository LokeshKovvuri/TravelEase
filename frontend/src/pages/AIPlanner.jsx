import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import {
  AutoAwesome,
  Hotel,
  LocationOn,
  Send,
} from "@mui/icons-material";

import api from "../services/api";


function AIPlanner() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [nights, setNights] = useState(2);
  const [interests, setInterests] = useState("");
  const [question, setQuestion] = useState("Help me choose a stay.");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createPlan = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/ai/trip-plan", {
        destination: destination.trim() || null,
        budget_per_night: budget ? Number(budget) : null,
        nights: Number(nights),
        interests: interests.trim() || null,
        question: question.trim() || "Help me choose a stay.",
      });
      setPlan(response.data);
    } catch (requestError) {
      setPlan(null);
      setError(
        requestError.response?.data?.detail ||
        "Unable to prepare your trip plan right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        py: { xs: 3, md: 4 },
        color: "#FFFFFF",
        background: "radial-gradient(circle at 78% 0%, rgba(94,83,255,.2), transparent 30%), #060A13",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 760, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#AAA2FF" }}>
            <AutoAwesome fontSize="small" />
            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
              TEA · AI TRIP PLANNER
            </Typography>
          </Box>
          <Typography sx={{ mt: 0.8, fontSize: { xs: 28, md: 38 }, fontWeight: 900, letterSpacing: "-1px" }}>
            Plan a stay with confidence
          </Typography>
          <Typography sx={{ mt: 1, color: "#929CAF" }}>
            Tell the planner what matters to you. It uses the current TravelEase hotel catalogue, not invented inventory.
          </Typography>
        </Box>

        <Card sx={panelStyle}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box component="form" onSubmit={createPlan} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
              <TextField
                label="Destination"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="Goa, Delhi, or India"
                InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: "#948AFF" }} /> }}
                sx={fieldStyle}
              />
              <TextField
                label="Budget per night (₹)"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                type="number"
                inputProps={{ min: 1 }}
                sx={fieldStyle}
              />
              <TextField
                label="Nights"
                value={nights}
                onChange={(event) => setNights(Math.max(1, Math.min(30, Number(event.target.value) || 1)))}
                type="number"
                inputProps={{ min: 1, max: 30 }}
                sx={fieldStyle}
              />
              <TextField
                label="Preferences"
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
                placeholder="Quiet, near the beach, family-friendly…"
                sx={fieldStyle}
              />
              <TextField
                label="What do you need help with?"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                multiline
                minRows={3}
                sx={{ ...fieldStyle, gridColumn: { xs: "auto", md: "1 / -1" } }}
              />
              <Button
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Send />}
                sx={{ ...primaryButtonStyle, gridColumn: { xs: "auto", md: "1 / -1" } }}
              >
                {loading ? "Planning your stay…" : "Create trip plan"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {plan && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
              <Typography sx={{ fontSize: 19, fontWeight: 900 }}>Your trip plan</Typography>
              <Chip
                size="small"
                label={plan.provider === "openai" ? "OpenAI-powered" : "Live catalogue planner"}
                sx={{ color: "#D6D2FF", border: "1px solid rgba(154,143,255,.45)", background: "rgba(120,105,255,.12)" }}
              />
            </Box>
            {plan.notice && <Alert severity="info" sx={{ mb: 1.5 }}>{plan.notice}</Alert>}
            <Card sx={panelStyle}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography sx={{ whiteSpace: "pre-line", color: "#E0E3EA", lineHeight: 1.8 }}>
                  {plan.advice}
                </Typography>
              </CardContent>
            </Card>

            <Typography sx={{ mt: 3, mb: 1.25, fontWeight: 800 }}>Recommended stays</Typography>
            {plan.recommendations.length === 0 ? (
              <Alert severity="info">No current stay matches those details. Try another destination or a higher budget.</Alert>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 1.5 }}>
                {plan.recommendations.map((hotel) => (
                  <Card key={hotel.id} sx={hotelStyle}>
                    {hotel.image_url ? (
                      <Box component="img" src={hotel.image_url} alt="" sx={{ height: 135, width: "100%", objectFit: "cover" }} />
                    ) : (
                      <Box sx={{ height: 135, display: "grid", placeItems: "center", background: "#171E2E" }}>
                        <Hotel sx={{ color: "#9A90FF", fontSize: 38 }} />
                      </Box>
                    )}
                    <CardContent>
                      <Typography sx={{ fontWeight: 800 }}>{hotel.name}</Typography>
                      <Typography sx={{ mt: 0.35, fontSize: 13, color: "#8E98AA" }}>{hotel.city}, {hotel.country}</Typography>
                      <Typography sx={{ mt: 1, fontWeight: 800 }}>₹{Number(hotel.price_per_night).toLocaleString("en-IN")} <Box component="span" sx={{ color: "#8E98AA", fontSize: 12, fontWeight: 400 }}>/ night</Box></Typography>
                      <Typography sx={{ color: "#F5C451", fontSize: 13, mt: 0.3 }}>★ {Number(hotel.rating).toFixed(1)}</Typography>
                      <Button onClick={() => navigate(`/hotels/${hotel.id}`)} sx={{ mt: 1, px: 0, color: "#B8B1FF", textTransform: "none", fontWeight: 800 }}>View details</Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}


const panelStyle = {
  color: "#FFFFFF",
  background: "linear-gradient(145deg, rgba(22,30,49,.97), rgba(10,16,29,.98))",
  border: "1px solid rgba(144,132,255,.32)",
  borderRadius: 4,
};


const hotelStyle = {
  overflow: "hidden",
  color: "#FFFFFF",
  background: "#151C2B",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 3,
};


const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    borderRadius: 2,
    background: "rgba(255,255,255,.025)",
    "& fieldset": { borderColor: "rgba(255,255,255,.11)" },
    "&:hover fieldset": { borderColor: "rgba(147,135,255,.65)" },
    "&.Mui-focused fieldset": { borderColor: "#948AFF" },
  },
  "& .MuiInputLabel-root": { color: "#929CAF" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#B0A9FF" },
  "& input::placeholder, & textarea::placeholder": { color: "#737E93", opacity: 1 },
};


const primaryButtonStyle = {
  minHeight: 48,
  color: "#FFFFFF",
  fontWeight: 800,
  borderRadius: 2,
  textTransform: "none",
  background: "linear-gradient(135deg, #6B5CFF, #00AEEF)",
};


export default AIPlanner;
