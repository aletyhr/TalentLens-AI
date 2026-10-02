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


function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

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

  const [success, setSuccess] =
    useState("");


  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      // ---------------------------------------------------
      // NAME
      // ---------------------------------------------------

      if (!name.trim()) {

        setError(
          "Please enter your name."
        );

        return;
      }


      // ---------------------------------------------------
      // EMAIL
      // ---------------------------------------------------

      if (!email.trim()) {

        setError(
          "Please enter your email."
        );

        return;
      }


      // ---------------------------------------------------
      // PASSWORD LENGTH
      // ---------------------------------------------------

      if (password.length < 8) {

        setError(
          "Password must be at least 8 characters long."
        );

        return;
      }


      if (password.length > 128) {

        setError(
          "Password must be 128 characters or less."
        );

        return;
      }


      // ---------------------------------------------------
      // PASSWORD UPPERCASE
      // ---------------------------------------------------

      if (!/[A-Z]/.test(password)) {

        setError(
          "Password must contain at least one uppercase letter."
        );

        return;
      }


      // ---------------------------------------------------
      // PASSWORD LOWERCASE
      // ---------------------------------------------------

      if (!/[a-z]/.test(password)) {

        setError(
          "Password must contain at least one lowercase letter."
        );

        return;
      }


      // ---------------------------------------------------
      // PASSWORD NUMBER
      // ---------------------------------------------------

      if (!/[0-9]/.test(password)) {

        setError(
          "Password must contain at least one number."
        );

        return;
      }


      // ---------------------------------------------------
      // PASSWORD SPECIAL CHARACTER
      // ---------------------------------------------------

      if (!/[^A-Za-z0-9]/.test(password)) {

        setError(
          "Password must contain at least one special character."
        );

        return;
      }


      // ---------------------------------------------------
      // START REGISTRATION
      // ---------------------------------------------------

      setLoading(true);


      try {

        const response =
          await API.post(
            "/register",
            {
              name: name.trim(),
              email: email.trim(),
              password,
            }
          );


        setSuccess(
          response.data?.message ||
          "Registration successful."
        );


        setTimeout(() => {

          navigate("/login");

        }, 1200);


      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Unable to create your account."
        );

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // UI
  // =====================================================

  return (

    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        py: {
          xs: 5,
          md: 8,
        },
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg,#050816,#0b1026,#111b3d)",
      }}
    >

      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(66,133,255,.28),transparent 70%)",
          top: -180,
          left: -150,
          filter: "blur(20px)",
        }}
      />


      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(124,77,255,.25),transparent 70%)",
          bottom: -220,
          right: -160,
          filter: "blur(20px)",
        }}
      />


      {/* =================================================
          GRID
      ================================================= */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />


      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 2,
        }}
      >

        <Card
          elevation={0}
          sx={{
            borderRadius: 5,
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
                LOGO
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
              }}
            >

              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg,#2979ff,#7c4dff)",
                  boxShadow:
                    "0 12px 35px rgba(77,81,255,.35)",
                }}
              >

                <AutoAwesome
                  sx={{
                    fontSize: 32,
                    color: "white",
                  }}
                />

              </Box>

            </Box>


            <Typography
              variant="h3"
              align="center"
              sx={{
                color: "white",
                fontWeight: 950,
                letterSpacing: "-1.5px",
              }}
            >
              Create your account
            </Typography>


            <Typography
              align="center"
              sx={{
                color: "#9ca7c1",
                mt: 1,
                mb: 4,
              }}
            >
              Start building a stronger career profile
              with TalentLens AI.
            </Typography>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 3,
                }}
              >
                {error}
              </Alert>

            )}


            {success && (

              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 3,
                }}
              >
                {success}
              </Alert>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Box
              component="form"
              onSubmit={handleRegister}
            >

              {/* =================================================
                  NAME
              ================================================= */}

              <TextField
                fullWidth
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                margin="normal"
                required
                InputLabelProps={{
                  sx: {
                    color: "#9ca7c1",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: 3,
                    background:
                      "rgba(255,255,255,.045)",

                    "& fieldset": {
                      borderColor:
                        "rgba(255,255,255,.15)",
                    },

                    "&:hover fieldset": {
                      borderColor:
                        "rgba(140,160,255,.5)",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor:
                        "#7187ff",
                    },
                  },
                }}
              />


              {/* =================================================
                  EMAIL
              ================================================= */}

              <TextField
                fullWidth
                label="Email Address"
                placeholder="student@example.com"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                margin="normal"
                required
                InputLabelProps={{
                  sx: {
                    color: "#9ca7c1",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: 3,
                    background:
                      "rgba(255,255,255,.045)",

                    "& fieldset": {
                      borderColor:
                        "rgba(255,255,255,.15)",
                    },

                    "&:hover fieldset": {
                      borderColor:
                        "rgba(140,160,255,.5)",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor:
                        "#7187ff",
                    },
                  },
                }}
              />


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <TextField
                fullWidth
                label="Password"
                placeholder="Create a secure password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                margin="normal"
                required
                InputLabelProps={{
                  sx: {
                    color: "#9ca7c1",
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
                            (previous) =>
                              !previous
                          )
                        }
                        edge="end"
                        sx={{
                          color: "#9ca7c1",
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
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: 3,
                    background:
                      "rgba(255,255,255,.045)",

                    "& fieldset": {
                      borderColor:
                        "rgba(255,255,255,.15)",
                    },

                    "&:hover fieldset": {
                      borderColor:
                        "rgba(140,160,255,.5)",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor:
                        "#7187ff",
                    },
                  },
                }}
              />


              {/* =================================================
                  PASSWORD REQUIREMENTS
              ================================================= */}

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#77829d",
                  mt: 1,
                  lineHeight: 1.6,
                }}
              >
                Password must be 8–128 characters and include
                uppercase, lowercase, number and special character.
              </Typography>


              {/* =================================================
                  REGISTER BUTTON
              ================================================= */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.7,
                  borderRadius: 3,
                  fontWeight: 900,
                  fontSize: "1rem",
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg,#2979ff,#7c4dff)",
                  boxShadow:
                    "0 14px 40px rgba(76,79,255,.3)",
                  transition:
                    "all .3s ease",

                  "&:hover": {
                    transform:
                      "translateY(-3px)",
                    boxShadow:
                      "0 20px 50px rgba(76,79,255,.45)",
                  },
                }}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Student Account"}
              </Button>

            </Box>


            <Divider
              sx={{
                my: 4,
                borderColor:
                  "rgba(255,255,255,.1)",
              }}
            />


            {/* =================================================
                LOGIN
            ================================================= */}

            <Typography
              align="center"
              sx={{
                color: "#8994ae",
              }}
            >
              Already have an account?
            </Typography>


            <Button
              component={Link}
              to="/login"
              fullWidth
              variant="outlined"
              sx={{
                mt: 1.5,
                py: 1.4,
                borderRadius: 3,
                color: "white",
                borderColor:
                  "rgba(255,255,255,.2)",
                fontWeight: 800,
                textTransform: "none",

                "&:hover": {
                  background:
                    "rgba(255,255,255,.06)",
                  borderColor:
                    "#879aff",
                },
              }}
            >
              Login to TalentLens AI
            </Button>


            {/* =================================================
                SECURITY MESSAGE
            ================================================= */}

            <Typography
              align="center"
              variant="caption"
              sx={{
                display: "block",
                color: "#68738e",
                mt: 3,
                lineHeight: 1.6,
              }}
            >
              Your account lets you securely save
              your resume analysis, job matches
              and interview history.
            </Typography>

          </CardContent>

        </Card>

      </Container>

    </Box>

  );

}


export default Register;