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

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "User";

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    closeMenu();

    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1565c0" }}>
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          TalentLens AI
        </Typography>

        <Button color="inherit" component={Link} to="/">
          Home
        </Button>

        {token ? (
          <>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>

            <Button color="inherit" component={Link} to="/history">
              History
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                ml: 3,
              }}
              onClick={openMenu}
            >
              <Avatar
                sx={{
                  bgcolor: "#ff9800",
                  mr: 1,
                }}
              >
                {name.charAt(0).toUpperCase()}
              </Avatar>

              <Typography>{name}</Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
            >
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  closeMenu();
                }}
              >
                Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate("/settings");
                  closeMenu();
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
