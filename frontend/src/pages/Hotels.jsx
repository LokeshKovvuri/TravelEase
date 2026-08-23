import { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from "@mui/material";

import {
  Tune,
  Sort,
} from "@mui/icons-material";

import HotelSearch from "../components/hotel/HotelSearch";
import HotelFilters from "../components/hotel/HotelFilters";
import HotelCard from "../components/hotel/HotelCard";

import api from "../services/api";


function Hotels() {
  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showFilters, setShowFilters] =
    useState(false);


  // =====================================================
  // GET ALL HOTELS
  // =====================================================

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/hotels/");

      setHotels(response.data);

    } catch (err) {
      console.error("Failed to fetch hotels:", err);

      setError(
        "Unable to load hotels. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // LOAD HOTELS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchHotels();
  }, []);


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0B0F17",
        py: 5,
      }}
    >
      <Container maxWidth="xl">

        {/* ============================================= */}
        {/* HEADER */}
        {/* ============================================= */}

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
            Explore stays
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "2.2rem",
                md: "3.5rem",
              },
            }}
          >
            Find your perfect hotel
          </Typography>

          <Typography
            sx={{
              color: "#8F98A8",
              mt: 1,
            }}
          >
            Discover comfortable stays at the best prices.
          </Typography>

        </Box>


        {/* ============================================= */}
        {/* SEARCH */}
        {/* ============================================= */}

        <HotelSearch />


        {/* ============================================= */}
        {/* MOBILE FILTER BUTTON */}
        {/* ============================================= */}

        <Button
          startIcon={<Tune />}
          onClick={() =>
            setShowFilters(!showFilters)
          }
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
            mt: 3,
            color: "#fff",
            border: "1px solid #2A3441",
            px: 3,
          }}
        >
          Filters
        </Button>


        {/* ============================================= */}
        {/* MAIN CONTENT */}
        {/* ============================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "280px 1fr",
            },
            gap: 3,
            mt: 4,
          }}
        >

          {/* =========================================== */}
          {/* FILTERS */}
          {/* =========================================== */}

          <Box
            sx={{
              display: {
                xs: showFilters
                  ? "block"
                  : "none",
                md: "block",
              },
            }}
          >
            <HotelFilters />
          </Box>


          {/* =========================================== */}
          {/* RESULTS */}
          {/* =========================================== */}

          <Box>

            {/* Results header */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >

              <Typography
                sx={{
                  color: "#B8C0CC",
                }}
              >
                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {hotels.length}
                </strong>{" "}
                properties found
              </Typography>


              <Button
                startIcon={<Sort />}
                sx={{
                  color: "#B8C0CC",
                  border: "1px solid #2A3441",
                  px: 2,
                }}
              >
                Recommended
              </Button>

            </Box>


            {/* ========================================= */}
            {/* ERROR */}
            {/* ========================================= */}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: "#2A1619",
                  color: "#fff",
                }}
              >
                {error}
              </Alert>
            )}


            {/* ========================================= */}
            {/* LOADING */}
            {/* ========================================= */}

            {loading && (
              <Box
                sx={{
                  minHeight: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  sx={{
                    color: "#6C63FF",
                  }}
                />
              </Box>
            )}


            {/* ========================================= */}
            {/* NO HOTELS */}
            {/* ========================================= */}

            {!loading &&
              !error &&
              hotels.length === 0 && (
                <Box
                  sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 4,
                    background: "#161B22",
                    border:
                      "1px solid #2A3441",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    No hotels found
                  </Typography>

                  <Typography
                    sx={{
                      color: "#8F98A8",
                      mt: 1,
                    }}
                  >
                    Try searching another destination.
                  </Typography>
                </Box>
              )}


            {/* ========================================= */}
            {/* HOTEL CARDS */}
            {/* ========================================= */}

            {!loading &&
              hotels.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                  }}
                >

                  {hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={{
                        id: hotel.id,

                        name: hotel.name,

                        location:
                          `${hotel.city}, ${hotel.country}`,

                        price:
                          hotel.price_per_night,

                        rating:
                          hotel.rating,

                        reviews: 0,

                        description:
                          hotel.description,

                        image:
                          hotel.image_url,

                        availableRooms:
                          hotel.available_rooms,

                        discount: null,

                        emoji: "🏨",
                      }}
                    />
                  ))}

                </Box>
              )}

          </Box>
        </Box>

      </Container>
    </Box>
  );
}

export default Hotels;