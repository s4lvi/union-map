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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";
import EditUnionModal from "../components/EditUnionModal";

// Define sector options
const sectorOptions = [
  "Manufacturing",
  "Agriculture",
  "Healthcare",
  "Service",
  "Other",
];

function Admin() {
  const { auth } = useContext(AuthContext);
  const [unions, setUnions] = useState([]);
  const [error, setError] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUnion, setSelectedUnion] = useState(null);
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
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setForm({
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
    setFormError("");
    setSuccessMessage("");
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
    setSuccessMessage("");
  };

  const handleAddUnion = async () => {
    const {
      name,
      type,
      sector,
      association,
      site,
      info,
      address,
      city,
      state,
      zip,
    } = form;

    // Basic validation
    if (!name || !type || !sector || !address || !city || !state || !zip) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      // Geocode the address to get lat/lng
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address + " " + city + " " + state + " " + zip
        )}&addressdetails=1&limit=1`
      );

      const geoData = await geoRes.json();

      if (geoData.length === 0) {
        setFormError("Unable to geocode the provided address.");
        return;
      }

      const { lat, lon } = geoData[0];

      // Prepare union data
      const unionData = {
        name,
        type,
        sector,
        association,
        site,
        info,
        address,
        city,
        state,
        zip,
        coordinates: [parseFloat(lon), parseFloat(lat)], // [longitude, latitude]
      };

      // Send to backend
      const res = await api.post("/unions", unionData);
      setSuccessMessage("Union added successfully.");
      setUnions([...unions, res.data]);

      // Close the dialog after a short delay
      setTimeout(() => {
        handleCloseAddDialog();
      }, 1500);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Failed to add union.");
    }
  };

  const handleOpenEditDialog = (union) => {
    setSelectedUnion(union);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUnion(null);
  };

  const handleUpdateUnion = (updatedUnion) => {
    setUnions(
      unions.map((union) =>
        union._id === updatedUnion._id ? updatedUnion : union
      )
    );
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddDialog}
        sx={{ mb: 2 }}
      >
        Add New Union
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Union Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell>Association</TableCell>
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
                <TableCell>{union.sector}</TableCell>
                <TableCell>{union.association}</TableCell>
                <TableCell>{union.city}</TableCell>
                <TableCell>{union.state}</TableCell>
                <TableCell>{union.zip}</TableCell>
                <TableCell>
                  {/* Edit Button */}
                  <IconButton
                    color="primary"
                    aria-label="edit"
                    onClick={() => handleOpenEditDialog(union)}
                  >
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
                <TableCell colSpan={8} align="center">
                  No unions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Union Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Union by Address</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Union Name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Type"
                name="type"
                fullWidth
                value={form.type}
                onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Website"
                name="site"
                fullWidth
                value={form.site}
                onChange={handleFormChange}
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
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                fullWidth
                value={form.address}
                onChange={handleFormChange}
                required
                helperText="Enter the full address to automatically set location."
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                name="city"
                fullWidth
                value={form.city}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="State"
                name="state"
                fullWidth
                value={form.state}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="ZIP Code"
                name="zip"
                fullWidth
                value={form.zip}
                onChange={handleFormChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUnion} variant="contained" color="primary">
            Add Union
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Union Modal */}
      <EditUnionModal
        open={openEditDialog}
        handleClose={handleCloseEditDialog}
        union={selectedUnion}
        onUpdate={handleUpdateUnion}
      />
    </Container>
  );
}

export default Admin;
