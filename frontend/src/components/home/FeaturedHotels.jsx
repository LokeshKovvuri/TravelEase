import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Rating,
  Typography,
} from "@mui/material";

import {
  FavoriteBorder,
  LocationOn,
  ArrowForward,
} from "@mui/icons-material";

import { motion } from "framer-motion";

const hotels = [
  {
    name: "Ocean Pearl Resort",
    location: "Goa, India",
    price: "₹4,500",
    rating: 4.8,
    reviews: 324,
    emoji: "🏖️",
  },
  {
    name: "Royal Palm Hotel",
    location: "Dubai, UAE",
    price: "₹8,200",
    rating: 4.9,
    reviews: 581,
    emoji: "🏨",
  },
  {
    name: "Bali Paradise Villa",
    location: "Bali, Indonesia",
    price: "₹5,600",
    rating: 4.7,
    reviews: 267,
    emoji: "🌴",
  },
];

function FeaturedHotels() {
  return (
    <Box sx={{ py: 10, background: "#0F141C" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "start", md: "end" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#8B5CF6",
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                mb: 1,
              }}
            >
              Handpicked for you
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Featured stays
            </Typography>

            <Typography sx={{ color: "#B8C0CC", mt: 1 }}>
              Exceptional places for an unforgettable journey.
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowForward />}
            sx={{
              color: "#00D4FF",
              display: { xs: "none", sm: "flex" },
            }}
          >
            View all
          </Button>
        </Box>

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
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card
                sx={{
                  overflow: "hidden",
                  borderRadius: 4,
                  background: "#1E2530",
                  border: "1px solid #2A3441",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#6C63FF",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                  },
                }}
              >
                {/* Image placeholder */}
                <Box
                  sx={{
                    height: 230,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(108,99,255,0.35), transparent 35%), linear-gradient(135deg, #202938, #11161F)",
                  }}
                >
                  <Typography sx={{ fontSize: "5rem" }}>
                    {hotel.emoji}
                  </Typography>

                  <Button
                    sx={{
                      position: "absolute",
                      top: 15,
                      right: 15,
                      minWidth: 42,
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      color: "#fff",
                      background: "rgba(11,15,23,0.7)",
                      "&:hover": {
                        background: "rgba(255,70,120,0.2)",
                        color: "#FF5C8A",
                      },
                    }}
                  >
                    <FavoriteBorder />
                  </Button>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" fontWeight={700}>
                    {hotel.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    <LocationOn
                      sx={{ fontSize: 18, color: "#6C63FF" }}
                    />

                    <Typography
                      variant="body2"
                      sx={{ color: "#B8C0CC" }}
                    >
                      {hotel.location}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Rating
                      value={hotel.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />

                    <Typography variant="body2" sx={{ color: "#B8C0CC" }}>
                      {hotel.rating} ({hotel.reviews})
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "end",
                      mt: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {hotel.price}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: "#8F98A8" }}
                      >
                        per night
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturedHotels;