import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import { clearSessionData } from "../services/api";


function Navbar() {

  const navigate = useNavigate();

  const location =
    useLocation();

  const [
    anchorEl,
    setAnchorEl
  ] = useState(null);


  // =====================================================
  // CURRENT USER
  // =====================================================

  const token =
    localStorage.getItem("token");

  const userName =
    localStorage.getItem("name") ||
    "User";

  const firstLetter =
    userName
      .charAt(0)
      .toUpperCase();


  // =====================================================
  // MENU
  // =====================================================

  const handleMenuOpen =
    (event) => {

      setAnchorEl(
        event.currentTarget
      );

    };


  const handleMenuClose =
    () => {

      setAnchorEl(null);

    };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout =
    () => {

      /*
       * Remove ALL account-specific
       * session information.
       */

      clearSessionData();


      /*
       * Make sure the username
       * is also removed.
       */

      localStorage.removeItem(
        "name"
      );


      /*
       * Close profile menu.
       */

      setAnchorEl(null);


      /*
       * Go to login and prevent
       * returning to the previous
       * authenticated page using
       * browser history.
       */

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    };


  // =====================================================
  // ACTIVE PAGE
  // =====================================================

  const isActive =
    (path) =>
      location.pathname === path;


  // =====================================================
  // UI
  // =====================================================

  return (

    <AppBar
      position="sticky"
      elevation={8}
      sx={{
        background:
          "linear-gradient(90deg,#1565c0,#1976d2,#512da8)",
      }}
    >

      <Toolbar
        sx={{
          minHeight: 70,
          px: {
            xs: 2,
            md: 4,
          },
        }}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <Typography
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "white",
            textDecoration: "none",
            fontWeight: 900,
            fontSize: {
              xs: "1.3rem",
              md: "1.6rem",
            },
            letterSpacing: "-0.5px",
          }}
        >
          TalentLens AI
        </Typography>


        {/* =================================================
            LOGGED-IN NAVIGATION
        ================================================= */}

        {token && (

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: {
                xs: 0.5,
                md: 1,
              },
            }}
          >

            <Button
              component={Link}
              to="/"
              sx={{
                color: "white",
                fontWeight:
                  isActive("/")
                    ? 900
                    : 600,
                display: {
                  xs: "none",
                  sm: "inline-flex",
                },
              }}
            >
              HOME
            </Button>


            <Button
              component={Link}
              to="/dashboard"
              sx={{
                color: "white",
                fontWeight:
                  isActive(
                    "/dashboard"
                  )
                    ? 900
                    : 600,
              }}
            >
              DASHBOARD
            </Button>


            <Button
              component={Link}
              to="/history"
              sx={{
                color: "white",
                fontWeight:
                  isActive(
                    "/history"
                  )
                    ? 900
                    : 600,
                display: {
                  xs: "none",
                  sm: "inline-flex",
                },
              }}
            >
              HISTORY
            </Button>


            {/* =================================================
                PROFILE AVATAR
            ================================================= */}

            <Avatar
              onClick={
                handleMenuOpen
              }
              sx={{
                ml: 1,
                width: 46,
                height: 46,
                bgcolor: "#ff9800",
                color: "white",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow:
                  "0 4px 14px rgba(0,0,0,.25)",
                transition:
                  "all .2s ease",

                "&:hover": {
                  transform:
                    "scale(1.08)",
                  boxShadow:
                    "0 6px 20px rgba(0,0,0,.3)",
                },
              }}
            >
              {firstLetter}
            </Avatar>

          </Box>

        )}


        {/* =================================================
            LOGGED-OUT NAVIGATION
        ================================================= */}

        {!token && (

          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >

            <Button
              component={Link}
              to="/login"
              sx={{
                color: "white",
              }}
            >
              LOGIN
            </Button>


            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "#1565c0",
                fontWeight: 700,

                "&:hover": {
                  bgcolor: "#f2f2f2",
                },
              }}
            >
              REGISTER
            </Button>

          </Box>

        )}

      </Toolbar>


      {/* =====================================================
          PROFILE MENU
      ===================================================== */}

      <Menu
        anchorEl={anchorEl}
        open={
          Boolean(anchorEl)
        }
        onClose={
          handleMenuClose
        }
        PaperProps={{
          elevation: 8,

          sx: {
            mt: 1,
            minWidth: 210,
            borderRadius: 3,
          },
        }}
      >

        <MenuItem
          disabled
          sx={{
            fontWeight: 700,
          }}
        >
          {userName}
        </MenuItem>


        <Divider />


        <MenuItem
          onClick={() => {

            handleMenuClose();

            navigate(
              "/profile"
            );

          }}
        >
          Profile
        </MenuItem>


        <MenuItem
          onClick={() => {

            handleMenuClose();

            navigate(
              "/settings"
            );

          }}
        >
          Settings
        </MenuItem>


        <Divider />


        {/* =================================================
            IMPORTANT: LOGOUT
        ================================================= */}

        <MenuItem
          onClick={
            handleLogout
          }
          sx={{
            color:
              "error.main",
            fontWeight: 700,
          }}
        >
          Logout
        </MenuItem>

      </Menu>

    </AppBar>

  );

}


export default Navbar;