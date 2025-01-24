// frontend/src/pages/Home.js
import React, { useState, useEffect, useContext } from "react";
import { Container, Box, Typography, Alert } from "@mui/material";
import MapView from "../components/MapView";
import StateSelector from "../components/StateSelector";
import SearchFilter from "../components/SearchFilter";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { auth } = useContext(AuthContext);
  const [center, setCenter] = useState([37.0902, -95.7129]); // Center of USA
  const [zoomLevel, setZoomLevel] = useState(4);
  const [unions, setUnions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUnions();
  }, []);

  const fetchUnions = async () => {
    try {
      const res = await api.get("/unions");
      setUnions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch unions.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ padding: "20px 0" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <StateSelector setCenter={setCenter} setZoomLevel={setZoomLevel} />
        <SearchFilter setUnions={setUnions} />
      </Box>
      <MapView
        center={center}
        zoomLevel={zoomLevel}
        unions={unions}
        setUnions={setUnions}
      />
    </Container>
  );
}

export default Home;
