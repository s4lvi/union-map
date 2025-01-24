// frontend/src/components/EditUnionModal.js
import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

// Define sector options
const sectorOptions = [
  "Manufacturing",
  "Agriculture",
  "Healthcare",
  "Service",
  "Other",
];

function EditUnionModal({ open, handleClose, union, onUpdate }) {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    type: "",
    sector: "",
    association: "",
    site: "",
    info: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (union) {
      setForm({
        name: union.name || "",
        type: union.type || "",
        sector: union.sector || "",
        association: union.association || "",
        site: union.site || "",
        info: union.info || "",
        address: union.address || "",
        city: union.city || "",
        state: union.state || "",
        zip: union.zip || "",
      });
    }
  }, [union]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    // Basic validation
    const { name, type, sector, city, state, zip, address } = form;
    if (!name || !type || !sector || !city || !state || !zip) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // If address has changed, you might want to re-geocode
      // For simplicity, assuming coordinates remain the same
      // If address changes, implement geocoding here

      // Prepare updated data
      const updatedData = {
        ...form,
      };

      // Send PUT request to update the union
      const res = await api.put(`/unions/${union._id}`, updatedData);

      setSuccess("Union updated successfully.");
      onUpdate(res.data); // Callback to update the union in the Admin page

      // Close the modal after a short delay
      setTimeout(() => {
        handleClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update union.");
    } finally {
      setLoading(false);
    }
  };

  if (!union) return null; // Do not render if no union is selected

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Union</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {loading && (
          <Grid container justifyContent="center" sx={{ mb: 2 }}>
            <CircularProgress size={24} />
          </Grid>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Union Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Type"
              name="type"
              fullWidth
              value={form.type}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="sector-label">Sector</InputLabel>
              <Select
                labelId="sector-label"
                name="sector"
                value={form.sector}
                label="Sector"
                onChange={handleChange}
              >
                {sectorOptions.map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Association"
              name="association"
              fullWidth
              value={form.association}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Website"
              name="site"
              fullWidth
              value={form.site}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Info"
              name="info"
              fullWidth
              multiline
              rows={3}
              value={form.info}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={form.address}
              onChange={handleChange}
              helperText="Enter the full address."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="City"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="State"
              name="state"
              fullWidth
              value={form.state}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="ZIP Code"
              name="zip"
              fullWidth
              value={form.zip}
              onChange={handleChange}
              required
            />
          </Grid>
          {/* Coordinates are auto-filled based on map click; no need for input */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Update Union
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUnionModal;
