import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack, Delete, RateReview } from "@mui/icons-material";

import api from "../services/api";


function Reviews() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/profile/reviews");
      setReviews(response.data || []);
    } catch (loadError) {
      setError(loadError.response?.data?.detail || "Unable to load your reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!bookingId) return;
    if (!comment.trim()) {
      setError("Please add a short comment about your stay.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setNotice("");
      await api.post("/reviews/", {
        booking_id: Number(bookingId),
        rating,
        comment: comment.trim(),
      });
      setComment("");
      setRating(5);
      setNotice("Thank you—your review has been published.");
      navigate("/reviews", { replace: true });
      await loadReviews();
    } catch (submitError) {
      setError(submitError.response?.data?.detail || "Unable to publish your review.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    try {
      setDeletingId(reviewId);
      setError("");
      await api.delete(`/reviews/${reviewId}`);
      setReviews((currentReviews) => currentReviews.filter(
        (review) => review.id !== reviewId
      ));
    } catch (deleteError) {
      setError(deleteError.response?.data?.detail || "Unable to delete this review.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}><CircularProgress sx={{ color: "#8B5CF6" }} /></Box>;
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#0B0F17", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 4 }}>
          <Box>
            <Typography sx={{ color: "#00D4FF", fontSize: "0.78rem", fontWeight: 800, letterSpacing: 1.6 }}>TRAVELER REVIEWS</Typography>
            <Typography variant="h3" sx={{ color: "#fff", fontWeight: 900, mt: 0.8 }}>Your experiences</Typography>
          </Box>
          <Button onClick={() => navigate("/my-bookings")} startIcon={<ArrowBack />} sx={{ color: "#B8C0CC", textTransform: "none" }}>Bookings</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {notice && <Alert severity="success" sx={{ mb: 3 }}>{notice}</Alert>}

        {bookingId && (
          <Card sx={{ background: "#161B22", border: "1px solid #49406F", borderRadius: 4, mb: 3 }}>
            <CardContent component="form" onSubmit={submitReview} sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>Review booking TEA-{String(bookingId).padStart(6, "0")}</Typography>
              <Typography sx={{ color: "#8992A5", fontSize: "0.82rem", mt: 0.5 }}>Tell future travelers about your hotel stay.</Typography>
              <Box sx={{ mt: 2.5 }}>
                <Typography sx={{ color: "#DDE1E8", fontSize: "0.8rem", mb: 0.75 }}>Your rating</Typography>
                <Rating value={rating} onChange={(_, value) => setRating(value || 1)} size="large" />
              </Box>
              <TextField
                label="Your review"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                required
                fullWidth
                multiline
                minRows={4}
                inputProps={{ maxLength: 1000 }}
                helperText={`${comment.length}/1000`}
                sx={{ mt: 2 }}
              />
              <Button type="submit" variant="contained" disabled={submitting} sx={{ mt: 2.5, borderRadius: 2, textTransform: "none", background: "linear-gradient(135deg, #6C63FF, #8B5CF6)" }}>
                {submitting ? "Publishing…" : "Publish review"}
              </Button>
            </CardContent>
          </Card>
        )}

        {reviews.length === 0 ? (
          <Card sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4 }}>
            <CardContent sx={{ py: 7, textAlign: "center" }}>
              <RateReview sx={{ color: "#8B7DFF", fontSize: 50 }} />
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, mt: 1 }}>No reviews yet</Typography>
              <Typography sx={{ color: "#8992A5", mt: 0.75 }}>After a confirmed hotel stay, you can share your experience here.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reviews.map((review) => (
              <Card key={review.id} sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Box>
                      <Typography sx={{ color: "#fff", fontWeight: 800 }}>Booking TEA-{String(review.booking_id).padStart(6, "0")}</Typography>
                      <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.6 }} />
                    </Box>
                    <IconButton aria-label="Delete review" onClick={() => deleteReview(review.id)} disabled={deletingId === review.id} sx={{ color: "#FF6B8F" }}>
                      <Delete />
                    </IconButton>
                  </Box>
                  <Typography sx={{ color: "#C4CAD4", lineHeight: 1.7, mt: 1.5 }}>{review.comment}</Typography>
                  <Typography sx={{ color: "#748094", fontSize: "0.72rem", mt: 1.5 }}>
                    Published {new Date(review.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Reviews;
