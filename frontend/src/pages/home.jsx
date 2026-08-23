import { Box } from "@mui/material";

import Hero from "../components/home/Hero";
import SearchSection from "../components/home/SearchSection";
import PopularDestinations from "../components/home/PopularDestinations";
import FeaturedHotels from "../components/home/FeaturedHotels";
import SpecialOffers from "../components/home/SpecialOffers";
import WhyTravelEase from "../components/home/WhyTravelEase";
import Newsletter from "../components/home/Newsletter";

function Home() {
  return (
    <Box
      sx={{
        background: "#0B0F17",
        minHeight: "100vh",
      }}
    >
      <Hero />
      <SearchSection />
      <PopularDestinations />
      <FeaturedHotels />
      <SpecialOffers />
      <WhyTravelEase />
      <Newsletter />
    </Box>
  );
}

export default Home;