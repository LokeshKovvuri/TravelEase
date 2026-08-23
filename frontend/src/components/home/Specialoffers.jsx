import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  LocalOffer,
  FlightTakeoff,
  Hotel,
} from "@mui/icons-material";

import { motion } from "framer-motion";

const offers = [
  {
    title: "Weekend Escape",
    subtitle: "Save up to 25% on selected hotels",
    badge: "25% OFF",
    icon: <Hotel />,
  },
  {
    title: "Fly & Explore",
    subtitle: "Exclusive flight deals for your next adventure",
    badge: "20% OFF",
    icon: <FlightTakeoff />,
  },
  {
    title: "Early Bird",
    subtitle: "Book early and unlock special travel prices",
    badge: "15% OFF",
    icon: <LocalOffer />,
  },
];

function SpecialOffers() {
  return (
    <Box
      sx={{
        py: 10,
        background: "#0B0F17",
      }}
    >
      <Container maxWidth="xl">
        {/* Heading */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#00D4FF",
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              mb: 1,
            }}
          >
            Limited time
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Special offers
          </Typography>

          <Typography
            sx={{
              color: "#B8C0CC",
              mt: 1,
            }}
          >
            Make your next journey even more rewarding.
          </Typography>
        </Box>

        {/* Offers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {offers.map((offer, index) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                sx={{
                  minHeight: 260,
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 4,
                  p: 4,
                  background:
                    "linear-gradient(135deg, #1E2530, #151A22)",
                  border: "1px solid #2A3441",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#6C63FF",
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 25px 60px rgba(108,99,255,0.12)",
                  },
                }}
              >
                {/* Glow */}
                <Box
                  sx={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background:
                      "rgba(108,99,255,0.14)",
                    filter: "blur(60px)",
                    right: -70,
                    top: -70,
                  }}
                />

                {/* Badge */}
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-flex",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    background:
                      "rgba(108,99,255,0.15)",
                    border:
                      "1px solid rgba(108,99,255,0.3)",
                    color: "#9C9AFF",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  {offer.badge}
                </Box>

                {/* Icon */}
                <Box
                  sx={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #6C63FF, #00D4FF)",
                    color: "#fff",
                    mb: 2,
                  }}
                >
                  {offer.icon}
                </Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ position: "relative" }}
                >
                  {offer.title}
                </Typography>

                <Typography
                  sx={{
                    position: "relative",
                    color: "#B8C0CC",
                    mt: 1,
                    mb: 3,
                  }}
                >
                  {offer.subtitle}
                </Typography>

                <Button
                  endIcon={<ArrowForward />}
                  sx={{
                    position: "relative",
                    p: 0,
                    color: "#00D4FF",
                    "&:hover": {
                      background: "transparent",
                    },
                  }}
                >
                  Explore offer
                </Button>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default SpecialOffers;