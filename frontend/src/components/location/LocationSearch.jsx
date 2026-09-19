import { useState } from "react";

import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

import {
  MyLocation,
  LocationOn,
} from "@mui/icons-material";


function LocationSearch() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");


  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by your browser."
      );
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        setLoading(false);
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        setError(
          "Unable to detect your location. Please allow location access."
        );

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        p: 3,
        background:
          "linear-gradient(135deg, #111827, #161B22)",
        border:
          "1px solid rgba(108, 99, 255, 0.35)",
        boxShadow:
          "0 15px 45px rgba(0,0,0,0.25)",
      }}
    >

      {/* Animated GPS glow */}

      <Box
        sx={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,212,255,0.18), transparent 70%)",
          top: -80,
          right: -50,
          pointerEvents: "none",
        }}
      />


      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "relative",
          zIndex: 1,
        }}
      >

        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "rgba(0,212,255,0.12)",
            border:
              "1px solid rgba(0,212,255,0.3)",
          }}
        >
          <LocationOn
            sx={{
              color: "#00D4FF",
              fontSize: 30,
            }}
          />
        </Box>


        <Box sx={{ flex: 1 }}>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "1.05rem",
            }}
          >
            Discover places around you
          </Typography>

          <Typography
            sx={{
              color: "#8F98A8",
              fontSize: "0.85rem",
              mt: 0.3,
            }}
          >
            Let TEA find hotels near your current
            location.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                sx={{ color: "#fff" }}
              />
            ) : (
              <MyLocation />
            )
          }
          disabled={loading}
          onClick={detectLocation}
          sx={{
            borderRadius: 2.5,
            px: 2.5,
            py: 1.2,
            fontWeight: 700,
            textTransform: "none",
            background:
              "linear-gradient(135deg, #6C63FF, #00AEEF)",
            boxShadow:
              "0 8px 25px rgba(108,99,255,0.25)",
          }}
        >
          {loading
            ? "Locating..."
            : "Use my location"}
        </Button>

      </Box>


      {/* Location result */}

      {location && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background:
              "rgba(34,197,94,0.08)",
            border:
              "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <Typography
            sx={{
              color: "#22C55E",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            📍 Location detected
          </Typography>

          <Typography
            sx={{
              color: "#B8C0CC",
              fontSize: "0.8rem",
              mt: 0.5,
            }}
          >
            Latitude: {location.latitude.toFixed(6)}
            {" • "}
            Longitude: {location.longitude.toFixed(6)}
          </Typography>
        </Box>
      )}


      {error && (
        <Typography
          sx={{
            color: "#F87171",
            fontSize: "0.8rem",
            mt: 2,
          }}
        >
          {error}
        </Typography>
      )}

    </Box>
  );
}


export default LocationSearch;