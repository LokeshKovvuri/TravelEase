import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Explore,
  Hotel,
  Flight,
  Train,
  DirectionsBus,
  LocalTaxi,
  CalendarMonth,
  FavoriteBorder,
  RateReview,
  Person,
  LocalOffer,
  LightMode,
  DarkMode,
  Close,
  AutoAwesome,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";

function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const mainItems = [
    {
      label: "Explore",
      icon: <Explore />,
      path: "/explore",
    },
    {
      label: "Stays",
      icon: <Hotel />,
      path: "/hotels",
    },
    {
      label: "Flights",
      icon: <Flight />,
      path: "/flights",
    },
    {
      label: "Trains",
      icon: <Train />,
      path: "/trains",
    },
    {
      label: "Buses",
      icon: <DirectionsBus />,
      path: "/buses",
    },
    {
      label: "Cabs",
      icon: <LocalTaxi />,
      path: "/cabs",
    },
    {
      label: "AI Planner",
      icon: <AutoAwesome />,
      path: "/ai-planner",
    },
  ];

  const accountItems = [
    {
      label: "My Bookings",
      icon: <CalendarMonth />,
      path: "/my-bookings",
    },
    {
      label: "Wishlist",
      icon: <FavoriteBorder />,
      path: "/wishlist",
    },
    {
      label: "Reviews",
      icon: <RateReview />,
      path: "/reviews",
    },
    {
      label: "Profile",
      icon: <Person />,
      path: "/profile",
    },
    {
      label: "Offers",
      icon: <LocalOffer />,
      path: "/offers",
    },
  ];

  const renderItem = (item) => {
    const active =
      location.pathname === item.path ||
      (
        item.path === "/explore" &&
        location.pathname === "/home"
      ) ||
      (
        item.path !== "/explore" &&
        location.pathname.startsWith(item.path)
      );

    return (
      <Box
        key={item.label}
        onClick={() => {
          navigate(item.path);
          if (isMobile) onMobileClose?.();
        }}
        sx={{
          height: 42,
          px: 1.5,
          mb: 0.5,
          borderRadius: 2.5,

          display: "flex",
          alignItems: "center",
          gap: 1.5,

          cursor: "pointer",

          color: active
            ? "#FFFFFF"
            : "#8992A5",

          background: active
            ? "linear-gradient(90deg, #6048FF, #7255FF)"
            : "transparent",

          boxShadow: active
            ? "0 8px 24px rgba(99, 78, 255, 0.28)"
            : "none",

          transition:
            "all 0.2s ease",

          "&:hover": {
            background: active
              ? "linear-gradient(90deg, #6048FF, #7255FF)"
              : "rgba(255,255,255,0.05)",

            color: "#FFFFFF",

            transform:
              "translateX(2px)",
          },

          "& svg": {
            fontSize: 19,
          },
        }}
      >
        {item.icon}

        <Typography
          sx={{
            fontSize: "0.86rem",
            fontWeight: active ? 700 : 500,
          }}
        >
          {item.label}
        </Typography>
      </Box>
    );
  };

  const content = (
    <Box
      sx={{
        width: 194,
        minWidth: 194,
        height: isMobile ? "100%" : "100vh",

        position: isMobile ? "relative" : "fixed",
        left: 0,
        top: 0,

        display: "flex",
        flexDirection: "column",

        background:
          "linear-gradient(180deg, #070B15 0%, #080C17 100%)",

        borderRight:
          "1px solid rgba(108,99,255,0.16)",

        zIndex: 1200,

        overflowY: "auto",

        "&::-webkit-scrollbar": {
          width: 4,
        },

        "&::-webkit-scrollbar-thumb": {
          background: "#252B3A",
          borderRadius: 10,
        },
      }}
    >

      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1.2, pt: 1.1 }}>
          <IconButton
            onClick={onMobileClose}
            aria-label="Close navigation"
            sx={{ color: "#B9C1D0" }}
          >
            <Close />
          </IconButton>
        </Box>
      )}

      {/* ================================================= */}
      {/* BRAND */}
      {/* ================================================= */}

      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.65rem",
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: "-1px",

            background:
              "linear-gradient(90deg, #7C6CFF, #00D4FF)",

            WebkitBackgroundClip:
              "text",

            WebkitTextFillColor:
              "transparent",
          }}
        >
          TEA ✈
        </Typography>

        <Typography
          sx={{
            mt: 0.6,
            color: "#7E8799",
            fontSize: "0.62rem",
            letterSpacing: 0.4,
          }}
        >
          Travel Easy Around
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,0.06)",
          mb: 1.5,
        }}
      />

      {/* ================================================= */}
      {/* MAIN NAVIGATION */}
      {/* ================================================= */}

      <Box sx={{ px: 1.5 }}>
        {mainItems.map(renderItem)}
      </Box>

      <Box sx={{ flex: 1 }} />

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,0.06)",
          mx: 1.5,
          mb: 1.5,
        }}
      />

      {/* ================================================= */}
      {/* ACCOUNT NAVIGATION */}
      {/* ================================================= */}

      <Box sx={{ px: 1.5 }}>
        {accountItems.map(renderItem)}
      </Box>

      {/* ================================================= */}
      {/* OFFER CARD */}
      {/* ================================================= */}

      <Box
        onClick={() => navigate("/offers")}
        sx={{
          mx: 1.5,
          mt: 2,
          mb: 1.5,

          p: 1.5,

          borderRadius: 3,

          background:
            "linear-gradient(145deg, rgba(96,72,255,0.16), rgba(0,212,255,0.06))",

          border:
            "1px solid rgba(108,99,255,0.25)",

          cursor: "pointer",

          "&:hover": {
            borderColor: "rgba(108,99,255,0.6)",
          },
        }}
      >
        <Typography
          sx={{
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: "0.78rem",
          }}
        >
          Travel picks
        </Typography>

        <Typography
          sx={{
            color: "#8F98A8",
            fontSize: "0.62rem",
            mt: 0.4,
          }}
        >
          Explore available routes
        </Typography>

        <Box
          sx={{
            mt: 1.2,
            py: 0.7,

            textAlign: "center",

            borderRadius: 2,

            background:
              "linear-gradient(90deg, #6048FF, #775CFF)",

            color: "#FFFFFF",

            fontSize: "0.65rem",
            fontWeight: 700,
          }}
        >
          EXPLORE
        </Box>
      </Box>

      {/* ================================================= */}
      {/* THEME */}
      {/* ================================================= */}

      <Box
        sx={{
          mx: 1.5,
          mb: 2,

          display: "flex",

          borderRadius: 3,

          background:
            "rgba(255,255,255,0.04)",

          border:
            "1px solid rgba(255,255,255,0.06)",

          p: 0.4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
            py: 0.6,
            color: "#7E8799",
            fontSize: "0.6rem",
          }}
        >
          <LightMode sx={{ fontSize: 14 }} />
          Light
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
            py: 0.6,
            borderRadius: 2,
            background:
              "rgba(108,99,255,0.25)",
            color: "#FFFFFF",
            fontSize: "0.6rem",
            fontWeight: 700,
          }}
        >
          <DarkMode sx={{ fontSize: 14 }} />
          Dark
        </Box>
      </Box>

    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        PaperProps={{
          sx: {
            width: 194,
            background: "#070B15",
            borderRight: "1px solid rgba(108,99,255,0.24)",
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return content;
}

export default Sidebar;
