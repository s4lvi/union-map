// frontend/src/pages/Home.js
import React, { useState, useEffect, useContext } from "react";
import { Container, Box, Alert } from "@mui/material";
import MapView from "../components/MapView";
import SearchFilter from "../components/SearchFilter";
import UnionList from "../components/UnionList"; // Import the UnionList component
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { auth } = useContext(AuthContext);
  const [center, setCenter] = useState([37.0902, -95.7129]); // Center of USA
  const [zoomLevel, setZoomLevel] = useState(4);
  const [unions, setUnions] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // State to track if a search has been performed

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

  // Handler to be passed to SearchFilter to manage search state
  const handleSearch = (filteredUnions) => {
    setUnions(filteredUnions);
    setHasSearched(true);
  };

  return (
    <Container maxWidth="xl" sx={{ padding: "20px 0" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <SearchFilter setUnions={handleSearch} />
      </Box>

      {/* Conditionally render UnionList when a search has been performed */}
      {hasSearched && <UnionList unions={unions} />}

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
