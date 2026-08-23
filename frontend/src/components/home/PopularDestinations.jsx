import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";

const destinations = [
  {
    name: "Goa",
    country: "India",
    emoji: "🌴",
    description: "Beaches & nightlife",
  },
  {
    name: "Dubai",
    country: "UAE",
    emoji: "🏙️",
    description: "Luxury & adventure",
  },
  {
    name: "Bali",
    country: "Indonesia",
    emoji: "🌺",
    description: "Nature & relaxation",
  },
  {
    name: "Paris",
    country: "France",
    emoji: "🗼",
    description: "Romance & culture",
  },
];

function PopularDestinations() {
  return (
    <Box sx={{ py: 10, background: "#0B0F17" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            mb: 4,
          }}
        >
          <Box>
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
              Explore
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Popular destinations
            </Typography>

            <Typography
              sx={{
                color: "#B8C0CC",
                mt: 1,
              }}
            >
              Discover places travelers love.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card
                sx={{
                  height: 230,
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 4,
                  background:
                    "linear-gradient(145deg, #1E2530, #151A22)",
                  border: "1px solid #2A3441",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#6C63FF",
                    boxShadow: "0 20px 45px rgba(108,99,255,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "rgba(108,99,255,0.15)",
                    filter: "blur(45px)",
                    right: -50,
                    top: -50,
                  }}
                />

                <CardContent
                  sx={{
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 3,
                  }}
                >
                  <Typography sx={{ fontSize: "3.5rem" }}>
                    {destination.emoji}
                  </Typography>

                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {destination.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#B8C0CC", mb: 1 }}
                    >
                      {destination.country} • {destination.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "#6C63FF",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      Explore
                      <ArrowForward fontSize="small" />
                    </Box>
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

export default PopularDestinations;