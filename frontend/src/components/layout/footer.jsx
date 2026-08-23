import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import {
  FlightTakeoff,
  Instagram,
  Facebook,
  Twitter,
} from "@mui/icons-material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "#080B11",
        pt: 8,
        pb: 3,
        borderTop:
          "1px solid rgba(108,99,255,0.15)",
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={5}
          sx={{ mb: 6 }}
        >
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #6C63FF, #00D4FF)",
                }}
              >
                <FlightTakeoff />
              </Box>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                TravelEase
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#8F98A8",
                maxWidth: 350,
                lineHeight: 1.8,
              }}
            >
              Making travel easier, smarter, and more
              memorable. Your journey starts here.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 3,
              }}
            >
              {[Instagram, Facebook, Twitter].map(
                (Icon, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border:
                        "1px solid #2A3441",
                      color: "#B8C0CC",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                        borderColor: "#6C63FF",
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                )
              )}
            </Box>
          </Grid>

          {/* Explore */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Explore
            </Typography>

            {[
              "Hotels",
              "Flights",
              "Trips",
              "Offers",
            ].map((item) => (
              <Typography
                key={item}
                sx={{
                  color: "#8F98A8",
                  mb: 1.3,
                  cursor: "pointer",
                  "&:hover": {
                    color: "#6C63FF",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Company
            </Typography>

            {[
              "About us",
              "Careers",
              "Contact",
              "Blog",
            ].map((item) => (
              <Typography
                key={item}
                sx={{
                  color: "#8F98A8",
                  mb: 1.3,
                  cursor: "pointer",
                  "&:hover": {
                    color: "#6C63FF",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Support
            </Typography>

            {[
              "Help Center",
              "Privacy",
              "Terms",
              "Safety",
            ].map((item) => (
              <Typography
                key={item}
                sx={{
                  color: "#8F98A8",
                  mb: 1.3,
                  cursor: "pointer",
                  "&:hover": {
                    color: "#6C63FF",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>
        </Grid>

        <Divider
          sx={{
            borderColor:
              "rgba(255,255,255,0.08)",
          }}
        />

        <Box
          sx={{
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#667080" }}
          >
            © 2026 TravelEase. All rights reserved.
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#667080" }}
          >
            Built for better journeys ✈️
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;