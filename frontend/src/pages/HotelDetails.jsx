import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Rating,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  FavoriteBorder,
  LocationOn,
  Wifi,
  Pool,
  Restaurant,
  LocalParking,
  KingBed,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";


// ============================================================
// HOTEL DATA
// IMPORTANT:
// roomId MUST be the real ID from your PostgreSQL `rooms` table.
// ============================================================

const hotels = [
  {
    id: 1,
    name: "Ocean Pearl Resort",
    location: "Calangute, Goa, India",
    price: 4500,
    rating: 4.8,
    reviews: 324,
    discount: 25,
    emoji: "🏖️",

    // CHANGE THIS to actual rooms.id for Ocean Pearl
    roomId: 12,

    roomType: "Deluxe King Room",
    roomCapacity: 2,
    roomDescription:
      "2 guests · King bed · City view",

    description:
      "A beautiful beachfront resort with stunning ocean views, premium rooms and modern amenities. Enjoy a relaxing stay with easy access to the beach, restaurants and local attractions.",
  },

  {
    id: 2,
    name: "Royal Palm Hotel",
    location: "Downtown Dubai, UAE",
    price: 8200,
    rating: 4.9,
    reviews: 581,
    discount: 20,
    emoji: "🏨",

    // CHANGE THIS to actual rooms.id for Royal Palm
    roomId: 13,

    roomType: "Deluxe King Room",
    roomCapacity: 2,
    roomDescription:
      "2 guests · King bed · City view",

    description:
      "Experience luxury and comfort in the heart of Dubai with world-class hospitality, modern rooms and convenient access to major attractions.",
  },

  {
    id: 3,
    name: "Bali Paradise Villa",
    location: "Ubud, Bali",
    price: 5600,
    rating: 4.7,
    reviews: 267,
    discount: 15,
    emoji: "🌴",

    // CHANGE THIS to actual rooms.id
    roomId: 14,

    roomType: "Premium Villa Room",
    roomCapacity: 2,
    roomDescription:
      "2 guests · King bed · Garden view",

    description:
      "Relax in a peaceful private villa surrounded by tropical nature and beautiful scenery.",
  },

  {
    id: 4,
    name: "The Grand Paris",
    location: "Paris, France",
    price: 9800,
    rating: 4.8,
    reviews: 412,
    discount: 10,
    emoji: "🗼",

    // CHANGE THIS to actual rooms.id
    roomId: 15,

    roomType: "Deluxe King Room",
    roomCapacity: 2,
    roomDescription:
      "2 guests · King bed · City view",

    description:
      "Elegant accommodation close to the city's most iconic attractions.",
  },
];


function HotelDetails() {
  const navigate = useNavigate();
  const { id } = useParams();


  // ============================================================
  // FIND HOTEL
  // ============================================================

  const hotel =
    hotels.find(
      (item) => item.id === Number(id)
    ) || hotels[0];


  // ============================================================
  // SELECTED ROOM
  // ============================================================

  const selectedRoom = {
    id: hotel.roomId,

    room_type: hotel.roomType,

    price: hotel.price,

    capacity: hotel.roomCapacity,

    description: hotel.roomDescription,
  };


  // ============================================================
  // GO TO BOOKING
  // ============================================================

  const handleBookRoom = () => {
    if (!selectedRoom.id) {
      console.error(
        "Room ID is missing for hotel:",
        hotel.name
      );

      return;
    }


    navigate(
      `/hotels/${hotel.id}/booking`,
      {
        state: {

          // IMPORTANT
          // This fixes your current problem
          roomId: selectedRoom.id,

          // Room information
          roomType:
            selectedRoom.room_type,

          roomPrice:
            selectedRoom.price,

          // Hotel information
          hotelId: hotel.id,

          hotelName:
            hotel.name,

          hotelLocation:
            hotel.location,

          hotelImage:
            hotel.image || "",

          // Extra information
          roomCapacity:
            selectedRoom.capacity,

          roomDescription:
            selectedRoom.description,
        },
      }
    );
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0B0F17",
        py: 5,
      }}
    >

      <Container maxWidth="xl">

        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            color: "#B8C0CC",
            mb: 3,
            textTransform: "none",
          }}
        >
          Back to hotels
        </Button>


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: {
              xs: "start",
              md: "center",
            },

            gap: 2,

            mb: 3,

            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >

          <Box>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,

                fontSize: {
                  xs: "2.2rem",
                  md: "3.5rem",
                },

                color: "#FFFFFF",
              }}
            >
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
                sx={{
                  color: "#6C63FF",
                }}
              />

              <Typography
                sx={{
                  color: "#B8C0CC",
                }}
              >
                {hotel.location}
              </Typography>

            </Box>

          </Box>


          <Button
            startIcon={
              <FavoriteBorder />
            }

            sx={{
              border:
                "1px solid #2A3441",

              color: "#fff",

              borderRadius: 2,

              px: 3,

              textTransform:
                "none",
            }}
          >
            Save
          </Button>

        </Box>


        {/* ================================================= */}
        {/* IMAGE GALLERY */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr 1fr",
            },

            gridTemplateRows: {
              xs: "250px",
              md: "180px 180px",
            },

            gap: 1.5,

            mb: 5,
          }}
        >

          {/* Main image */}

          <Box
            sx={{
              gridRow: {
                md: "span 2",
              },

              borderRadius: 4,

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                "radial-gradient(circle at 30% 30%, rgba(108,99,255,0.4), transparent 40%), linear-gradient(135deg, #202938, #11161F)",

              overflow: "hidden",
            }}
          >

            <Typography
              sx={{
                fontSize: {
                  xs: "6rem",
                  md: "9rem",
                },
              }}
            >
              {hotel.emoji}
            </Typography>

          </Box>


          {[
            "🌅",
            "🛏️",
            "🏊",
            "🍽️",
          ].map(
            (emoji, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: 4,

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background:
                    "linear-gradient(135deg, #202938, #11161F)",

                  border:
                    "1px solid #2A3441",
                }}
              >

                <Typography
                  sx={{
                    fontSize:
                      "4rem",
                  }}
                >
                  {emoji}
                </Typography>

              </Box>
            )
          )}

        </Box>


        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 350px",
            },

            gap: 5,
          }}
        >

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <Box>

            {/* Rating */}

            <Box
              sx={{
                display: "flex",

                alignItems:
                  "center",

                gap: 2,

                mb: 3,

                flexWrap:
                  "wrap",
              }}
            >

              <Rating
                value={hotel.rating}
                precision={0.1}
                readOnly
              />

              <Typography
                fontWeight={600}
                sx={{
                  color: "#FFFFFF",
                }}
              >
                {hotel.rating}
              </Typography>

              <Typography
                sx={{
                  color:
                    "#8F98A8",
                }}
              >
                {hotel.reviews} reviews
              </Typography>

              <Chip
                label="Excellent"
                sx={{
                  background:
                    "rgba(0,212,255,0.1)",

                  color:
                    "#00D4FF",
                }}
              />

            </Box>


            <Divider
              sx={{
                borderColor:
                  "#2A3441",

                mb: 4,
              }}
            />


            {/* About */}

            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: 2,

                color: "#FFFFFF",
              }}
            >
              About this hotel
            </Typography>


            <Typography
              sx={{
                color:
                  "#9AA4B2",

                lineHeight: 1.9,

                maxWidth: 800,
              }}
            >
              {hotel.description}
            </Typography>


            {/* Amenities */}

            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mt: 5,

                mb: 3,

                color: "#FFFFFF",
              }}
            >
              Popular amenities
            </Typography>


            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr 1fr",

                  sm: "repeat(4, 1fr)",
                },

                gap: 2,
              }}
            >

              {[
                [Wifi, "Free WiFi"],
                [Pool, "Swimming Pool"],
                [
                  Restaurant,
                  "Restaurant",
                ],
                [
                  LocalParking,
                  "Free Parking",
                ],
              ].map(
                ([Icon, label]) => (
                  <Box
                    key={label}
                    sx={{
                      p: 2,

                      borderRadius: 3,

                      background:
                        "#161B22",

                      border:
                        "1px solid #2A3441",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: 1,
                    }}
                  >

                    <Icon
                      sx={{
                        color:
                          "#6C63FF",
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          "#FFFFFF",
                      }}
                    >
                      {label}
                    </Typography>

                  </Box>
                )
              )}

            </Box>


            {/* ================================================= */}
            {/* AVAILABLE ROOMS */}
            {/* ================================================= */}

            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mt: 6,

                mb: 3,

                color: "#FFFFFF",
              }}
            >
              Available rooms
            </Typography>


            <Box
              sx={{
                p: 3,

                borderRadius: 4,

                background:
                  "#161B22",

                border:
                  "1px solid #2A3441",

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: {
                  xs: "start",
                  md: "center",
                },

                gap: 3,

                flexDirection: {
                  xs: "column",
                  md: "row",
                },
              }}
            >

              <Box>

                <KingBed
                  sx={{
                    color:
                      "#8B5CF6",

                    mb: 1,
                  }}
                />


                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  {selectedRoom.room_type}
                </Typography>


                <Typography
                  sx={{
                    color:
                      "#8F98A8",

                    mt: 1,
                  }}
                >
                  {selectedRoom.capacity}{" "}
                  guests · King bed · City view
                </Typography>


                {/* Room ID - useful while testing */}

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",

                    color:
                      "#667080",

                    mt: 1,
                  }}
                >
                  Room ID: {selectedRoom.id}
                </Typography>

              </Box>


              <Box
                sx={{
                  textAlign: {
                    xs: "left",
                    md: "right",
                  },
                }}
              >

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  ₹
                  {selectedRoom.price.toLocaleString()}
                </Typography>


                <Typography
                  variant="caption"
                  sx={{
                    color:
                      "#8F98A8",
                  }}
                >
                  per night
                </Typography>


                <Button
                  variant="contained"
                  onClick={
                    handleBookRoom
                  }
                  sx={{
                    display:
                      "block",

                    mt: 1.5,

                    borderRadius: 2,

                    px: 3,

                    textTransform:
                      "none",

                    fontWeight: 700,

                    background:
                      "linear-gradient(135deg, #6C63FF, #8B5CF6)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #7C73FF, #9B6CFF)",
                    },
                  }}
                >
                  Select room
                </Button>

              </Box>

            </Box>

          </Box>


          {/* ================================================= */}
          {/* BOOKING CARD */}
          {/* ================================================= */}

          <Box>

            <Box
              sx={{
                position:
                  "sticky",

                top: 100,

                p: 3,

                borderRadius: 4,

                background:
                  "#161B22",

                border:
                  "1px solid #2A3441",

                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.3)",
              }}
            >

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  color:
                    "#FFFFFF",
                }}
              >
                ₹
                {hotel.price.toLocaleString()}
              </Typography>


              <Typography
                sx={{
                  color:
                    "#8F98A8",

                  mb: 3,
                }}
              >
                per night
              </Typography>


              <Divider
                sx={{
                  borderColor:
                    "#2A3441",

                  mb: 3,
                }}
              />


              <Typography
                fontWeight={600}
                sx={{
                  mb: 1,

                  color:
                    "#FFFFFF",
                }}
              >
                Your stay
              </Typography>


              <Box
                sx={{
                  p: 2,

                  borderRadius: 2,

                  border:
                    "1px solid #2A3441",

                  mb: 2,
                }}
              >

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  Check-in
                </Typography>


                <Typography
                  sx={{
                    color:
                      "#8F98A8",
                  }}
                >
                  Select your date
                </Typography>

              </Box>


              <Box
                sx={{
                  p: 2,

                  borderRadius: 2,

                  border:
                    "1px solid #2A3441",

                  mb: 3,
                }}
              >

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  Check-out
                </Typography>


                <Typography
                  sx={{
                    color:
                      "#8F98A8",
                  }}
                >
                  Select your date
                </Typography>

              </Box>


              {/* IMPORTANT */}

              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={
                  handleBookRoom
                }
                sx={{
                  height: 55,

                  borderRadius: 2,

                  background:
                    "linear-gradient(135deg, #6C63FF, #8B5CF6)",

                  fontWeight: 700,

                  textTransform:
                    "none",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #7C73FF, #9B6CFF)",
                  },
                }}
              >
                Book now
              </Button>


              <Typography
                variant="caption"
                sx={{
                  display:
                    "block",

                  textAlign:
                    "center",

                  color:
                    "#667080",

                  mt: 2,
                }}
              >
                You won't be charged yet
              </Typography>

            </Box>

          </Box>

        </Box>

      </Container>

    </Box>
  );
}

export default HotelDetails;