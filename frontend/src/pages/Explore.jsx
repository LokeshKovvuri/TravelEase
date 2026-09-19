import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import {
  Box,
  Button,
  Chip,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Explore as ExploreIcon, LocationOn, Search } from "@mui/icons-material";

import { DESTINATION_CATEGORIES, INDIA_DESTINATIONS } from "../data/indiaDestinations";
import "leaflet/dist/leaflet.css";


const INDIA_CENTER = [22.8, 78.9];
const CATEGORY_COLOURS = {
  Heritage: "#A78BFA",
  Nature: "#34D399",
  Beach: "#38BDF8",
  Spiritual: "#FBBF24",
  Culture: "#FB7185",
  Adventure: "#F97316",
  Wildlife: "#A3E635",
};


function MapViewport({ destination }) {
  const map = useMap();

  useEffect(() => {
    if (destination) {
      map.flyTo([destination.lat, destination.lng], 9, { duration: 0.7 });
    } else {
      map.flyTo(INDIA_CENTER, 5, { duration: 0.7 });
    }
  }, [destination, map]);

  return null;
}


function Explore() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return INDIA_DESTINATIONS.filter((destination) => {
      const matchesCategory = category === "All" || destination.category === category;
      const matchesQuery = !normalizedQuery || [
        destination.name,
        destination.city,
        destination.state,
        destination.region,
        destination.category,
      ].join(" ").toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  useEffect(() => {
    if (
      selectedDestination &&
      !filteredDestinations.some((destination) => destination.name === selectedDestination.name)
    ) {
      setSelectedDestination(null);
    }
  }, [filteredDestinations, selectedDestination]);

  const handleFindStays = (destination) => {
    navigate(`/hotels?city=${encodeURIComponent(destination.city)}`);
  };

  const resetMap = () => {
    setQuery("");
    setCategory("All");
    setSelectedDestination(null);
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 72px)", background: "radial-gradient(circle at 70% 0%, rgba(85, 73, 255, .2), transparent 30%), #060A13", py: { xs: 3, md: 4 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 3, flexWrap: "wrap", mb: 3 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography sx={{ color: "#A79BFF", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>TravelEase · Explore India</Typography>
            <Typography sx={{ color: "#fff", mt: 0.75, fontSize: { xs: 30, md: 44 }, lineHeight: 1.1, fontWeight: 900, letterSpacing: "-1.5px" }}>Discover India, place by place</Typography>
            <Typography sx={{ color: "#9BA4B5", mt: 1.25, lineHeight: 1.75 }}>
              Browse {INDIA_DESTINATIONS.length} curated tourist highlights across every region, then search available stays for a destination.
            </Typography>
          </Box>
          <Box sx={{ color: "#8E97AB", fontSize: 12, maxWidth: 280 }}>
            This is a curated starting map, not a claim to list every attraction. For the full national directory, visit the <Link href="https://www.incredibleindia.gov.in/en/destinations" target="_blank" rel="noreferrer" sx={{ color: "#B7B0FF" }}>official tourism portal</Link>.
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "330px minmax(0, 1fr)" }, gap: 2.5, alignItems: "start" }}>
          <Box sx={{ p: 2, border: "1px solid #283246", borderRadius: 3.5, background: "rgba(15, 20, 32, .92)" }}>
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Find a destination</Typography>
            <TextField
              fullWidth
              size="small"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Place, state or interest"
              InputProps={{ startAdornment: <Search sx={{ mr: 1, color: "#8B7FFF" }} /> }}
              sx={{ mt: 1.5, ...searchFieldSx }}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1.5 }}>
              {DESTINATION_CATEGORIES.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  onClick={() => setCategory(option)}
                  sx={{
                    height: 29,
                    border: category === option ? "1px solid #8B7FFF" : "1px solid #2A3441",
                    color: category === option ? "#fff" : "#AAB2BF",
                    background: category === option ? "rgba(108,99,255,.24)" : "transparent",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 1 }}>
              <Typography sx={{ color: "#9BA4B5", fontSize: 12 }}>{filteredDestinations.length} places shown</Typography>
              {(query || category !== "All" || selectedDestination) && <Button size="small" onClick={resetMap} sx={{ color: "#B7B0FF", textTransform: "none" }}>Reset</Button>}
            </Box>
            <Box sx={{ maxHeight: { xs: 330, lg: 510 }, overflowY: "auto", pr: 0.5, display: "flex", flexDirection: "column", gap: 1 }}>
              {filteredDestinations.map((destination) => {
                const selected = selectedDestination?.name === destination.name;
                return (
                  <Box
                    key={destination.name}
                    component="button"
                    type="button"
                    onClick={() => setSelectedDestination(destination)}
                    sx={{ textAlign: "left", p: 1.35, borderRadius: 2, border: selected ? "1px solid #8B7FFF" : "1px solid #263143", background: selected ? "rgba(108,99,255,.17)" : "#0C121D", color: "#fff", cursor: "pointer", "&:hover": { borderColor: "#7768FF" } }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{destination.name}</Typography>
                      <Box sx={{ width: 8, height: 8, flexShrink: 0, borderRadius: "50%", background: CATEGORY_COLOURS[destination.category] }} />
                    </Box>
                    <Typography sx={{ color: "#9BA4B5", fontSize: 11.5, mt: 0.35 }}>{destination.city}, {destination.state}</Typography>
                  </Box>
                );
              })}
              {filteredDestinations.length === 0 && <Typography sx={{ color: "#9BA4B5", p: 2, textAlign: "center", fontSize: 13 }}>No highlights match that search.</Typography>}
            </Box>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ height: { xs: 390, md: 610 }, overflow: "hidden", borderRadius: 3.5, border: "1px solid rgba(127, 111, 255, .55)", boxShadow: "0 16px 48px rgba(0, 0, 0, .28)" }}>
              <MapContainer center={INDIA_CENTER} zoom={5} minZoom={4} maxZoom={15} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapViewport destination={selectedDestination} />
                {filteredDestinations.map((destination) => {
                  const selected = selectedDestination?.name === destination.name;
                  return (
                    <CircleMarker
                      key={destination.name}
                      center={[destination.lat, destination.lng]}
                      radius={selected ? 10 : 6}
                      pathOptions={{ color: "#fff", weight: selected ? 3 : 1.5, fillColor: CATEGORY_COLOURS[destination.category], fillOpacity: 0.95 }}
                      eventHandlers={{ click: () => setSelectedDestination(destination) }}
                    >
                      <Popup>
                        <strong>{destination.name}</strong><br />
                        {destination.city}, {destination.state}<br />
                        <span>{destination.category}</span>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </Box>

            {selectedDestination ? (
              <Box sx={{ mt: 2, p: { xs: 2, md: 2.5 }, borderRadius: 3, border: "1px solid #303A51", background: "linear-gradient(120deg, rgba(91,75,255,.2), rgba(12,18,29,.95))", display: "flex", gap: 2, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" } }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}><LocationOn sx={{ color: CATEGORY_COLOURS[selectedDestination.category] }} /><Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 19 }}>{selectedDestination.name}</Typography></Box>
                  <Typography sx={{ color: "#B0B8C7", mt: 0.5 }}>{selectedDestination.city}, {selectedDestination.state} · {selectedDestination.note}</Typography>
                </Box>
                <Button startIcon={<ExploreIcon />} onClick={() => handleFindStays(selectedDestination)} sx={{ flexShrink: 0, borderRadius: 2, color: "#fff", fontWeight: 800, textTransform: "none", background: "linear-gradient(135deg, #6C63FF, #00AEEF)" }}>Find stays</Button>
              </Box>
            ) : (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1.25, color: "#9BA4B5", fontSize: 12 }}>
                {Object.entries(CATEGORY_COLOURS).map(([label, colour]) => <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}><Box sx={{ width: 8, height: 8, borderRadius: "50%", background: colour }} />{label}</Box>)}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}


const searchFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: 2,
    background: "#0C121D",
    "& fieldset": { borderColor: "#2A3441" },
    "&:hover fieldset": { borderColor: "#7768FF" },
    "&.Mui-focused fieldset": { borderColor: "#8B7FFF" },
  },
  "& input::placeholder": { color: "#7F8A9E", opacity: 1 },
};


export default Explore;
