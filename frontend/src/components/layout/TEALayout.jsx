import {
  Box,
} from "@mui/material";

import { useState } from "react";

import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

function TEALayout({ children }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#060A13",
        color: "#FFFFFF",
      }}
    >

      {/* SIDEBAR */}

      <Sidebar
        mobileOpen={mobileNavigationOpen}
        onMobileClose={() => setMobileNavigationOpen(false)}
      />

      {/* MAIN AREA */}

      <Box
        sx={{
          marginLeft: {
            xs: 0,
            md: "194px",
          },

          minHeight: "100vh",

          background:
            "radial-gradient(circle at 70% 10%, rgba(82,64,255,0.06), transparent 30%), #060A13",
        }}
      >

        <TopHeader
          onMenuOpen={() => setMobileNavigationOpen(true)}
        />

        <Box
          sx={{
            width: "100%",
          }}
        >
          {children}
        </Box>

      </Box>

    </Box>
  );
}

export default TEALayout;
