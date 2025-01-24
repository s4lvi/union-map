// frontend/src/components/AddUnion.js
import React, { useState } from "react";
import api from "../services/api";
import { TextField, Button, Container, Typography } from "@mui/material";

function AddUnion() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    site: "",
    info: "",
    city: "",
    state: "",
    zip: "",
    latitude: "",
    longitude: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, type, site, info, city, state, zip, latitude, longitude } =
      form;
    try {
      await api.post(
        "/unions",
        {
          name,
          type,
          site,
          info,
          city,
          state,
          zip,
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("Union added successfully");
      // Optionally, reset form
      setForm({
        name: "",
        type: "",
        site: "",
        info: "",
        city: "",
        state: "",
        zip: "",
        latitude: "",
        longitude: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding union");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Add New Union
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Type"
          name="type"
          fullWidth
          margin="normal"
          value={form.type}
          onChange={handleChange}
          required
        />
        <TextField
          label="Website"
          name="site"
          fullWidth
          margin="normal"
          value={form.site}
          onChange={handleChange}
        />
        <TextField
          label="Info"
          name="info"
          fullWidth
          margin="normal"
          value={form.info}
          onChange={handleChange}
        />
        <TextField
          label="City"
          name="city"
          fullWidth
          margin="normal"
          value={form.city}
          onChange={handleChange}
          required
        />
        <TextField
          label="State"
          name="state"
          fullWidth
          margin="normal"
          value={form.state}
          onChange={handleChange}
          required
        />
        <TextField
          label="ZIP"
          name="zip"
          fullWidth
          margin="normal"
          value={form.zip}
          onChange={handleChange}
        />
        <TextField
          label="Latitude"
          name="latitude"
          type="number"
          fullWidth
          margin="normal"
          value={form.latitude}
          onChange={handleChange}
          required
        />
        <TextField
          label="Longitude"
          name="longitude"
          type="number"
          fullWidth
          margin="normal"
          value={form.longitude}
          onChange={handleChange}
          required
        />
        {message && <Typography color="error">{message}</Typography>}
        <Button type="submit" variant="contained" color="primary">
          Add Union
        </Button>
      </form>
    </Container>
  );
}

export default AddUnion;
