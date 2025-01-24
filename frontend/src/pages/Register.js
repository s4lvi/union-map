// frontend/src/pages/Register.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api"; // Ensure this points to the correct backend URL
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Alert,
} from "@mui/material";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useContext(AuthContext); // Optional: Auto-login after registration
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = form;

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      const res = await api.post("/users/register", { username, password });
      setSuccess(res.data.message || "Registration successful.");

      // Optionally, auto-login the user after registration
      if (res.data.token) {
        login(res.data.token);
        navigate("/admin"); // Redirect to admin or desired page
      } else {
        // If not auto-logging in, redirect to login page
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
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
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          value={form.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          required
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          margin="normal"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
      <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="text" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Register;
