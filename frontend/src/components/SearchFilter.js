// frontend/src/components/SearchFilter.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import api from "../services/api";

function SearchFilter({ setUnions }) {
  const [filters, setFilters] = useState({
    zip: "",
    city: "",
    type: "",
    radius: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const { zip, city, type, radius, latitude, longitude } = filters;
    const params = {};

    if (zip) params.zip = zip;
    if (city) params.city = city;
    if (type) params.type = type;
    if (radius && latitude && longitude) {
      params.radius = radius;
      params.latitude = latitude;
      params.longitude = longitude;
    }

    try {
      const res = await api.get("/unions", { params });
      setUnions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="ZIP Code"
          name="zip"
          value={filters.zip}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="City"
          name="city"
          value={filters.city}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth>
          <InputLabel id="type-label">Union Type</InputLabel>
          <Select
            labelId="type-label"
            name="type"
            value={filters.type}
            label="Union Type"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Type1">Type1</MenuItem>
            <MenuItem value="Type2">Type2</MenuItem>
            {/* Add more types as needed */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="Radius (miles)"
          name="radius"
          type="number"
          value={filters.radius}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="Latitude"
          name="latitude"
          type="number"
          value={filters.latitude}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="Longitude"
          name="longitude"
          type="number"
          value={filters.longitude}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={12} md={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          fullWidth
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
}

export default SearchFilter;
