import { useState } from "react";

import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
} from "@mui/material";

function HotelFilters() {
  const [price, setPrice] = useState([1000, 15000]);

  return (
    <Box
      sx={{
        background: "#161B22",
        border: "1px solid #2A3441",
        borderRadius: 4,
        p: 3,
        position: {
          md: "sticky",
        },
        top: 100,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3 }}
      >
        Filters
      </Typography>

      {/* Price */}
      <Typography
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Price per night
      </Typography>

      <Slider
        value={price}
        onChange={(_, value) => setPrice(value)}
        min={500}
        max={30000}
        step={500}
        valueLabelDisplay="auto"
        sx={{
          color: "#6C63FF",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "#8F98A8",
          fontSize: "0.8rem",
        }}
      >
        <span>₹{price[0].toLocaleString()}</span>
        <span>₹{price[1].toLocaleString()}</span>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Rating */}
      <Typography
        fontWeight={600}
        sx={{ mb: 1 }}
      >
        Guest rating
      </Typography>

      <FormGroup>
        {[5, 4, 3].map((rating) => (
          <FormControlLabel
            key={rating}
            control={
              <Checkbox
                sx={{
                  color: "#6C63FF",
                  "&.Mui-checked": {
                    color: "#6C63FF",
                  },
                }}
              />
            }
            label={`${rating}+ stars`}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Property Type */}
      <Typography
        fontWeight={600}
        sx={{ mb: 1 }}
      >
        Property type
      </Typography>

      <FormGroup>
        {[
          "Hotel",
          "Resort",
          "Villa",
          "Apartment",
        ].map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                sx={{
                  color: "#6C63FF",
                  "&.Mui-checked": {
                    color: "#6C63FF",
                  },
                }}
              />
            }
            label={type}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Amenities */}
      <Typography
        fontWeight={600}
        sx={{ mb: 1 }}
      >
        Amenities
      </Typography>

      <FormGroup>
        {[
          "Free WiFi",
          "Swimming Pool",
          "Restaurant",
          "Parking",
          "Air conditioning",
        ].map((amenity) => (
          <FormControlLabel
            key={amenity}
            control={
              <Checkbox
                sx={{
                  color: "#6C63FF",
                  "&.Mui-checked": {
                    color: "#6C63FF",
                  },
                }}
              />
            }
            label={amenity}
          />
        ))}
      </FormGroup>
    </Box>
  );
}

export default HotelFilters;