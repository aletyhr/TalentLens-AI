import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  AutoAwesome,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import API from "../services/api";


function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleLogin =
    async (event) => {

      event.preventDefault();

      setError("");

      if (!email.trim()) {

        setError(
          "Please enter your email address."
        );

        return;

      }


      if (!password) {

        setError(
          "Please enter your password."
        );

        return;

      }


      setLoading(true);


      try {

        const response =
          await API.post(
            "/login",
            {
              email:
                email.trim(),

              password:
                password,
            }
          );


        const token =
          response.data?.token;

        const name =
          response.data?.name ||
          "Student";


        if (!token) {

          setError(
            "Login succeeded, but no authentication token was received."
          );

          return;

        }


        /*
         * Store authentication information.
         */

        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "name",
          name
        );


        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );


      } catch (err) {

        console.error(
          "Login error:",
          err.response?.data ||
          err.message
        );


        setError(
          err.response?.data?.message ||
          "Invalid email or password."
        );


      } finally {

        setLoading(false);

      }

    };


  return (

    <Box
      sx={{
        minHeight:
          "calc(100vh - 70px)",

        display:
          "flex",

        alignItems:
          "center",

        py: {
          xs: 5,
          md: 8,
        },

        position:
          "relative",

        overflow:
          "hidden",

        background:
          "linear-gradient(135deg,#050816,#0b1026,#111b3d)",
      }}
    >

      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <Box
        sx={{
          position:
            "absolute",

          width: 500,

          height: 500,

          borderRadius:
            "50%",

          background:
            "radial-gradient(circle,rgba(66,133,255,.28),transparent 70%)",

          top: -180,

          right: -150,

          filter:
            "blur(20px)",
        }}
      />


      <Box
        sx={{
          position:
            "absolute",

          width: 500,

          height: 500,

          borderRadius:
            "50%",

          background:
            "radial-gradient(circle,rgba(124,77,255,.25),transparent 70%)",

          bottom: -220,

          left: -160,

          filter:
            "blur(20px)",
        }}
      />


      {/* =====================================================
          GRID
      ===================================================== */}

      <Box
        sx={{
          position:
            "absolute",

          inset: 0,

          opacity: 0.08,

          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)",

          backgroundSize:
            "50px 50px",
        }}
      />


      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <Container
        maxWidth="sm"
        sx={{
          position:
            "relative",

          zIndex: 2,
        }}
      >

        <Card
          elevation={0}
          sx={{
            borderRadius:
              5,

            background:
              "linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.045))",

            border:
              "1px solid rgba(255,255,255,.14)",

            backdropFilter:
              "blur(24px)",

            boxShadow:
              "0 35px 90px rgba(0,0,0,.45)",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                sm: 5,
              },
            }}
          >

            {/* =================================================
                ICON
            ================================================= */}

            <Box
              sx={{
                display:
                  "flex",

                justifyContent:
                  "center",

                mb: 3,
              }}
            >

              <Box
                sx={{
                  width: 64,

                  height: 64,

                  borderRadius:
                    3,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background:
                    "linear-gradient(135deg,#2979ff,#7c4dff)",

                  boxShadow:
                    "0 12px 35px rgba(77,81,255,.35)",
                }}
              >

                <AutoAwesome
                  sx={{
                    fontSize:
                      32,

                    color:
                      "white",
                  }}
                />

              </Box>

            </Box>


            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
              variant="h3"
              align="center"
              sx={{
                color:
                  "white",

                fontWeight:
                  950,

                letterSpacing:
                  "-1.5px",
              }}
            >
              Welcome back
            </Typography>


            <Typography
              align="center"
              sx={{
                color:
                  "#9ca7c1",

                mt:
                  1,

                mb:
                  4,
              }}
            >
              Continue your career journey
              with TalentLens AI.
            </Typography>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <Alert
                severity="error"
                sx={{
                  mb: 2,

                  borderRadius:
                    3,
                }}
              >
                {error}
              </Alert>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Box
              component="form"
              onSubmit={
                handleLogin
              }
            >

              <TextField
                fullWidth
                label="Email Address"
                placeholder="student@example.com"
                type="email"
                value={
                  email
                }
                onChange={
                  (event) =>
                    setEmail(
                      event.target.value
                    )
                }
                margin="normal"
                required
                InputLabelProps={{
                  sx: {
                    color:
                      "#9ca7c1",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      color:
                        "white",

                      borderRadius:
                        3,

                      background:
                        "rgba(255,255,255,.045)",

                      "& fieldset":
                        {
                          borderColor:
                            "rgba(255,255,255,.15)",
                        },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "rgba(140,160,255,.5)",
                        },

                      "&.Mui-focused fieldset":
                        {
                          borderColor:
                            "#7187ff",
                        },
                    },
                }}
              />


              <TextField
                fullWidth
                label="Password"
                placeholder="Enter your password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  password
                }
                onChange={
                  (event) =>
                    setPassword(
                      event.target.value
                    )
                }
                margin="normal"
                required
                InputLabelProps={{
                  sx: {
                    color:
                      "#9ca7c1",
                  },
                }}
                InputProps={{
                  endAdornment: (

                    <InputAdornment
                      position="end"
                    >

                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        edge="end"
                        sx={{
                          color:
                            "#9ca7c1",
                        }}
                      >

                        {showPassword
                          ? <VisibilityOff />
                          : <Visibility />}

                      </IconButton>

                    </InputAdornment>

                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      color:
                        "white",

                      borderRadius:
                        3,

                      background:
                        "rgba(255,255,255,.045)",

                      "& fieldset":
                        {
                          borderColor:
                            "rgba(255,255,255,.15)",
                        },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "rgba(140,160,255,.5)",
                        },

                      "&.Mui-focused fieldset":
                        {
                          borderColor:
                            "#7187ff",
                        },
                    },
                }}
              />


              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                endIcon={
                  <ArrowForward />
                }
                disabled={
                  loading
                }
                sx={{
                  mt:
                    3,

                  py:
                    1.7,

                  borderRadius:
                    3,

                  fontWeight:
                    900,

                  fontSize:
                    "1rem",

                  textTransform:
                    "none",

                  background:
                    "linear-gradient(135deg,#2979ff,#7c4dff)",

                  boxShadow:
                    "0 14px 40px rgba(76,79,255,.3)",

                  transition:
                    "all .3s ease",

                  "&:hover":
                    {
                      transform:
                        "translateY(-3px)",

                      boxShadow:
                        "0 20px 50px rgba(76,79,255,.45)",
                    },
                }}
              >

                {loading
                  ? "Signing In..."
                  : "Login to TalentLens"}

              </Button>

            </Box>


            {/* =================================================
                DIVIDER
            ================================================= */}

            <Divider
              sx={{
                my:
                  4,

                borderColor:
                  "rgba(255,255,255,.1)",
              }}
            />


            {/* =================================================
                REGISTER
            ================================================= */}

            <Typography
              align="center"
              sx={{
                color:
                  "#8994ae",
              }}
            >
              New to TalentLens AI?
            </Typography>


            <Button
              component={
                Link
              }
              to="/register"
              fullWidth
              variant="outlined"
              sx={{
                mt:
                  1.5,

                py:
                  1.4,

                borderRadius:
                  3,

                color:
                  "white",

                borderColor:
                  "rgba(255,255,255,.2)",

                fontWeight:
                  800,

                textTransform:
                  "none",

                "&:hover":
                  {
                    background:
                      "rgba(255,255,255,.06)",

                    borderColor:
                      "#879aff",
                  },
              }}
            >
              Create Student Account
            </Button>


            {/* =================================================
                TRUST MESSAGE
            ================================================= */}

            <Typography
              align="center"
              variant="caption"
              sx={{
                display:
                  "block",

                color:
                  "#68738e",

                mt:
                  3,

                lineHeight:
                  1.6,
              }}
            >
              Your resume analysis, job matches
              and interview history are available
              securely after login.
            </Typography>

          </CardContent>

        </Card>

      </Container>

    </Box>
  );
}


export default Login;