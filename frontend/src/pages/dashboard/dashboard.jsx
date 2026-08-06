import { Grid, Typography } from "@mui/material";

import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";

function Dashboard() {
  return (
    <DashboardLayout>

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Welcome Back 👋
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Hotels" value="24" />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Bookings" value="8" />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Wishlist" value="12" />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Reviews" value="15" />
        </Grid>

      </Grid>

    </DashboardLayout>
  );
}

export default Dashboard;