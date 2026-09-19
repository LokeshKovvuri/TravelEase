import { useState } from "react";

import {
  Box,
  Button,
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
  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Select date";

  return (
    <Box
      sx={{
        height: 56,
        position: "relative",
        display: "flex",
        alignItems: "center",
        border: "1px solid #394250",
        borderRadius: 2,
        background: "#161B22",
        px: 2,

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

      <Box
        sx={{
          position: "absolute",
          top: -9,
          left: 12,
          px: 0.7,
          background: "#161B22",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            color: "#A7B0C0",
            fontSize: "0.75rem",
            lineHeight: 1,
          }}
        >
          {label}
        </Typography>
      </Box>


      {/* Calendar icon */}

      <CalendarMonth
        sx={{
          mr: 1,
          color: "#8B5CF6",
          fontSize: 21,
          flexShrink: 0,
        }}
      />


      {/* Visible date */}

      <Typography
        sx={{
          color: value ? "#FFFFFF" : "#707A8A",
          fontSize: "1rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {displayValue}
      </Typography>


      {/* Invisible native date picker */}

      <Box
        component="input"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
          zIndex: 3,
        }}
      />
    </Box>
  );
}


function HotelSearch() {
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
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "1.5fr 1fr 1fr 0.7fr auto",
        },

        gap: 1.5,
        p: 2,
        borderRadius: 4,
        background: "#161B22",
        border: "1px solid #2A3441",

        boxShadow:
          "0 15px 40px rgba(0,0,0,0.25)",
      }}
    >

      {/* ================================================= */}
      {/* DESTINATION */}
      {/* ================================================= */}

      <TextField
        fullWidth
        label="Destination"
        placeholder="Where do you want to go?"
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
          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: 2,
            background: "#161B22",
            color: "#FFFFFF",

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

          "& .MuiInputLabel-root": {
            color: "#A7B0C0",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6C63FF",
          },

          "& input::placeholder": {
            color: "#707A8A",
            opacity: 1,
          },
        }}
      />


      {/* ================================================= */}
      {/* CHECK-IN */}
      {/* ================================================= */}

      <DateField
        label="Check-in"
        value={checkIn}
        onChange={setCheckIn}
      />


      {/* ================================================= */}
      {/* CHECK-OUT */}
      {/* ================================================= */}

      <DateField
        label="Check-out"
        value={checkOut}
        onChange={setCheckOut}
      />


      {/* ================================================= */}
      {/* GUESTS */}
      {/* ================================================= */}

      <TextField
        fullWidth
        label="Guests"
        type="number"
        value={guests}

        onChange={(e) =>
          setGuests(
            Math.max(1, Number(e.target.value))
          )
        }

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
          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: 2,
            background: "#161B22",
            color: "#FFFFFF",

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

          "& .MuiInputLabel-root": {
            color: "#A7B0C0",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#00D4FF",
          },
        }}
      />


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <Button
        variant="contained"
        startIcon={<Search />}
        onClick={handleSearch}

        sx={{
          minHeight: 56,
          px: 3,
          borderRadius: 2,

          background:
            "linear-gradient(135deg, #6C63FF, #8B5CF6)",

          boxShadow:
            "0 10px 25px rgba(108,99,255,0.25)",

          "&:hover": {
            background:
              "linear-gradient(135deg, #7C73FF, #9B6CFF)",

            transform: "translateY(-1px)",
          },

          transition: "all 0.2s ease",
        }}
      >
        Search
      </Button>

    </Box>
  );
}


export default HotelSearch;
