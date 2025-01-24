// frontend/src/pages/Admin.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";

function Admin() {
  const { auth } = useContext(AuthContext);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this union?")) return;

    try {
      await api.delete(`/unions/${id}`);
      setUnions(unions.filter((union) => union._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete union.");
    }
  };

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  if (auth.user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Union Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>ZIP</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unions.map((union) => (
              <TableRow key={union._id}>
                <TableCell>{union.name}</TableCell>
                <TableCell>{union.type}</TableCell>
                <TableCell>{union.city}</TableCell>
                <TableCell>{union.state}</TableCell>
                <TableCell>{union.zip}</TableCell>
                <TableCell>
                  {/* Placeholder for Edit Functionality */}
                  <IconButton color="primary" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  {/* Delete Button */}
                  <IconButton
                    color="secondary"
                    aria-label="delete"
                    onClick={() => handleDelete(union._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {unions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No unions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Admin;
