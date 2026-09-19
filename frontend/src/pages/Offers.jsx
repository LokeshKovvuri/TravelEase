import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  FlightTakeoff,
  Hotel,
  LocalOffer,
  Train,
} from "@mui/icons-material";


const collections = [
  {
    title: "Find a stay that fits",
    text: "Browse live hotel inventory, save the places you like and complete a secure checkout when you are ready.",
    action: "Explore stays",
    path: "/hotels",
    icon: Hotel,
    color: "#9B8CFF",
  },
  {
    title: "Compare flight fares",
    text: "Search scheduled flights by route and date, then reserve the fare that works for your trip.",
    action: "Search flights",
    path: "/flights",
    icon: FlightTakeoff,
    color: "#29C6FF",
  },
  {
    title: "Plan rail and road travel",
    text: "Compare live train, bus and cab availability while we complete transport checkout.",
    action: "Browse trains",
    path: "/trains",
    icon: Train,
    color: "#3DDAA3",
  },
];


function Offers() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        py: { xs: 3, md: 5 },
        color: "#FFFFFF",
        background: "radial-gradient(circle at 75% 0%, rgba(108,99,255,.16), transparent 29%), #060A13",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 700, mb: 4 }}>
          <Typography sx={{ color: "#9C91FF", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
            TEA · TRAVEL PICKS
          </Typography>
          <Typography sx={{ mt: 0.7, fontSize: { xs: 30, md: 42 }, fontWeight: 900, letterSpacing: "-1.2px" }}>
            Choose your next journey
          </Typography>
          <Typography sx={{ mt: 1.2, color: "#909AAF", fontSize: 16 }}>
            We show real inventory and fares instead of unverified discount claims. Explore the travel options already ready to reserve.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
          {collections.map((collection) => {
            const Icon = collection.icon;
            return (
              <Box
                key={collection.title}
                sx={{
                  minHeight: 285,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  border: "1px solid rgba(255,255,255,.09)",
                  background: "linear-gradient(145deg, rgba(25,33,53,.96), rgba(10,15,28,.98))",
                  transition: "transform .2s ease, border-color .2s ease",
                  "&:hover": { transform: "translateY(-3px)", borderColor: collection.color },
                }}
              >
                <Box sx={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: 3, color: "#FFFFFF", background: `linear-gradient(135deg, ${collection.color}, #6655FF)` }}>
                  <Icon />
                </Box>
                <Typography sx={{ mt: 3, fontSize: 20, fontWeight: 900 }}>{collection.title}</Typography>
                <Typography sx={{ mt: 1, color: "#939CAF", fontSize: 14, lineHeight: 1.6 }}>{collection.text}</Typography>
                <Button
                  onClick={() => navigate(collection.path)}
                  endIcon={<ArrowForward />}
                  sx={{ mt: "auto", alignSelf: "flex-start", color: collection.color, fontWeight: 800, textTransform: "none", px: 0 }}
                >
                  {collection.action}
                </Button>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 1.5, alignItems: "flex-start", p: 2, borderRadius: 3, background: "rgba(108,99,255,.09)", border: "1px solid rgba(137,125,255,.22)" }}>
          <LocalOffer sx={{ mt: 0.2, color: "#AA9FFF" }} />
          <Box>
            <Typography sx={{ fontWeight: 800 }}>No promo code to enter right now</Typography>
            <Typography sx={{ mt: 0.3, color: "#9CA5B7", fontSize: 14 }}>When a verified promotion is available, it will appear here and its terms will be shown before checkout.</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}


export default Offers;
