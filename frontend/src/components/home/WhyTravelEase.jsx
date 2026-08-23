import { Box, Container, Typography } from "@mui/material";

import {
  Bolt,
  Security,
  Diamond,
  SupportAgent,
} from "@mui/icons-material";

import { motion } from "framer-motion";

const features = [
  {
    icon: <Bolt />,
    title: "Fast booking",
    description:
      "Find and reserve your perfect stay in just a few clicks.",
  },
  {
    icon: <Security />,
    title: "Secure payments",
    description:
      "Your personal information and payments are protected.",
  },
  {
    icon: <Diamond />,
    title: "Best prices",
    description:
      "Get competitive prices and exclusive travel deals.",
  },
  {
    icon: <SupportAgent />,
    title: "24/7 support",
    description:
      "We're here whenever you need help with your journey.",
  },
];

function WhyTravelEase() {
  return (
    <Box
      sx={{
        py: 10,
        background: "#0F141C",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 700,
            mx: "auto",
            mb: 6,
          }}
        >
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
            Why TravelEase
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Travel smarter. Travel easier.
          </Typography>

          <Typography
            sx={{
              color: "#B8C0CC",
              mt: 2,
            }}
          >
            Everything you need to make your next adventure
            simple and stress-free.
          </Typography>
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
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 4,
                  borderRadius: 4,
                  border:
                    "1px solid rgba(42,52,65,0.9)",
                  background: "#161B22",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#6C63FF",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 2,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    background:
                      "linear-gradient(135deg, #6C63FF, #00D4FF)",
                    boxShadow:
                      "0 10px 30px rgba(108,99,255,0.2)",
                  }}
                >
                  {feature.icon}
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#8F98A8",
                    mt: 1.5,
                    lineHeight: 1.7,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default WhyTravelEase;