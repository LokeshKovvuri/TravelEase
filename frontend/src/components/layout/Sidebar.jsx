import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import HotelIcon from "@mui/icons-material/Hotel";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";

import { Link } from "react-router-dom";

const drawerWidth = 240;

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>

        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={Link} to="/hotels">
          <ListItemIcon>
            <HotelIcon />
          </ListItemIcon>

          <ListItemText primary="Hotels" />
        </ListItemButton>

        <ListItemButton component={Link} to="/bookings">
          <ListItemIcon>
            <BookOnlineIcon />
          </ListItemIcon>

          <ListItemText primary="Bookings" />
        </ListItemButton>

        <ListItemButton component={Link} to="/wishlist">
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>

          <ListItemText primary="Wishlist" />
        </ListItemButton>

        <ListItemButton component={Link} to="/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>

          <ListItemText primary="Profile" />
        </ListItemButton>

      </List>
    </Drawer>
  );
}

export default Sidebar;