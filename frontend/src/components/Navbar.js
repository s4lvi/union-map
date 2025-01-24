// frontend/src/components/Navbar.js
import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo192.png"; // Ensure the path is correct

function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{ boxShadow: "none", bgcolor: "#cc2222" }}
    >
      <Toolbar disableGutters>
        {/* Logo Container */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            height: "100%", // Ensure the Box fills the Toolbar height
            px: 0, // Optional: Horizontal padding if needed
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="ACP UnionDB Logo"
            sx={{
              height: "100%", // Make the logo fill the Toolbar height
              maxHeight: 64, // Ensure it doesn't exceed Toolbar's default height
              width: "auto", // Maintain aspect ratio
            }}
          />
        </Box>

        {/* Site Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            ml: 2, // Left margin to separate from the logo
            fontWeight: "bold",
            color: "#fff", // White text for contrast
          }}
        >
          UnionDB
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {!auth.user && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
          {auth.user && (
            <>
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
