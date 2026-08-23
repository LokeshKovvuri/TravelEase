import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FlightTakeoff, Explore } from "@mui/icons-material";

function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 500, md: 560 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 75% 30%, rgba(108,99,255,0.25), transparent 35%), radial-gradient(circle at 20% 70%, rgba(0,212,255,0.12), transparent 35%), #0B0F17",
      }}
    >
      {/* Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(108,99,255,0.12)",
          filter: "blur(100px)",
          right: "-100px",
          top: "80px",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ maxWidth: 850 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.8,
                mb: 3,
                borderRadius: 10,
                border: "1px solid rgba(0,212,255,0.25)",
                background: "rgba(0,212,255,0.06)",
                color: "#00D4FF",
              }}
            >
              <Explore fontSize="small" />

              <Typography variant="body2" fontWeight={600}>
                Your journey starts here
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "3rem", sm: "4rem", md: "5.5rem" },
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-3px",
                mb: 3,
              }}
            >
              Travel
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(90deg, #6C63FF, #00D4FF)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                without limits.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 650,
                fontSize: { xs: "1rem", md: "1.2rem" },
                lineHeight: 1.8,
                color: "#B8C0CC",
                mb: 4,
              }}
            >
              Discover amazing places, find the perfect stay, and create
              unforgettable memories with TravelEase.
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#8F98A8",
              }}
            >
              <FlightTakeoff sx={{ color: "#6C63FF" }} />

              <Typography variant="body2">
                Hotels • Flights • Experiences • Adventures
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

export default Hero;