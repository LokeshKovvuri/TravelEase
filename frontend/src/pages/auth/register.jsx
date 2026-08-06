import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Register() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Registration page will be implemented next.
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/"
        >
          Back to Login
        </Button>
      </Box>
    </Container>
  );
}

export default Register;