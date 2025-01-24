// frontend/src/components/StateSelector.js
import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const states = [
  { name: "Alabama", lat: 32.806671, lng: -86.79113 },
  { name: "Alaska", lat: 61.370716, lng: -152.404419 },
  { name: "Arizona", lat: 33.729759, lng: -111.431221 },
  { name: "Arkansas", lat: 34.969704, lng: -92.373123 },
  { name: "California", lat: 36.116203, lng: -119.681564 },
  { name: "Colorado", lat: 39.059811, lng: -105.311104 },
  { name: "Connecticut", lat: 41.597782, lng: -72.755371 },
  { name: "Delaware", lat: 39.318523, lng: -75.507141 },
  { name: "Florida", lat: 27.766279, lng: -81.686783 },
  { name: "Georgia", lat: 33.040619, lng: -83.643074 },
  { name: "Hawaii", lat: 21.094318, lng: -157.498337 },
  { name: "Idaho", lat: 44.240459, lng: -114.478828 },
  { name: "Illinois", lat: 40.349457, lng: -88.986137 },
  { name: "Indiana", lat: 39.849426, lng: -86.258278 },
  { name: "Iowa", lat: 42.011539, lng: -93.210526 },
  { name: "Kansas", lat: 38.5266, lng: -96.726486 },
  { name: "Kentucky", lat: 37.66814, lng: -84.670067 },
  { name: "Louisiana", lat: 31.169546, lng: -91.867805 },
  { name: "Maine", lat: 44.693947, lng: -69.381927 },
  { name: "Maryland", lat: 39.063946, lng: -76.802101 },
  { name: "Massachusetts", lat: 42.230171, lng: -71.530106 },
  { name: "Michigan", lat: 43.326618, lng: -84.536095 },
  { name: "Minnesota", lat: 45.694454, lng: -93.900192 },
  { name: "Mississippi", lat: 32.741646, lng: -89.678696 },
  { name: "Missouri", lat: 38.456085, lng: -92.288368 },
  { name: "Montana", lat: 46.921925, lng: -110.454353 },
  { name: "Nebraska", lat: 41.12537, lng: -98.268082 },
  { name: "Nevada", lat: 38.313515, lng: -117.055374 },
  { name: "New Hampshire", lat: 43.452492, lng: -71.563896 },
  { name: "New Jersey", lat: 40.298904, lng: -74.521011 },
  { name: "New Mexico", lat: 34.840515, lng: -106.248482 },
  { name: "New York", lat: 42.165726, lng: -74.948051 },
  { name: "North Carolina", lat: 35.630066, lng: -79.806419 },
  { name: "North Dakota", lat: 47.528912, lng: -99.784012 },
  { name: "Ohio", lat: 40.388783, lng: -82.764915 },
  { name: "Oklahoma", lat: 35.565342, lng: -96.928917 },
  { name: "Oregon", lat: 44.572021, lng: -122.070938 },
  { name: "Pennsylvania", lat: 40.590752, lng: -77.209755 },
  { name: "Rhode Island", lat: 41.680893, lng: -71.51178 },
  { name: "South Carolina", lat: 33.856892, lng: -80.945007 },
  { name: "South Dakota", lat: 44.299782, lng: -99.438828 },
  { name: "Tennessee", lat: 35.747845, lng: -86.692345 },
  { name: "Texas", lat: 31.054487, lng: -97.563461 },
  { name: "Utah", lat: 40.150032, lng: -111.862434 },
  { name: "Vermont", lat: 44.045876, lng: -72.710686 },
  { name: "Virginia", lat: 37.769337, lng: -78.169968 },
  { name: "Washington", lat: 47.400902, lng: -121.490494 },
  { name: "West Virginia", lat: 38.491226, lng: -80.954453 },
  { name: "Wisconsin", lat: 44.268543, lng: -89.616508 },
  { name: "Wyoming", lat: 42.755966, lng: -107.30249 },
];

function StateSelector({ setCenter, setZoomLevel }) {
  const handleChange = (event) => {
    const selected = states.find((state) => state.name === event.target.value);
    if (selected) {
      setCenter([selected.lat, selected.lng]);
      setZoomLevel(7); // Adjust zoom level as needed
    }
  };

  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <InputLabel id="state-selector-label">Select a State</InputLabel>
      <Select
        labelId="state-selector-label"
        id="state-selector"
        onChange={handleChange}
        label="Select a State"
        defaultValue=""
      >
        <MenuItem value="" disabled>
          Select a State
        </MenuItem>
        {states.map((state) => (
          <MenuItem key={state.name} value={state.name}>
            {state.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default StateSelector;
