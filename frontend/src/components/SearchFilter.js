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

// Define sector options
const sectorOptions = [
  "Manufacturing",
  "Agriculture",
  "Healthcare",
  "Service",
  "Other",
];

const stateOptions = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
].sort();

function SearchFilter({ setUnions }) {
  const [filters, setFilters] = useState({
    zip: "",
    city: "",
    state: "Michigan",
    sector: "",
    designation_name: "",
    radius: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const { zip, city, state, sector, designation_name, radius } = filters;
    const params = {};

    if (zip) params.zip = zip;
    if (city) params.city = city;
    if (state) params.state = state;
    if (sector) params.sector = sector;
    if (designation_name) params.designation_name = designation_name;
    if (radius) {
      params.radius = radius;
    }

    try {
      const res = await api.get("/unions", { params });
      setUnions(res.data);
    } catch (err) {
      console.error(err);
      // Optionally, handle errors (e.g., display a message)
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth>
          <InputLabel id="state-filter-label">State</InputLabel>
          <Select
            labelId="state-filter-label"
            name="state"
            value={filters.state}
            label="State"
            onChange={handleChange}
          >
            {stateOptions.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth>
          <InputLabel id="sector-filter-label">Sector</InputLabel>
          <Select
            labelId="sector-filter-label"
            name="sector"
            value={filters.sector}
            label="Sector"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {sectorOptions.map((sector) => (
              <MenuItem key={sector} value={sector}>
                {sector}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="Type"
          name="designation_name"
          value={filters.designation_name}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3} md={1}>
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
        <TextField
          label="Radius (miles)"
          name="radius"
          type="number"
          value={filters.radius}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={6} md={1}>
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
