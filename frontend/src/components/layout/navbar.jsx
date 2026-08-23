import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Menu,
  Close,
  FlightTakeoff,
  Hotel,
  FavoriteBorder,
  LocalOffer,
  Luggage,
} from "@mui/icons-material";

import { motion } from "framer-motion";

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Hotels", icon: <Hotel fontSize="small" /> },
    { label: "Trips", icon: <Luggage fontSize="small" /> },
    { label: "Offers", icon: <LocalOffer fontSize="small" /> },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(11, 15, 23, 0.82)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(108, 99, 255, 0.18)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: 76,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%)",
                boxShadow: "0 0 25px rgba(108, 99, 255, 0.35)",
              }}
            >
              <FlightTakeoff sx={{ color: "#fff" }} />
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: 700,
                background:
                  "linear-gradient(90deg, #FFFFFF, #9C9AFF, #00D4FF)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TravelEase
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  startIcon={item.icon}
                  sx={{
                    color: "#B8C0CC",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      color: "#FFFFFF",
                      background: "rgba(108, 99, 255, 0.12)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Button
                startIcon={<FavoriteBorder />}
                sx={{
                  color: "#B8C0CC",
                  px: 2,
                  "&:hover": {
                    color: "#FF5C8A",
                  },
                }}
              >
                Wishlist
              </Button>

              <Button
                variant="contained"
                sx={{
                  ml: 1,
                  px: 3,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                  boxShadow: "0 8px 25px rgba(108, 99, 255, 0.25)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #7C73FF, #9B6CFF)",
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: "#fff" }}
            >
              <Menu />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: "#11161F",
            color: "#fff",
            borderLeft: "1px solid rgba(108, 99, 255, 0.25)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 3,
            }}
          >
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: "#fff" }}
            >
              <Close />
            </IconButton>
          </Box>

          {navItems.map((item) => (
            <Button
              key={item.label}
              fullWidth
              startIcon={item.icon}
              sx={{
                justifyContent: "flex-start",
                color: "#B8C0CC",
                py: 1.5,
                mb: 1,
              }}
            >
              {item.label}
            </Button>
          ))}

          <Button
            fullWidth
            startIcon={<FavoriteBorder />}
            sx={{
              justifyContent: "flex-start",
              color: "#B8C0CC",
              py: 1.5,
            }}
          >
            Wishlist
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.3,
              background:
                "linear-gradient(135deg, #6C63FF, #8B5CF6)",
            }}
          >
            Sign In
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;