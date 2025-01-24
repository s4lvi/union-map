// frontend/src/components/AddUnionModal.js
import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function AddUnionModal({ open, handleClose, position, onAdd }) {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    type: "",
    site: "",
    info: "",
    city: "",
    state: "",
    zip: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    // Basic validation
    const { name, type, city, state, zip } = form;
    if (!name || !type || !city || !state || !zip) {
      setError("Please fill in all required fields.");
      return;
    }

    // Prepare coordinates: [longitude, latitude]
    const coordinates = [position.lng, position.lat];

    try {
      const res = await api.post("/unions", {
        ...form,
        coordinates,
      });

      setSuccess("Union added successfully.");
      onAdd(res.data); // Callback to add the new union to the map
      // Optionally, reset the form
      setForm({
        name: "",
        type: "",
        site: "",
        info: "",
        city: "",
        state: "",
        zip: "",
      });
      // Close the modal after a short delay
      setTimeout(() => {
        handleClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add union.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Union</DialogTitle>
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
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              name="state"
              fullWidth
              value={form.state}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Union
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUnionModal;
