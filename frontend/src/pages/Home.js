import {
  Box,
  Button,
  Container,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import {
  ArrowForward,
  AutoAwesome,
  Analytics,
  Psychology,
  WorkOutline,
  School,
  Security,
} from "@mui/icons-material";

import { Link } from "react-router-dom";


function Home() {

  const isLoggedIn = Boolean(
    localStorage.getItem("token")
  );

  const features = [
    {
      icon: <Analytics />,
      title: "AI Resume Analysis",
      text: "Understand your resume score, skills, experience and improvement areas.",
    },
    {
      icon: <WorkOutline />,
      title: "Job Match",
      text: "Compare your resume with a job description and identify missing skills.",
    },
    {
      icon: <Psychology />,
      title: "AI Mock Interview",
      text: "Practice realistic interviews based on the skills and experience in your resume.",
    },
    {
      icon: <School />,
      title: "Career Direction",
      text: "See which career direction your current resume represents.",
    },
  ];


  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        background:
          "linear-gradient(135deg,#050816 0%,#0b1026 45%,#111b3d 100%)",
        color: "white",
      }}
    >

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <Box
        sx={{
          position: "relative",
          minHeight: {
            xs: "auto",
            md: "720px",
          },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          pt: {
            xs: 8,
            md: 4,
          },
          pb: {
            xs: 8,
            md: 10,
          },
        }}
      >

        {/* 3D BACKGROUND GLOW */}

        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(66,133,255,.35),transparent 70%)",
            top: -180,
            left: -120,
            filter: "blur(10px)",
            animation:
              "floatOne 8s ease-in-out infinite",
            "@keyframes floatOne": {
              "0%,100%": {
                transform: "translate(0,0)",
              },
              "50%": {
                transform: "translate(40px,30px)",
              },
            },
          }}
        />


        <Box
          sx={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(124,77,255,.30),transparent 68%)",
            right: -250,
            top: 40,
            filter: "blur(10px)",
            animation:
              "floatTwo 10s ease-in-out infinite",
            "@keyframes floatTwo": {
              "0%,100%": {
                transform: "translate(0,0)",
              },
              "50%": {
                transform: "translate(-50px,40px)",
              },
            },
          }}
        />


        {/* GRID */}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            maskImage:
              "linear-gradient(to bottom,black,transparent)",
          }}
        />


        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1.05fr .95fr",
              },
              gap: {
                xs: 6,
                md: 8,
              },
              alignItems: "center",
            }}
          >

            {/* LEFT */}

            <Box>

              <Chip
                icon={<AutoAwesome />}
                label="AI-Powered Student Career Platform"
                sx={{
                  mb: 3,
                  px: 1,
                  py: 2.5,
                  borderRadius: 5,
                  color: "#cdd8ff",
                  background:
                    "rgba(92,110,255,.12)",
                  border:
                    "1px solid rgba(130,150,255,.3)",
                  backdropFilter:
                    "blur(12px)",
                  fontWeight: 700,
                }}
              />


              <Typography
                component="h1"
                sx={{
                  fontSize: {
                    xs: "3rem",
                    sm: "4rem",
                    md: "5.2rem",
                  },
                  lineHeight: 0.98,
                  fontWeight: 950,
                  letterSpacing: "-4px",
                  mb: 3,
                  background:
                    "linear-gradient(90deg,#ffffff,#b9c8ff,#8ea8ff)",
                  WebkitBackgroundClip:
                    "text",
                  WebkitTextFillColor:
                    "transparent",
                }}
              >
                Your Resume.
                <br />
                Your Future.
              </Typography>


              <Typography
                sx={{
                  maxWidth: 650,
                  fontSize: {
                    xs: "1.05rem",
                    md: "1.25rem",
                  },
                  lineHeight: 1.8,
                  color: "#b8c1d9",
                  mb: 4,
                }}
              >
                TalentLens AI helps students understand
                their resume, discover career direction,
                match themselves with opportunities and
                practice AI-powered interviews.
              </Typography>


              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >

                <Button
                  component={Link}
                  to={
                    isLoggedIn
                      ? "/dashboard"
                      : "/register"
                  }
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.7,
                    borderRadius: 3,
                    fontSize: "1rem",
                    fontWeight: 900,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg,#2979ff,#7c4dff)",
                    boxShadow:
                      "0 15px 45px rgba(71,86,255,.35)",
                    transition:
                      "all .3s ease",
                    "&:hover": {
                      transform:
                        "translateY(-4px) scale(1.02)",
                      boxShadow:
                        "0 20px 55px rgba(71,86,255,.5)",
                      background:
                        "linear-gradient(135deg,#448aff,#8c63ff)",
                    },
                  }}
                >
                  {isLoggedIn
                    ? "Go to Dashboard"
                    : "Start Your Career Journey"}
                </Button>


                <Button
                  component={Link}
                  to={
                    isLoggedIn
                      ? "/dashboard"
                      : "/login"
                  }
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.7,
                    borderRadius: 3,
                    color: "white",
                    borderColor:
                      "rgba(255,255,255,.25)",
                    fontWeight: 800,
                    textTransform: "none",
                    backdropFilter:
                      "blur(10px)",
                    transition:
                      "all .3s ease",
                    "&:hover": {
                      borderColor:
                        "#9fb4ff",
                      background:
                        "rgba(255,255,255,.07)",
                      transform:
                        "translateY(-3px)",
                    },
                  }}
                >
                  {isLoggedIn
                    ? "Dashboard"
                    : "Login"}
                </Button>

              </Stack>


              <Stack
                direction="row"
                spacing={3}
                sx={{
                  mt: 4,
                  flexWrap: "wrap",
                  rowGap: 1,
                }}
              >

                <Typography
                  variant="body2"
                  sx={{
                    color: "#8f9ab5",
                  }}
                >
                  ✓ Student focused
                </Typography>


                <Typography
                  variant="body2"
                  sx={{
                    color: "#8f9ab5",
                  }}
                >
                  ✓ AI powered
                </Typography>


                <Typography
                  variant="body2"
                  sx={{
                    color: "#8f9ab5",
                  }}
                >
                  ✓ Resume based
                </Typography>

              </Stack>

            </Box>


            {/* RIGHT — 3D DASHBOARD CARD */}

            <Box
              sx={{
                position: "relative",
                perspective: "1200px",
                display: "flex",
                justifyContent: "center",
              }}
            >

              {/* BACK GLOW */}

              <Box
                sx={{
                  position: "absolute",
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle,rgba(91,99,255,.5),transparent 65%)",
                  filter: "blur(30px)",
                }}
              />


              {/* MAIN 3D CARD */}

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: 470,
                  },
                  maxWidth: 470,
                  position: "relative",
                  transform:
                    "rotateY(-8deg) rotateX(5deg)",
                  transition:
                    "transform .5s ease",
                  "&:hover": {
                    transform:
                      "rotateY(0deg) rotateX(0deg) translateY(-8px)",
                  },
                }}
              >

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 5,
                    background:
                      "linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.04))",
                    border:
                      "1px solid rgba(255,255,255,.18)",
                    boxShadow:
                      "0 40px 100px rgba(0,0,0,.45)",
                    backdropFilter:
                      "blur(20px)",
                  }}
                >

                  {/* TOP BAR */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1,
                      pb: 2,
                    }}
                  >

                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#ff5f57",
                      }}
                    />

                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#febc2e",
                      }}
                    />

                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#28c840",
                      }}
                    />

                  </Box>


                  {/* DASHBOARD */}

                  <Box
                    sx={{
                      borderRadius: 4,
                      p: 3,
                      background:
                        "rgba(7,12,30,.9)",
                    }}
                  >

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#7784a8",
                      }}
                    >
                      RESUME ANALYSIS
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: 30,
                        fontWeight: 900,
                        mt: 0.5,
                      }}
                    >
                      TalentLens AI
                    </Typography>


                    {/* SCORE */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        mt: 3,
                      }}
                    >

                      <Box
                        sx={{
                          width: 105,
                          height: 105,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "conic-gradient(#6c63ff 0 82%,#242b49 82% 100%)",
                          position: "relative",
                        }}
                      >

                        <Box
                          sx={{
                            width: 82,
                            height: 82,
                            borderRadius: "50%",
                            background:
                              "#080d20",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >

                          <Typography
                            sx={{
                              fontWeight: 950,
                              fontSize: 24,
                            }}
                          >
                            82
                          </Typography>

                        </Box>

                      </Box>


                      <Box>

                        <Typography
                          fontWeight={800}
                        >
                          Resume Score
                        </Typography>


                        <Typography
                          variant="body2"
                          sx={{
                            color: "#8d98b5",
                            mt: .5,
                          }}
                        >
                          Strong career profile
                        </Typography>

                      </Box>

                    </Box>


                    {/* MINI CARDS */}

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap: 1.5,
                        mt: 3,
                      }}
                    >

                      {[
                        [
                          "Skills",
                          "18",
                        ],
                        [
                          "ATS Match",
                          "91%",
                        ],
                        [
                          "Experience",
                          "Good",
                        ],
                        [
                          "Career",
                          "Analyst",
                        ],
                      ].map(
                        (item) => (

                          <Box
                            key={item[0]}
                            sx={{
                              p: 1.8,
                              borderRadius: 3,
                              background:
                                "rgba(255,255,255,.055)",
                              border:
                                "1px solid rgba(255,255,255,.07)",
                            }}
                          >

                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  "#7884a5",
                              }}
                            >
                              {item[0]}
                            </Typography>


                            <Typography
                              fontWeight={900}
                              sx={{
                                mt: .4,
                              }}
                            >
                              {item[1]}
                            </Typography>

                          </Box>

                        )
                      )}

                    </Box>


                    {/* INSIGHT */}

                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg,rgba(73,92,255,.18),rgba(143,76,255,.12))",
                        border:
                          "1px solid rgba(125,136,255,.2)",
                      }}
                    >

                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            "#9faaff",
                        }}
                      >
                        AI INSIGHT
                      </Typography>


                      <Typography
                        variant="body2"
                        sx={{
                          mt: .5,
                          color:
                            "#c5cce0",
                        }}
                      >
                        Add stronger project achievements
                        and measurable results to improve
                        your resume impact.
                      </Typography>

                    </Box>

                  </Box>

                </Box>

              </Box>

            </Box>

          </Box>

        </Container>

      </Box>


      {/* =====================================================
          TRUST / INTRO
      ===================================================== */}

      <Box
        sx={{
          py: 5,
          borderTop:
            "1px solid rgba(255,255,255,.07)",
          borderBottom:
            "1px solid rgba(255,255,255,.07)",
          background:
            "rgba(255,255,255,.015)",
        }}
      >

        <Container
          maxWidth="lg"
        >

          <Typography
            align="center"
            sx={{
              color: "#8f9ab5",
              fontSize: {
                xs: ".9rem",
                md: "1rem",
              },
            }}
          >
            Built to help students move from
            <strong
              style={{
                color: "#cbd5ff",
                margin: "0 5px",
              }}
            >
              resume preparation
            </strong>
            to
            <strong
              style={{
                color: "#cbd5ff",
                margin: "0 5px",
              }}
            >
              interview confidence
            </strong>
          </Typography>

        </Container>

      </Box>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 8,
            md: 12,
          },
          background:
            "#070b1b",
        }}
      >

        <Container
          maxWidth="lg"
        >

          <Box
            sx={{
              textAlign: "center",
              mb: 7,
            }}
          >

            <Chip
              label="WHAT TALENTLENS DOES"
              sx={{
                mb: 2,
                color: "#aebaff",
                background:
                  "rgba(94,110,255,.1)",
                border:
                  "1px solid rgba(120,140,255,.2)",
                fontWeight: 800,
              }}
            />


            <Typography
              variant="h2"
              sx={{
                fontWeight: 950,
                fontSize: {
                  xs: "2.2rem",
                  md: "3.5rem",
                },
                letterSpacing: "-2px",
              }}
            >
              Everything you need to
              <br />
              prepare for your career.
            </Typography>


            <Typography
              sx={{
                maxWidth: 650,
                mx: "auto",
                mt: 2,
                color: "#8d98b5",
                lineHeight: 1.8,
              }}
            >
              One platform to understand your
              resume, identify gaps, explore career
              direction and practice interviews.
            </Typography>

          </Box>


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(4,1fr)",
              },
              gap: 2.5,
            }}
          >

            {features.map(
              (
                feature,
                index
              ) => (

                <Box
                  key={feature.title}
                  sx={{
                    p: 3,
                    minHeight: 270,
                    borderRadius: 4,
                    background:
                      "linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025))",
                    border:
                      "1px solid rgba(255,255,255,.08)",
                    transition:
                      "all .35s ease",
                    position:
                      "relative",
                    overflow:
                      "hidden",
                    "&:before": {
                      content: '""',
                      position:
                        "absolute",
                      width: 120,
                      height: 120,
                      borderRadius:
                        "50%",
                      background:
                        index % 2 === 0
                          ? "rgba(66,133,255,.12)"
                          : "rgba(124,77,255,.12)",
                      filter:
                        "blur(30px)",
                      top: -50,
                      right: -40,
                    },
                    "&:hover": {
                      transform:
                        "translateY(-10px)",
                      borderColor:
                        "rgba(135,151,255,.3)",
                      boxShadow:
                        "0 25px 60px rgba(0,0,0,.3)",
                    },
                  }}
                >

                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg,#2979ff,#7c4dff)",
                      boxShadow:
                        "0 10px 25px rgba(72,78,255,.25)",
                      mb: 3,
                      "& svg": {
                        fontSize: 28,
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>


                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>


                  <Typography
                    sx={{
                      color: "#8994ae",
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.text}
                  </Typography>

                </Box>

              )
            )}

          </Box>

        </Container>

      </Box>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 8,
            md: 12,
          },
          background:
            "linear-gradient(180deg,#070b1b,#0a1023)",
        }}
      >

        <Container
          maxWidth="lg"
        >

          <Typography
            variant="h2"
            align="center"
            sx={{
              fontWeight: 950,
              fontSize: {
                xs: "2.2rem",
                md: "3.4rem",
              },
              letterSpacing: "-2px",
              mb: 7,
            }}
          >
            Simple. Smart. Student-friendly.
          </Typography>


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(4,1fr)",
              },
              gap: 3,
            }}
          >

            {[
              [
                "01",
                "Upload",
                "Upload your existing resume in PDF format.",
              ],
              [
                "02",
                "Analyze",
                "TalentLens extracts and analyzes your career information.",
              ],
              [
                "03",
                "Improve",
                "Understand your strengths, gaps and job alignment.",
              ],
              [
                "04",
                "Practice",
                "Take a personalized AI mock interview.",
              ],
            ].map(
              (step) => (

                <Box
                  key={step[0]}
                  sx={{
                    position:
                      "relative",
                    p: 3,
                    borderRadius: 4,
                    background:
                      "rgba(255,255,255,.035)",
                    border:
                      "1px solid rgba(255,255,255,.07)",
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: 42,
                      fontWeight: 950,
                      color:
                        "rgba(125,140,255,.3)",
                      lineHeight: 1,
                    }}
                  >
                    {step[0]}
                  </Typography>


                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      mt: 2,
                    }}
                  >
                    {step[1]}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 1,
                      color: "#8994ae",
                      lineHeight: 1.7,
                    }}
                  >
                    {step[2]}
                  </Typography>

                </Box>

              )
            )}

          </Box>

        </Container>

      </Box>


      {/* =====================================================
          SECURITY
      ===================================================== */}

      <Box
        sx={{
          py: 6,
          background:
            "#070b1b",
        }}
      >

        <Container
          maxWidth="md"
        >

          <Box
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              textAlign: {
                xs: "center",
                sm: "left",
              },
              background:
                "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.025))",
              border:
                "1px solid rgba(255,255,255,.08)",
            }}
          >

            <Box
              sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "rgba(66,133,255,.15)",
                color: "#8eabff",
              }}
            >

              <Security
                sx={{
                  fontSize: 32,
                }}
              />

            </Box>


            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                Your career data stays yours.
              </Typography>


              <Typography
                sx={{
                  mt: .5,
                  color: "#8994ae",
                  lineHeight: 1.6,
                }}
              >
                TalentLens is designed around
                authenticated student accounts and
                protected resume analysis.
              </Typography>

            </Box>

          </Box>

        </Container>

      </Box>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg,#0b1230,#171044,#101a3b)",
        }}
      >

        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,102,241,.3),transparent 65%)",
            left: "50%",
            top: "50%",
            transform:
              "translate(-50%,-50%)",
            filter: "blur(20px)",
          }}
        />


        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >

          <Typography
            variant="h2"
            sx={{
              fontWeight: 950,
              fontSize: {
                xs: "2.4rem",
                md: "4rem",
              },
              letterSpacing: "-2px",
            }}
          >
            Ready to understand
            <br />
            your career profile?
          </Typography>


          <Typography
            sx={{
              mt: 2,
              mb: 4,
              color: "#9ca7c1",
              fontSize: "1.1rem",
            }}
          >
            Upload your resume and let TalentLens
            turn it into actionable career insights.
          </Typography>


          <Button
            component={Link}
            to={
              isLoggedIn
                ? "/dashboard"
                : "/register"
            }
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 5,
              py: 1.8,
              borderRadius: 3,
              fontWeight: 900,
              fontSize: "1rem",
              textTransform: "none",
              background:
                "linear-gradient(135deg,#2979ff,#8c52ff)",
              boxShadow:
                "0 20px 60px rgba(85,78,255,.4)",
              "&:hover": {
                transform:
                  "translateY(-4px)",
                boxShadow:
                  "0 25px 70px rgba(85,78,255,.55)",
              },
            }}
          >
            {isLoggedIn
              ? "Go to Dashboard"
              : "Get Started Free"}
          </Button>

        </Container>

      </Box>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Box
        sx={{
          py: 4,
          background: "#040711",
          borderTop:
            "1px solid rgba(255,255,255,.06)",
        }}
      >

        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >

          <Typography
            fontWeight={900}
          >
            TalentLens AI
          </Typography>


          <Typography
            variant="body2"
            sx={{
              color: "#68738e",
              textAlign: "center",
            }}
          >
            AI-powered career preparation
            for students.
          </Typography>


          <Typography
            variant="body2"
            sx={{
              color: "#68738e",
            }}
          >
            © {new Date().getFullYear()}
            {" "}TalentLens AI
          </Typography>

        </Container>

      </Box>

    </Box>
  );
}


export default Home;