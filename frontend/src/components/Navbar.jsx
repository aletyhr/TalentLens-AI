import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Get login information
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "User";

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);

  // Open profile menu
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close profile menu
  const closeMenu = () => {
    setAnchorEl(null);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    closeMenu();

    navigate("/login");

    // Refresh navbar after logout
    window.location.reload();
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1565c0" }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          TalentLens AI
        </Typography>

        {/* Home */}
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>

        {/* Logged In User */}
        {token ? (
          <>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>

            <Button color="inherit" component={Link} to="/history">
              History
            </Button>

            {/* Profile Section */}
            <Box
              onClick={openMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                ml: 3,
                gap: 1,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#ff9800",
                  width: 42,
                  height: 42,
                }}
              >
                {name && typeof name === "string"
                  ? name.charAt(0).toUpperCase()
                  : "U"}
              </Avatar>

              <Typography
                sx={{
                  fontWeight: "500",
                  maxWidth: 150,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </Typography>
            </Box>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  closeMenu();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  closeMenu();
                  navigate("/settings");
                }}
              >
                Settings
              </MenuItem>

              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>

            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
