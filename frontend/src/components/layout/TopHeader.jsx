import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import {
  NotificationsNone,
  KeyboardArrowDown,
  AirplanemodeActive,
  Person,
  FavoriteBorder,
  BookOutlined,
  Logout,
  MenuOutlined,
} from "@mui/icons-material";

import useAuth from "../../context/useAuth";
import api from "../../services/api";


function TopHeader({ onMenuOpen }) {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [profileAnchor, setProfileAnchor] = useState(null);

  const [profile, setProfile] = useState(null);

  const profileOpen = Boolean(profileAnchor);

  useEffect(() => {
    let active = true;
    api.get("/profile/")
      .then((response) => {
        if (active) setProfile(response.data);
      })
      .catch(() => {
        // The header should remain usable if the optional profile request
        // cannot be completed (for example, while the API is restarting).
      });
    return () => {
      active = false;
    };
  }, []);

  const travelerName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Traveler";

  const travelerInitials = `${profile?.first_name?.[0] || "T"}${
    profile?.last_name?.[0] || "E"
  }`;


  // ============================================================
  // OPEN PROFILE MENU
  // ============================================================

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };


  // ============================================================
  // CLOSE PROFILE MENU
  // ============================================================

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };


  // ============================================================
  // PROFILE
  // ============================================================

  const handleProfile = () => {
    handleProfileClose();

    navigate("/profile");
  };


  // ============================================================
  // MY BOOKINGS
  // ============================================================

  const handleBookings = () => {
    handleProfileClose();

    navigate("/my-bookings");
  };


  // ============================================================
  // WISHLIST
  // ============================================================

  const handleWishlist = () => {
    handleProfileClose();

    navigate("/wishlist");
  };


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    handleProfileClose();

    logout();

    navigate("/");
  };


  return (
    <Box
      sx={{
        height: 72,

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        px: {
          xs: 2,
          md: 3,
        },

        borderBottom:
          "1px solid rgba(255,255,255,0.05)",

        background:
          "rgba(7,11,21,0.72)",

        backdropFilter: "blur(18px)",

        position: "sticky",

        top: 0,

        zIndex: 100,
      }}
    >

      {/* ======================================================
          LEFT
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >

        <IconButton
          onClick={onMenuOpen}
          aria-label="Open navigation"
          sx={{
            display: { xs: "inline-flex", md: "none" },
            color: "#C7C2FF",
            mr: 0.25,
          }}
        >
          <MenuOutlined />
        </IconButton>

        <AirplanemodeActive
          sx={{
            color: "#6C63FF",
            fontSize: 21,
          }}
        />

        <Box>

          <Typography
            sx={{
              fontSize: "0.92rem",
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            Where to next?
          </Typography>

          <Typography
            sx={{
              fontSize: "0.62rem",
              color: "#747E91",
            }}
          >
            Discover your next journey
          </Typography>

        </Box>

      </Box>


      {/* ======================================================
          RIGHT
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >

        {/* ====================================================
            CURRENCY
        ==================================================== */}

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },

            alignItems: "center",

            gap: 0.5,

            px: 1.3,

            py: 0.7,

            borderRadius: 2,

            border:
              "1px solid rgba(255,255,255,0.1)",

            color: "#B8C0CC",

            fontSize: "0.68rem",

            cursor: "pointer",
          }}
        >
          INR

          <KeyboardArrowDown
            sx={{
              fontSize: 15,
            }}
          />
        </Box>


        {/* ====================================================
            NOTIFICATIONS
        ==================================================== */}

        <IconButton
          sx={{
            color: "#B8C0CC",
          }}
        >
          <NotificationsNone />
        </IconButton>


        {/* ====================================================
            PROFILE
        ==================================================== */}

        <Box>

          <Box
            onClick={handleProfileClick}
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1,

              cursor: "pointer",

              borderRadius: 2.5,

              px: 0.8,

              py: 0.5,

              transition:
                "background .2s ease",

              "&:hover": {
                background:
                  "rgba(255,255,255,0.05)",
              },
            }}
          >

            <Avatar
              src={profile?.profile_image || undefined}
              sx={{
                width: 34,

                height: 34,

                background:
                  "linear-gradient(135deg, #6048FF, #00D4FF)",

                fontSize: "0.8rem",

                fontWeight: 800,
              }}
            >
              {travelerInitials}
            </Avatar>


            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >

              <Typography
                sx={{
                  color: "#FFFFFF",

                  fontSize: "0.72rem",

                  fontWeight: 700,
                }}
              >
                {travelerName}
              </Typography>

              <Typography
                sx={{
                  color: "#697386",

                  fontSize: "0.58rem",
                }}
              >
                {profile?.role || "Traveler"}
              </Typography>

            </Box>


            <KeyboardArrowDown
              sx={{
                color: "#7B8497",

                fontSize: 17,

                transform:
                  profileOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",

                transition:
                  "transform .2s ease",
              }}
            />

          </Box>


          {/* ==================================================
              PROFILE MENU
          ================================================== */}

          <Menu
            anchorEl={profileAnchor}

            open={profileOpen}

            onClose={handleProfileClose}

            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}

            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}

            PaperProps={{
              sx: {
                mt: 1.2,

                width: 230,

                borderRadius: 3,

                background: "#111827",

                color: "#FFFFFF",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.45)",

                overflow: "hidden",

                "& .MuiMenuItem-root": {
                  gap: 1.5,

                  py: 1.3,

                  fontSize: "0.85rem",

                  "&:hover": {
                    background:
                      "rgba(108,99,255,0.10)",
                  },
                },
              },
            }}
          >

            {/* USER */}

            <Box
              sx={{
                px: 2,

                py: 1.8,
              }}
            >

              <Box
                sx={{
                  display: "flex",

                  alignItems: "center",

                  gap: 1.2,
                }}
              >

                <Avatar
                  src={profile?.profile_image || undefined}
                  sx={{
                    width: 40,

                    height: 40,

                    background:
                      "linear-gradient(135deg, #6048FF, #00D4FF)",

                    fontWeight: 800,
                  }}
                >
                  {travelerInitials}
                </Avatar>

                <Box>

                  <Typography
                    sx={{
                      fontWeight: 800,

                      fontSize: "0.85rem",
                    }}
                  >
                    {travelerName}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#697386",

                      fontSize: "0.68rem",
                    }}
                  >
                    {profile?.role || "Traveler"}
                  </Typography>

                </Box>

              </Box>

            </Box>


            <Divider
              sx={{
                borderColor:
                  "rgba(255,255,255,0.07)",
              }}
            />


            {/* PROFILE */}

            <MenuItem onClick={handleProfile}>

              <Person
                sx={{
                  fontSize: 19,
                  color: "#8F84FF",
                }}
              />

              Profile

            </MenuItem>


            {/* MY BOOKINGS */}

            <MenuItem onClick={handleBookings}>

              <BookOutlined
                sx={{
                  fontSize: 19,
                  color: "#8F84FF",
                }}
              />

              My Bookings

            </MenuItem>


            {/* WISHLIST */}

            <MenuItem onClick={handleWishlist}>

              <FavoriteBorder
                sx={{
                  fontSize: 19,
                  color: "#8F84FF",
                }}
              />

              Wishlist

            </MenuItem>


            <Divider
              sx={{
                borderColor:
                  "rgba(255,255,255,0.07)",
              }}
            />


            {/* LOGOUT */}

            <MenuItem
              onClick={handleLogout}
              sx={{
                color:
                  "#FF6B7A !important",

                "&:hover": {
                  background:
                    "rgba(255,75,95,0.08) !important",
                },
              }}
            >

              <Logout
                sx={{
                  fontSize: 19,
                }}
              />

              Logout

            </MenuItem>

          </Menu>

        </Box>

      </Box>

    </Box>
  );
}


export default TopHeader;
