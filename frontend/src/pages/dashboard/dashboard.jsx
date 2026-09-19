import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";

function Dashboard() {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container sx={{ mt: 5 }}>

      <Typography
        variant="h3"
        gutterBottom
      >
        TravelEase Dashboard
      </Typography>

      <Typography
        variant="h6"
        sx={{ mb: 4 }}
      >
        Welcome to TravelEase
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
      >
        Logout
      </Button>

    </Container>
  );
}

export default Dashboard;
