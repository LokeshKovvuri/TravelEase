import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import {
  DirectionsBus,
  LocalTaxi,
  LocationOn,
  Route,
  Search,
  Train,
} from "@mui/icons-material";

import api from "../../services/api";


const transport = {
  train: {
    label: "Trains",
    singular: "train",
    eyebrow: "TEA · RAIL",
    title: "Plan your rail journey",
    description: "Compare scheduled services, times, fares and live seat availability.",
    endpoint: "/trains/",
    searchEndpoint: "/trains/search",
    icon: Train,
    accent: "#8B7FFF",
  },
  bus: {
    label: "Buses",
    singular: "bus",
    eyebrow: "TEA · ROAD",
    title: "Find a comfortable bus",
    description: "Explore scheduled bus services and compare availability before you travel.",
    endpoint: "/buses/",
    searchEndpoint: "/buses/search",
    icon: DirectionsBus,
    accent: "#20C997",
  },
  cab: {
    label: "Cabs",
    singular: "cab",
    eyebrow: "TEA · LOCAL",
    title: "Compare city cab options",
    description: "Check available providers, vehicle types and transparent starting fares.",
    endpoint: "/cabs/",
    searchEndpoint: "/cabs/search",
    icon: LocalTaxi,
    accent: "#00B8F0",
  },
};


function TransportSearch({ type }) {
  const config = transport[type];
  const TransportIcon = config.icon;
  const [results, setResults] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchLabel = useMemo(
    () => `Search ${config.label.toLowerCase()}`,
    [config.label]
  );

  const loadResults = async ({ search = false, clear = false } = {}) => {
    const cleanOrigin = clear ? "" : origin.trim();
    const cleanDestination = clear ? "" : destination.trim();
    const cleanVehicleType = clear ? "" : vehicleType.trim();

    if (search && type === "train" && (!cleanOrigin || !cleanDestination)) {
      setError("Enter both departure and arrival cities to search trains.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const hasFilters = Boolean(
        cleanOrigin || cleanDestination || cleanVehicleType
      );
      const response = await api.get(
        search && hasFilters ? config.searchEndpoint : config.endpoint,
        {
          params: search && hasFilters
            ? {
              origin: cleanOrigin || undefined,
              destination: cleanDestination || undefined,
              vehicle_type: type === "cab" ? cleanVehicleType || undefined : undefined,
            }
            : undefined,
        }
      );

      setResults(response.data || []);
      setHasSearched(search && hasFilters);
    } catch (requestError) {
      setResults([]);
      setError(
        requestError.response?.data?.detail ||
        `Unable to load ${config.label.toLowerCase()} right now. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
    // Each route provides a fixed transport type; this fetch intentionally runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const showAll = () => {
    setOrigin("");
    setDestination("");
    setVehicleType("");
    loadResults({ clear: true });
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        py: { xs: 3, md: 4 },
        color: "#FFFFFF",
        background: `radial-gradient(circle at 80% 0%, ${config.accent}1f, transparent 30%), #060A13`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              color: config.accent,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {config.eyebrow}
          </Typography>
          <Typography sx={{ mt: 0.6, fontSize: { xs: 28, md: 38 }, fontWeight: 900, letterSpacing: "-1px" }}>
            {config.title}
          </Typography>
          <Typography sx={{ mt: 1, color: "#8D97AA", maxWidth: 650 }}>
            {config.description}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            loadResults({ search: true });
          }}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: type === "cab" ? "1fr 1fr 1fr auto" : "1fr 1fr auto" },
            gap: 1,
            p: 1,
            mb: 2.5,
            border: "1px solid rgba(130, 120, 255, 0.38)",
            borderRadius: 3,
            background: "rgba(10, 16, 29, 0.86)",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.2)",
          }}
        >
          <TextField
            size="small"
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            placeholder="Leaving from"
            InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: config.accent }} /> }}
            sx={fieldStyle}
          />
          <TextField
            size="small"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Going to"
            InputProps={{ startAdornment: <Route sx={{ mr: 1, color: config.accent }} /> }}
            sx={fieldStyle}
          />
          {type === "cab" && (
            <TextField
              size="small"
              value={vehicleType}
              onChange={(event) => setVehicleType(event.target.value)}
              placeholder="Vehicle type (optional)"
              sx={fieldStyle}
            />
          )}
          <Button
            type="submit"
            disabled={loading}
            startIcon={<Search />}
            sx={primaryButton(config.accent)}
          >
            {loading ? "Searching" : searchLabel}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
              {hasSearched ? "Matching services" : `Available ${config.label.toLowerCase()}`}
            </Typography>
            <Typography sx={{ color: "#788398", fontSize: 13, mt: 0.3 }}>
              {loading ? "Updating results…" : `${results.length} option${results.length === 1 ? "" : "s"} found`}
            </Typography>
          </Box>
          {hasSearched && (
            <Button onClick={showAll} sx={{ color: "#B6B0FF", textTransform: "none" }}>
              Show all
            </Button>
          )}
        </Box>

        {loading && (
          <Box sx={emptyState}>
            <CircularProgress size={26} sx={{ color: config.accent }} />
            <Typography sx={{ mt: 1.5, color: "#A5ADBC" }}>Loading travel options…</Typography>
          </Box>
        )}

        {!loading && results.length === 0 && (
          <Box sx={emptyState}>
            <TransportIcon sx={{ color: config.accent, fontSize: 38 }} />
            <Typography sx={{ mt: 1.5, fontWeight: 800 }}>No {config.label.toLowerCase()} found</Typography>
            <Typography sx={{ mt: 0.5, color: "#858FA3", fontSize: 14 }}>
              Try a different route or browse all current services.
            </Typography>
            {hasSearched && <Button onClick={showAll} sx={{ mt: 1.5, color: "#C1BCFF" }}>Show all {config.label.toLowerCase()}</Button>}
          </Box>
        )}

        {!loading && results.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {results.map((item) => (
              <TransportCard key={item.id} item={item} type={type} />
            ))}
          </Box>
        )}

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.025)",
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 14 }}>Availability is live. Checkout is coming next.</Typography>
          <Typography sx={{ mt: 0.5, color: "#8791A6", fontSize: 13 }}>
            This release lets you compare current {config.singular} services without presenting an incomplete purchase flow. Transport booking will be enabled once seat selection and the same secure payment safeguards are available for these services.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}


function TransportCard({ item, type }) {
  const isCab = type === "cab";
  const operator = isCab ? item.provider_name : (type === "bus" ? item.operator_name : item.train_name);
  const reference = isCab ? item.vehicle_number : (type === "bus" ? item.bus_number : item.train_number);
  const price = isCab ? item.base_fare : (type === "bus" ? item.price : item.economy_price);
  const isAvailable = isCab ? Boolean(item.available) : item.available_seats > 0;
  const seatsText = isCab
    ? (isAvailable ? "Available now" : "Currently unavailable")
    : `${item.available_seats} of ${item.total_seats} seats available`;

  return (
    <Card
      sx={{
        p: { xs: 2, md: 2.5 },
        color: "#FFFFFF",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.09)",
        background: "linear-gradient(145deg, rgba(19, 27, 43, 0.94), rgba(9, 14, 25, 0.98))",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 17 }}>{operator}</Typography>
          <Typography sx={{ mt: 0.35, color: "#7F8A9E", fontSize: 13 }}>{reference} · {isCab ? item.vehicle_type : (type === "bus" ? item.bus_type : "Rail service")}</Typography>
        </Box>
        <Chip
          label={item.status}
          size="small"
          sx={{
            color: isAvailable ? "#4BE0A5" : "#FF9A9A",
            border: `1px solid ${isAvailable ? "rgba(75,224,165,.3)" : "rgba(255,154,154,.3)"}`,
            background: isAvailable ? "rgba(75,224,165,.08)" : "rgba(255,154,154,.08)",
          }}
        />
      </Box>

      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,.07)" }} />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: isCab ? "1fr 1fr" : "1fr 1fr 1fr" }, gap: 2, alignItems: "center" }}>
        <RouteDetails label="Route" value={`${item.origin} → ${item.destination}`} />
        {!isCab && <RouteDetails label="Schedule" value={`${formatDateTime(item.departure_time)} → ${formatTime(item.arrival_time)}`} />}
        {!isCab && <RouteDetails label="Journey" value={item.journey_duration || calculateDuration(item.departure_time, item.arrival_time)} />}
        {isCab && <RouteDetails label="Distance fare" value={`₹${formatPrice(item.price_per_km)} per km`} />}
      </Box>

      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,.07)" }} />

      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ color: "#7F8A9E", fontSize: 12 }}>{isCab ? "Base fare" : "Starting fare"}</Typography>
          <Typography sx={{ mt: 0.2, fontSize: 22, fontWeight: 900 }}>₹{formatPrice(price)}</Typography>
          <Typography sx={{ mt: 0.2, color: isAvailable ? "#4BE0A5" : "#FF9A9A", fontSize: 12 }}>{seatsText}</Typography>
        </Box>
        <Chip label="Booking coming soon" variant="outlined" sx={{ color: "#C2BDFF", borderColor: "rgba(139,127,255,.45)" }} />
      </Box>
    </Card>
  );
}


function RouteDetails({ label, value }) {
  return (
    <Box>
      <Typography sx={{ color: "#7F8A9E", fontSize: 12 }}>{label}</Typography>
      <Typography sx={{ mt: 0.35, fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}


function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
}


function formatTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}


function calculateDuration(startValue, endValue) {
  const start = new Date(startValue);
  const end = new Date(endValue);
  const minutes = Math.round((end - start) / 60000);
  if (!Number.isFinite(minutes) || minutes <= 0) return "--";
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}


function formatPrice(value) {
  return Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}


const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    minHeight: 44,
    color: "#FFFFFF",
    borderRadius: 2,
    background: "rgba(255,255,255,.03)",
    "& fieldset": { borderColor: "rgba(255,255,255,.08)" },
    "&:hover fieldset": { borderColor: "rgba(139,127,255,.6)" },
    "&.Mui-focused fieldset": { borderColor: "#8B7FFF" },
  },
  "& input::placeholder": { color: "#838DA0", opacity: 1 },
};


const emptyState = {
  p: 5,
  textAlign: "center",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 3,
  background: "rgba(12,18,31,.72)",
};


function primaryButton(accent) {
  return {
    minHeight: 44,
    px: 2.5,
    color: "#FFFFFF",
    fontWeight: 800,
    textTransform: "none",
    borderRadius: 2,
    background: `linear-gradient(135deg, ${accent}, #5A46E8)`,
    "&:hover": { background: `linear-gradient(135deg, ${accent}, #4736D9)` },
  };
}


export default TransportSearch;
