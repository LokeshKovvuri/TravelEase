import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  Typography,
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Wifi,
  Pool,
  Restaurant,
} from "@mui/icons-material";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


function HotelCard({ hotel, isSaved = false, onToggleWishlist, saving = false }) {
  const navigate = useNavigate();

  const handleViewHotel = () => {
    navigate(`/hotels/${hotel.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        sx={{
          display: "flex",
          overflow: "hidden",
          borderRadius: 4,
          background: "#161B22",
          border: "1px solid #2A3441",
          transition: "all 0.3s ease",

          "&:hover": {
            borderColor: "#6C63FF",
            boxShadow:
              "0 20px 50px rgba(108,99,255,0.12)",
          },

          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        {/* ================================================= */}
        {/* HOTEL IMAGE */}
        {/* ================================================= */}

        <Box
          sx={{
            width: {
              xs: "100%",
              md: 280,
            },

            minHeight: {
              xs: 220,
              md: 230,
            },

            position: "relative",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background:
              "linear-gradient(135deg, #202938, #11161F)",

            flexShrink: 0,
          }}
        >
          {hotel.image ? (
            <Box
              component="img"
              src={hotel.image}
              alt={hotel.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
              }}
            />
          ) : (
            <Typography sx={{ fontSize: "5rem" }}>
              {hotel.emoji || "🏨"}
            </Typography>
          )}

          {/* Favorite */}

          <Button
            aria-label={isSaved ? `Remove ${hotel.name} from saved stays` : `Save ${hotel.name}`}
            onClick={() => onToggleWishlist?.(hotel.id)}
            disabled={saving}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,

              minWidth: 42,
              width: 42,
              height: 42,

              borderRadius: "50%",

              color: isSaved ? "#FF5C8A" : "#fff",

              background:
                "rgba(11,15,23,0.75)",

              backdropFilter: "blur(8px)",

              "&:hover": {
                color: "#FF5C8A",
                background:
                  "rgba(11,15,23,0.9)",
              },
            }}
          >
            {isSaved ? <Favorite /> : <FavoriteBorder />}
          </Button>

          {/* Discount */}

          {hotel.discount && (
            <Chip
              label={`${hotel.discount}% OFF`}
              size="small"
              sx={{
                position: "absolute",
                left: 15,
                top: 15,

                background: "#6C63FF",
                color: "#fff",

                fontWeight: 700,
              }}
            />
          )}
        </Box>


        {/* ================================================= */}
        {/* HOTEL INFORMATION */}
        {/* ================================================= */}

        <CardContent
          sx={{
            flex: 1,
            p: {
              xs: 2.5,
              md: 3,
            },

            display: "flex",
            flexDirection: "column",
          }}
        >

          {/* Hotel name */}

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "#fff",
            }}
          >
            {hotel.name}
          </Typography>


          {/* Location */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: 1,
            }}
          >
            <LocationOn
              sx={{
                fontSize: 18,
                color: "#6C63FF",
              }}
            />

            <Typography
              variant="body2"
              sx={{
                color: "#9AA4B2",
              }}
            >
              {hotel.location}
            </Typography>
          </Box>


          {/* Rating */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <Rating
              value={hotel.rating || 0}
              precision={0.1}
              readOnly
              size="small"
            />

            <Typography
              variant="body2"
              sx={{
                color: "#B8C0CC",
              }}
            >
              {hotel.rating || 0} / 5
            </Typography>
          </Box>


          {/* Description */}

          <Typography
            variant="body2"
            sx={{
              color: "#8F98A8",
              mt: 2,
              lineHeight: 1.7,
              maxWidth: 600,
            }}
          >
            {hotel.description}
          </Typography>


          {/* Amenities */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#8F98A8",
              }}
            >
              <Wifi fontSize="small" />

              <Typography variant="caption">
                WiFi
              </Typography>
            </Box>


            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#8F98A8",
              }}
            >
              <Pool fontSize="small" />

              <Typography variant="caption">
                Pool
              </Typography>
            </Box>


            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#8F98A8",
              }}
            >
              <Restaurant fontSize="small" />

              <Typography variant="caption">
                Restaurant
              </Typography>
            </Box>

          </Box>


          {/* ================================================= */}
          {/* ROOM AVAILABILITY */}
          {/* ================================================= */}

          {hotel.availableRooms !== undefined && (
            <Typography
              variant="caption"
              sx={{
                color:
                  hotel.availableRooms > 0
                    ? "#22C55E"
                    : "#EF4444",

                mt: 1,

                display: "block",
              }}
            >
              {hotel.availableRooms > 0
                ? `${hotel.availableRooms} rooms available`
                : "No rooms currently available"}
            </Typography>
          )}


          {/* ================================================= */}
          {/* BOTTOM */}
          {/* ================================================= */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "flex-end",
              },

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              gap: 2,

              mt: "auto",
              pt: 3,
            }}
          >

            {/* Price */}

            <Box>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  color: "#fff",
                }}
              >
                ₹
                {Number(
                  hotel.price || 0
                ).toLocaleString("en-IN")}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#8F98A8",
                }}
              >
                per night · taxes included
              </Typography>

            </Box>


            {/* ================================================= */}
            {/* VIEW HOTEL */}
            {/* ================================================= */}

            <Button
              variant="contained"
              onClick={handleViewHotel}
              sx={{
                borderRadius: 2,
                px: 3,

                background:
                  "linear-gradient(135deg, #6C63FF, #8B5CF6)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7C73FF, #9B6CFF)",
                },
              }}
            >
              View hotel
            </Button>

          </Box>

        </CardContent>
      </Card>
    </motion.div>
  );
}


export default HotelCard;
