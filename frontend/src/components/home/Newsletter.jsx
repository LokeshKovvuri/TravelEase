import { useState } from "react";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import { Send } from "@mui/icons-material";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return;

    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <Box
      sx={{
        py: 10,
        background: "#0B0F17",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            p: { xs: 4, md: 7 },
            borderRadius: 5,
            background:
              "linear-gradient(135deg, #1E2530, #151A22)",
            border:
              "1px solid rgba(108,99,255,0.3)",
            boxShadow:
              "0 25px 70px rgba(0,0,0,0.3)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 250,
              height: 250,
              borderRadius: "50%",
              background:
                "rgba(108,99,255,0.14)",
              filter: "blur(70px)",
              top: -130,
              left: -100,
            }}
          />

          <Box sx={{ position: "relative" }}>
            <Typography
              sx={{
                fontSize: "2.5rem",
                mb: 1,
              }}
            >
              ✈️
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "2rem",
                  md: "3rem",
                },
              }}
            >
              Stay in the loop
            </Typography>

            <Typography
              sx={{
                color: "#B8C0CC",
                mt: 2,
                mb: 4,
              }}
            >
              Get exclusive travel deals, destination
              inspiration, and special offers.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                maxWidth: 600,
                mx: "auto",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <Button
                variant="contained"
                onClick={handleSubscribe}
                endIcon={<Send />}
                sx={{
                  px: 3,
                  minWidth: 140,
                  background:
                    "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Newsletter;