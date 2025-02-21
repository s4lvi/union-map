// frontend/src/components/AddUnionModal.js
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

function AddUnionModal({ open, handleClose, position, onAdd }) {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    designation_name: "",
    designation_number: "",
    sector: "",
    site: "",
    info: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Function to perform reverse geocoding using OpenStreetMap's Nominatim API
  const fetchAddress = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch address information.");
      }
      const data = await response.json();
      const address = data.address || {};

      setForm((prevForm) => ({
        ...prevForm,
        address: address.road || "", // Assuming 'road' as the address
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        zip: address.postcode || "",
      }));
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve address from the provided location.");
    } finally {
      setLoadingAddress(false);
    }
  };

  // useEffect to fetch address when modal opens and position is provided
  useEffect(() => {
    if (open && position) {
      fetchAddress(position.lat, position.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, position]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    // Basic validation
    const { name, sector, city, state, zip, address } = form;
    if (!name || !sector || !city || !state || !zip) {
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
        designation_name: "",
        designation_number: "",
        sector: "",
        site: "",
        info: "",
        address: "",
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
        {loadingAddress && (
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
              label="Designation Name"
              name="designation_name"
              fullWidth
              value={form.designation_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Designation Type"
              name="designation_number"
              fullWidth
              value={form.designation_number}
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
              helperText="Enter the full address to automatically set location."
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
          disabled={loadingAddress}
        >
          Add Union
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUnionModal;
