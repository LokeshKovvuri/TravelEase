import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  Search,
  LocationOn,
  CalendarMonth,
  People,
} from "@mui/icons-material";


function DateField({ label, value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <Box
      sx={{
        height: 82,
        border: "1px solid #394250",
        borderRadius: 2,
        background: "#161B22",
        px: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.2s ease",

        "&:hover": {
          borderColor: "#6C63FF",
        },

        "&:focus-within": {
          borderColor: "#6C63FF",
          boxShadow: "0 0 0 1px #6C63FF",
        },
      }}
    >
      {/* Label */}
      <Typography
        sx={{
          color: "#9AA4B2",
          fontSize: "0.75rem",
          lineHeight: 1,
          mb: 1,
        }}
      >
        {label}
      </Typography>

      {/* Date input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CalendarMonth
          sx={{
            color: "#8B5CF6",
            fontSize: 21,
            flexShrink: 0,
          }}
        />

        <Box
          component="input"
          type={focused || value ? "date" : "text"}
          value={value}
          placeholder="Select date"
          onFocus={() => setFocused(true)}
          onBlur={() => {
            if (!value) {
              setFocused(false);
            }
          }}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            width: "100%",
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#FFFFFF",
            fontFamily: "inherit",
            fontSize: "1rem",
            cursor: "pointer",

            "&::placeholder": {
              color: "#707A8A",
              opacity: 1,
            },

            "&::-webkit-calendar-picker-indicator": {
              filter: "invert(1)",
              cursor: "pointer",
            },
          }}
        />
      </Box>
    </Box>
  );
}


function SearchSection() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);


  const handleSearch = () => {
    console.log({
      destination,
      checkIn,
      checkOut,
      guests,
    });
  };


  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 5,
        py: { xs: 3, md: 5 },
        background: "#0B0F17",
      }}
    >
      <Container maxWidth="xl">

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            background: "rgba(22, 27, 34, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(108, 99, 255, 0.3)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.35), 0 0 35px rgba(108,99,255,0.08)",
          }}
        >

          <Typography
            sx={{
              fontSize: "1.15rem",
              fontWeight: 600,
              color: "#FFFFFF",
              mb: 2.5,
            }}
          >
            Find your perfect stay
          </Typography>


          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "1.5fr 1fr 1fr 0.7fr auto",
              },

              gap: 1.5,
              alignItems: "center",
            }}
          >

            {/* Destination */}

            <TextField
              fullWidth
              label="Destination"
              placeholder="City or destination"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <LocationOn
                    sx={{
                      mr: 1,
                      color: "#6C63FF",
                    }}
                  />
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#9AA4B2",
                },

                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#8B5CF6",
                },

                "& .MuiOutlinedInput-root": {
                  height: 82,
                  color: "#FFFFFF",
                  borderRadius: 2,
                  background: "#161B22",

                  "& fieldset": {
                    borderColor: "#394250",
                  },

                  "&:hover fieldset": {
                    borderColor: "#6C63FF",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#6C63FF",
                  },
                },

                "& input::placeholder": {
                  color: "#707A8A",
                  opacity: 1,
                },
              }}
            />


            {/* Check-in */}

            <DateField
              label="Check-in"
              value={checkIn}
              onChange={setCheckIn}
            />


            {/* Check-out */}

            <DateField
              label="Check-out"
              value={checkOut}
              onChange={setCheckOut}
            />


            {/* Guests */}

            <TextField
              fullWidth
              label="Guests"
              type="number"
              value={guests}
              onChange={(e) => {
                const value = Number(e.target.value);

                setGuests(
                  value > 0 ? value : 1
                );
              }}
              inputProps={{
                min: 1,
                max: 20,
              }}
              InputProps={{
                startAdornment: (
                  <People
                    sx={{
                      mr: 1,
                      color: "#00D4FF",
                    }}
                  />
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#9AA4B2",
                },

                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#00D4FF",
                },

                "& .MuiOutlinedInput-root": {
                  height: 82,
                  color: "#FFFFFF",
                  borderRadius: 2,
                  background: "#161B22",

                  "& fieldset": {
                    borderColor: "#394250",
                  },

                  "&:hover fieldset": {
                    borderColor: "#00D4FF",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#00D4FF",
                  },
                },
              }}
            />


            {/* Search */}

            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              startIcon={<Search />}
              sx={{
                height: 82,
                px: 3.5,
                borderRadius: 2,
                whiteSpace: "nowrap",

                background:
                  "linear-gradient(135deg, #6C63FF, #8B5CF6)",

                boxShadow:
                  "0 10px 30px rgba(108,99,255,0.3)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7C73FF, #9B6CFF)",
                  transform: "translateY(-2px)",
                  boxShadow:
                    "0 15px 35px rgba(108,99,255,0.4)",
                },

                transition: "all 0.2s ease",
              }}
            >
              Search
            </Button>

          </Box>

        </Paper>
      </Container>
    </Box>
  );
}


export default SearchSection;