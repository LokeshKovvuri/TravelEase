import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { LockReset, Save } from "@mui/icons-material";

import api from "../services/api";


const emptyProfile = {
  first_name: "",
  last_name: "",
  phone: "",
  gender: "",
  date_of_birth: "",
  profile_image: "",
};


function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyProfile);
  const [passwordForm, setPasswordForm] = useState({ old_password: "", new_password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/profile/");
        const data = response.data;
        setProfile(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          profile_image: data.profile_image || "",
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const changeField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const response = await api.put("/profile/", {
        ...form,
        phone: form.phone || null,
        gender: form.gender || null,
        date_of_birth: form.date_of_birth || null,
        profile_image: form.profile_image || null,
      });
      setProfile(response.data);
      setNotice("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError.response?.data?.detail || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (passwordForm.new_password.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }
    try {
      setChangingPassword(true);
      setError("");
      setNotice("");
      await api.put("/profile/change-password", passwordForm);
      setPasswordForm({ old_password: "", new_password: "" });
      setNotice("Password changed successfully.");
    } catch (passwordError) {
      setError(passwordError.response?.data?.detail || "Unable to change your password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}><CircularProgress sx={{ color: "#8B5CF6" }} /></Box>;
  }

  const initials = `${profile?.first_name?.[0] || "T"}${profile?.last_name?.[0] || "E"}`;

  return (
    <Box sx={{ minHeight: "100vh", background: "#0B0F17", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography sx={{ color: "#00D4FF", fontWeight: 800, letterSpacing: 1.6, fontSize: "0.78rem" }}>ACCOUNT</Typography>
        <Typography variant="h3" sx={{ color: "#fff", fontWeight: 900, mt: 0.8, mb: 4 }}>Your profile</Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {notice && <Alert severity="success" sx={{ mb: 3 }}>{notice}</Alert>}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "0.75fr 1.4fr" }, gap: 3 }}>
          <Card sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4, height: "fit-content" }}>
            <CardContent sx={{ textAlign: "center", p: 3.5 }}>
              <Avatar
                src={profile?.profile_image || undefined}
                sx={{ width: 88, height: 88, mx: "auto", mb: 2, background: "linear-gradient(135deg, #6048FF, #00D4FF)", fontWeight: 900, fontSize: "1.55rem" }}
              >
                {initials}
              </Avatar>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>
                {profile?.first_name} {profile?.last_name}
              </Typography>
              <Typography sx={{ color: "#8992A5", fontSize: "0.82rem", mt: 0.5 }}>{profile?.email}</Typography>
              <Box sx={{ display: "inline-block", mt: 2, px: 1.25, py: 0.5, borderRadius: 8, color: "#AFA7FF", background: "rgba(108,99,255,.16)", fontSize: "0.72rem", fontWeight: 800 }}>
                {profile?.role || "USER"}
              </Box>
              <Divider sx={{ borderColor: "#2A3441", my: 3 }} />
              <Typography sx={{ color: "#8992A5", fontSize: "0.75rem" }}>
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "--"}
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Card sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }} component="form" onSubmit={saveProfile}>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>Personal information</Typography>
                <Typography sx={{ color: "#8992A5", fontSize: "0.82rem", mt: 0.5, mb: 2.5 }}>Keep your traveler information current.</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <TextField label="First name" name="first_name" value={form.first_name} onChange={changeField} required fullWidth />
                  <TextField label="Last name" name="last_name" value={form.last_name} onChange={changeField} required fullWidth />
                  <TextField label="Email" value={profile?.email || ""} disabled fullWidth />
                  <TextField label="Phone" name="phone" value={form.phone} onChange={changeField} fullWidth />
                  <TextField select label="Gender" name="gender" value={form.gender} onChange={changeField} fullWidth>
                    <MenuItem value="">Prefer not to say</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Non-binary">Non-binary</MenuItem>
                  </TextField>
                  <TextField label="Date of birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={changeField} fullWidth InputLabelProps={{ shrink: true }} />
                  <TextField label="Profile image URL" name="profile_image" value={form.profile_image} onChange={changeField} fullWidth sx={{ gridColumn: { sm: "span 2" } }} />
                </Box>
                <Button type="submit" variant="contained" startIcon={<Save />} disabled={saving} sx={{ mt: 3, borderRadius: 2, textTransform: "none", background: "linear-gradient(135deg, #6C63FF, #8B5CF6)" }}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ background: "#161B22", border: "1px solid #2A3441", borderRadius: 4 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }} component="form" onSubmit={changePassword}>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>Password</Typography>
                <Typography sx={{ color: "#8992A5", fontSize: "0.82rem", mt: 0.5, mb: 2.5 }}>Use a strong password with at least 8 characters.</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <TextField label="Current password" type="password" value={passwordForm.old_password} onChange={(event) => setPasswordForm((current) => ({ ...current, old_password: event.target.value }))} required fullWidth />
                  <TextField label="New password" type="password" value={passwordForm.new_password} onChange={(event) => setPasswordForm((current) => ({ ...current, new_password: event.target.value }))} required fullWidth inputProps={{ minLength: 8 }} />
                </Box>
                <Button type="submit" variant="outlined" startIcon={<LockReset />} disabled={changingPassword} sx={{ mt: 3, color: "#fff", borderColor: "#5B5570", borderRadius: 2, textTransform: "none" }}>
                  {changingPassword ? "Updating…" : "Change password"}
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Profile;
