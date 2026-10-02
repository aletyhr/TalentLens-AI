import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import API from "../services/api";


function Dashboard({
  atsScore = 0,
  semanticScore = 0,
  resumeGrade = "N/A",
  overallScore = 0,
  predictedRole = "Not predicted",
  roleEvidence = [],
  skills = [],
  education = [],
  experience = [],
  suggestions = [],
  interviewQuestions = [],
  resumeInsights = {},
}) {

  // =========================================================
  // CAREER READINESS
  // =========================================================

  const [careerReadiness, setCareerReadiness] = useState(null);
  const [readinessLoading, setReadinessLoading] = useState(true);
  const [readinessError, setReadinessError] = useState("");

  useEffect(() => {
    const loadCareerReadiness = async () => {
      try {
        setReadinessLoading(true);
        setReadinessError("");

        const response = await API.get(
          "/career_readiness"
        );

        if (response.data) {
          setCareerReadiness(response.data);
        }
      } catch (error) {
        console.error(
          "Career readiness error:",
          error
        );

        setReadinessError(
          error.response?.data?.message ||
          "Unable to load career readiness."
        );
      } finally {
        setReadinessLoading(false);
      }
    };

    loadCareerReadiness();
  }, []);


  // =========================================================
  // SAFE VALUES
  // =========================================================

  const safeAts = Math.max(
    0,
    Math.min(
      100,
      Number(atsScore) || 0
    )
  );


  const safeCareerReadiness = Math.max(
    0,
    Math.min(
      100,
      Number(
        careerReadiness?.career_readiness || 0
      )
    )
  );


  const safeResumeReadiness = Math.max(
    0,
    Math.min(
      100,
      Number(
        careerReadiness?.resume_readiness || 0
      )
    )
  );


  const safeInterviewReadiness = Math.max(
    0,
    Math.min(
      100,
      Number(
        careerReadiness?.interview_readiness || 0
      )
    )
  );


  const safeProfileCompleteness = Math.max(
    0,
    Math.min(
      100,
      Number(
        careerReadiness?.profile_completeness || 0
      )
    )
  );


  const hasInterview =
    Boolean(
      careerReadiness?.has_interview
    );


  // =========================================================
  // COMMON CARD STYLE
  // =========================================================

  const cardStyle = {
    borderRadius: 5,
    background:
      "rgba(255,255,255,0.97)",

    border:
      "1px solid rgba(225,230,240,0.9)",

    boxShadow:
      "0 10px 30px rgba(31,38,135,0.08)",

    transition:
      "transform .3s ease, box-shadow .3s ease",

    "&:hover": {
      transform:
        "translateY(-4px)",

      boxShadow:
        "0 18px 40px rgba(31,38,135,0.14)",
    },
  };


  // =========================================================
  // SECTION TITLE
  // =========================================================

  const sectionTitle = (
    title,
    subtitle,
    icon
  ) => (
    <Box sx={{ mb: 3 }}>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ mb: 0.8 }}
      >

        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 3,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background:
              "linear-gradient(135deg,#1976d2,#7c4dff)",

            color: "white",

            boxShadow:
              "0 8px 18px rgba(25,118,210,.20)",
          }}
        >
          {icon}
        </Box>


        <Typography
          variant="h5"
          fontWeight={900}
          sx={{
            color: "#172033",
            letterSpacing: "-.4px",
          }}
        >
          {title}
        </Typography>

      </Stack>


      {subtitle && (
        <Typography
          color="text.secondary"
          sx={{
            fontSize: ".95rem",
          }}
        >
          {subtitle}
        </Typography>
      )}

    </Box>
  );


  // =========================================================
  // READINESS LEVEL
  // =========================================================

  const readinessLevel =
    careerReadiness?.readiness_level ||
    "Not Started";


  // =========================================================
  // READINESS COLOR
  // =========================================================

  const getReadinessColor = () => {

    if (safeCareerReadiness >= 85) {
      return "#16a34a";
    }

    if (safeCareerReadiness >= 70) {
      return "#1976d2";
    }

    if (safeCareerReadiness >= 55) {
      return "#f59e0b";
    }

    return "#ef4444";
  };


  const readinessColor =
    getReadinessColor();


  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",

        background:
          "radial-gradient(circle at 10% 10%,rgba(124,77,255,.08),transparent 25%),radial-gradient(circle at 90% 20%,rgba(25,118,210,.08),transparent 25%),linear-gradient(180deg,#f6f8ff 0%,#eef3fb 100%)",

        py: {
          xs: 3,
          md: 5,
        },
      }}
    >

      <Container
        maxWidth="lg"
      >


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <Card
          sx={{
            mb: 4,
            borderRadius: 6,
            overflow: "hidden",

            background:
              "linear-gradient(135deg,#0d47a1 0%,#1976d2 50%,#7c4dff 100%)",

            color: "white",

            boxShadow:
              "0 25px 60px rgba(25,118,210,.22)",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 5,
              },
            }}
          >

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
              spacing={3}
            >

              <Box>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >

                  <AutoAwesomeIcon />

                  <Typography
                    fontWeight={800}
                    sx={{
                      fontSize: ".8rem",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      opacity: .9,
                    }}
                  >
                    Career Preparation Dashboard
                  </Typography>

                </Stack>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "2rem",
                      md: "3.2rem",
                    },

                    fontWeight: 950,
                    lineHeight: 1.05,
                    letterSpacing: "-1.5px",
                  }}
                >
                  Prepare for your career.
                </Typography>


                <Typography
                  sx={{
                    mt: 1.5,
                    maxWidth: 720,
                    opacity: .9,
                    lineHeight: 1.7,
                  }}
                >
                  Understand your resume, identify your
                  career direction, improve your profile
                  and prepare for interviews.
                </Typography>

              </Box>


              {/* ATS SUPPORTING SCORE */}

              <Box
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 180,
                  },

                  p: 2.5,

                  borderRadius: 4,

                  background:
                    "rgba(255,255,255,.12)",

                  border:
                    "1px solid rgba(255,255,255,.20)",

                  backdropFilter:
                    "blur(10px)",

                  textAlign: "center",
                }}
              >

                <Typography
                  sx={{
                    fontSize: ".75rem",
                    opacity: .75,
                    letterSpacing: .8,
                  }}
                >
                  ATS COMPATIBILITY
                </Typography>


                <Typography
                  sx={{
                    fontSize: "3rem",
                    fontWeight: 950,
                    lineHeight: 1,
                    mt: .7,
                  }}
                >
                  {safeAts}
                </Typography>


                <Typography
                  sx={{
                    fontSize: ".8rem",
                    opacity: .75,
                    mt: .5,
                  }}
                >
                  out of 100
                </Typography>

              </Box>

            </Stack>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* CAREER READINESS MAIN FEATURE */}
        {/* ================================================= */}

        <Card
          sx={{
            mb: 4,
            borderRadius: 5,

            background:
              "linear-gradient(135deg,#101828 0%,#172554 55%,#312e81 100%)",

            color: "white",

            boxShadow:
              "0 25px 55px rgba(30,41,90,.22)",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
              spacing={4}
            >

              <Box>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >

                  <EmojiEventsIcon
                    sx={{
                      fontSize: 34,
                    }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={950}
                  >
                    Career Readiness
                  </Typography>

                </Stack>


                <Typography
                  sx={{
                    opacity: .78,
                    maxWidth: 650,
                    lineHeight: 1.7,
                  }}
                >
                  A preparation-focused view of how ready
                  your current resume, profile and interview
                  preparation are.
                </Typography>

              </Box>


              {/* MAIN SCORE */}

              <Box
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 220,
                  },

                  textAlign: "center",

                  p: 3,

                  borderRadius: 5,

                  background:
                    "rgba(255,255,255,.09)",

                  border:
                    "1px solid rgba(255,255,255,.13)",
                }}
              >

                {readinessLoading ? (

                  <CircularProgress
                    sx={{
                      color: "white",
                    }}
                  />

                ) : (

                  <>

                    <Typography
                      sx={{
                        fontSize: ".8rem",
                        opacity: .7,
                        letterSpacing: 1,
                      }}
                    >
                      READINESS
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: "4rem",
                        lineHeight: 1,
                        fontWeight: 950,
                        mt: .5,
                      }}
                    >
                      {safeCareerReadiness}
                    </Typography>


                    <Typography
                      sx={{
                        opacity: .7,
                        mt: .5,
                      }}
                    >
                      out of 100
                    </Typography>


                    <Chip
                      label={readinessLevel}
                      sx={{
                        mt: 1.5,
                        color: "white",
                        fontWeight: 800,
                        background:
                          "rgba(255,255,255,.15)",
                      }}
                    />

                  </>

                )}

              </Box>

            </Stack>


            {readinessError && (
              <Alert
                severity="warning"
                sx={{
                  mt: 3,
                }}
              >
                {readinessError}
              </Alert>
            )}


            {!readinessLoading && (
              <>

                {/* MAIN PROGRESS */}

                <Box sx={{ mt: 4 }}>

                  <LinearProgress
                    variant="determinate"
                    value={safeCareerReadiness}
                    sx={{
                      height: 12,
                      borderRadius: 10,

                      background:
                        "rgba(255,255,255,.12)",

                      "& .MuiLinearProgress-bar": {
                        borderRadius: 10,

                        background:
                          "linear-gradient(90deg,#42a5f5,#b388ff)",
                      },
                    }}
                  />

                </Box>


                {/* READINESS COMPONENTS */}

                <Grid
                  container
                  spacing={2}
                  sx={{
                    mt: 2,
                  }}
                >

                  {/* RESUME READINESS */}

                  <Grid
                    item
                    xs={12}
                    md={4}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,

                        background:
                          "rgba(255,255,255,.08)",

                        border:
                          "1px solid rgba(255,255,255,.10)",

                        color: "white",
                      }}
                    >

                      <Typography
                        sx={{
                          opacity: .7,
                          fontSize: ".85rem",
                        }}
                      >
                        Resume Readiness
                      </Typography>


                      <Typography
                        sx={{
                          fontSize: "2rem",
                          fontWeight: 900,
                          mt: .5,
                        }}
                      >
                        {safeResumeReadiness}%
                      </Typography>


                      <LinearProgress
                        variant="determinate"
                        value={safeResumeReadiness}
                        sx={{
                          mt: 1.5,
                          height: 7,
                          borderRadius: 5,

                          background:
                            "rgba(255,255,255,.10)",

                          "& .MuiLinearProgress-bar": {
                            background: "#42a5f5",
                          },
                        }}
                      />

                    </Paper>

                  </Grid>


                  {/* INTERVIEW READINESS */}

                  <Grid
                    item
                    xs={12}
                    md={4}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,

                        background:
                          "rgba(255,255,255,.08)",

                        border:
                          "1px solid rgba(255,255,255,.10)",

                        color: "white",
                      }}
                    >

                      <Typography
                        sx={{
                          opacity: .7,
                          fontSize: ".85rem",
                        }}
                      >
                        Interview Readiness
                      </Typography>


                      {hasInterview ? (

                        <>

                          <Typography
                            sx={{
                              fontSize: "2rem",
                              fontWeight: 900,
                              mt: .5,
                            }}
                          >
                            {safeInterviewReadiness}%
                          </Typography>


                          <LinearProgress
                            variant="determinate"
                            value={
                              safeInterviewReadiness
                            }
                            sx={{
                              mt: 1.5,
                              height: 7,
                              borderRadius: 5,

                              background:
                                "rgba(255,255,255,.10)",

                              "& .MuiLinearProgress-bar": {
                                background: "#b388ff",
                              },
                            }}
                          />

                        </>

                      ) : (

                        <>

                          <Typography
                            sx={{
                              fontSize: {
                                xs: "1.5rem",
                                md: "1.7rem",
                              },

                              fontWeight: 900,
                              mt: .8,
                            }}
                          >
                            Not assessed yet
                          </Typography>


                          <Typography
                            sx={{
                              mt: 1,
                              fontSize: ".82rem",
                              opacity: .65,
                              lineHeight: 1.5,
                            }}
                          >
                            Complete a mock interview
                            to measure your interview
                            readiness.
                          </Typography>

                        </>

                      )}

                    </Paper>

                  </Grid>


                  {/* PROFILE COMPLETENESS */}

                  <Grid
                    item
                    xs={12}
                    md={4}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,

                        background:
                          "rgba(255,255,255,.08)",

                        border:
                          "1px solid rgba(255,255,255,.10)",

                        color: "white",
                      }}
                    >

                      <Typography
                        sx={{
                          opacity: .7,
                          fontSize: ".85rem",
                        }}
                      >
                        Profile Completeness
                      </Typography>


                      <Typography
                        sx={{
                          fontSize: "2rem",
                          fontWeight: 900,
                          mt: .5,
                        }}
                      >
                        {safeProfileCompleteness}%
                      </Typography>


                      <LinearProgress
                        variant="determinate"
                        value={
                          safeProfileCompleteness
                        }
                        sx={{
                          mt: 1.5,
                          height: 7,
                          borderRadius: 5,

                          background:
                            "rgba(255,255,255,.10)",

                          "& .MuiLinearProgress-bar": {
                            background: "#26a69a",
                          },
                        }}
                      />

                    </Paper>

                  </Grid>

                </Grid>


                {/* STRENGTHS / IMPROVEMENTS / NEXT ACTION */}

                <Grid
                  container
                  spacing={2}
                  sx={{
                    mt: 2,
                  }}
                >

                  {/* STRENGTHS */}

                  <Grid
                    item
                    xs={12}
                    md={4}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: "100%",
                        borderRadius: 4,

                        background:
                          "rgba(255,255,255,.06)",

                        border:
                          "1px solid rgba(255,255,255,.08)",

                        color: "white",
                      }}
                    >

                      <Typography
                        fontWeight={900}
                        sx={{
                          mb: 1.5,
                        }}
                      >
                        Your Strengths
                      </Typography>


                      {Array.isArray(
                        careerReadiness?.strengths
                      ) &&
                      careerReadiness.strengths.length >
                        0 ? (

                        <Stack spacing={1}>

                          {careerReadiness.strengths
                            .slice(0, 4)
                            .map(
                              (
                                item,
                                index
                              ) => (

                                <Stack
                                  direction="row"
                                  spacing={1}
                                  key={index}
                                >

                                  <CheckCircleIcon
                                    sx={{
                                      fontSize: 19,
                                      color:
                                        "#66bb6a",
                                    }}
                                  />

                                  <Typography
                                    sx={{
                                      fontSize:
                                        ".9rem",
                                      opacity: .82,
                                    }}
                                  >
                                    {item}
                                  </Typography>

                                </Stack>

                              )
                            )}

                        </Stack>

                      ) : (

                        <Typography
                          sx={{
                            opacity: .65,
                            fontSize: ".9rem",
                          }}
                        >
                          Strengths will appear
                          after your resume is
                          analyzed.
                        </Typography>

                      )}

                    </Paper>

                  </Grid>


                  {/* IMPROVEMENTS */}

                  <Grid
                    item
                    xs={12}
                    md={4}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: "100%",
                        borderRadius: 4,

                        background:
                          "rgba(255,255,255,.06)",

                        border:
                          "1px solid rgba(255,255,255,.08)",

                        color: "white",
                      }}
                    >

                      <Typography
                        fontWeight={900}
                        sx={{
                          mb: 1.5,
                        }}
                      >
                        What to Improve
                      </Typography>


                      {Array.isArray(
                        careerReadiness?.improvements
                      ) &&
                      careerReadiness.improvements.length >
                        0 ? (

                        <Stack spacing={1}>

                          {careerReadiness.improvements
                            .slice(0, 4)
                            .map(
                              (
                                item,
                                index
                              ) => (

                                <Stack
                                  direction="row"
                                  spacing={1}
                                  key={index}
                                >

                                  <LightbulbIcon
                                    sx={{
                                      fontSize: 19,
                                      color:
                                        "#ffca28",
                                    }}
                                  />

                                  <Typography
                                    sx={{
                                      fontSize:
                                        ".9rem",
                                      opacity: .82,
                                    }}
                                  >
                                    {item}
                                  </Typography>

                                </Stack>

                              )
                            )}

                        </Stack>

                      ) : (

                        <Typography
                          sx={{
                            opacity: .65,
                            fontSize: ".9rem",
                          }}
                        >
                          Your improvement areas
                          will appear here.
                        </Typography>

                      )}

                    </Paper>

                  </Grid>


                  {/* NEXT ACTION */}

                  <Grid
                    item
                    xs={12}
                    md={4}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: "100%",
                        borderRadius: 4,

                        background:
                          "rgba(255,255,255,.06)",

                        border:
                          "1px solid rgba(255,255,255,.08)",

                        color: "white",
                      }}
                    >

                      <Typography
                        fontWeight={900}
                        sx={{
                          mb: 1.5,
                        }}
                      >
                        Next Best Action
                      </Typography>


                      <Typography
                        sx={{
                          fontSize: ".95rem",
                          lineHeight: 1.7,
                          opacity: .85,
                        }}
                      >
                        {careerReadiness?.next_action ||
                          "Upload your resume to begin your career readiness assessment."}
                      </Typography>

                    </Paper>

                  </Grid>

                </Grid>

              </>
            )}

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* RESUME STATUS */}
        {/* ================================================= */}

        <Card
          sx={{
            ...cardStyle,
            mb: 4,
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            {sectionTitle(
              "Resume Status",
              "A quick overview of the information detected in your resume.",
              <DescriptionIcon />
            )}


            <Grid
              container
              spacing={2}
            >

              {[
                {
                  value: skills.length,
                  label: "Skills Detected",
                  icon: <CodeIcon />,
                },

                {
                  value: education.length,
                  label: "Education",
                  icon: <SchoolIcon />,
                },

                {
                  value: experience.length,
                  label: "Experience",
                  icon: <WorkOutlineIcon />,
                },

                {
                  value: suggestions.length,
                  label: "Improvement Areas",
                  icon: <LightbulbIcon />,
                },
              ].map(
                (
                  item,
                  index
                ) => (

                  <Grid
                    item
                    xs={6}
                    md={3}
                    key={index}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,
                        textAlign: "center",

                        background:
                          "linear-gradient(145deg,#ffffff,#f2f5fb)",

                        border:
                          "1px solid #e5eaf2",

                        height: "100%",
                      }}
                    >

                      <Box
                        sx={{
                          color:
                            "#1976d2",
                          mb: 1,
                        }}
                      >
                        {item.icon}
                      </Box>


                      <Typography
                        sx={{
                          fontSize:
                            "2rem",
                          fontWeight:
                            900,
                        }}
                      >
                        {item.value}
                      </Typography>


                      <Typography
                        color="text.secondary"
                        fontWeight={600}
                      >
                        {item.label}
                      </Typography>

                    </Paper>

                  </Grid>

                )
              )}

            </Grid>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* CAREER DIRECTION */}
        {/* ================================================= */}

        <Card
          sx={{
            ...cardStyle,
            mb: 4,
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            {sectionTitle(
              "Career Direction From Your Resume",
              "This describes the type of role your current resume most strongly represents.",
              <WorkOutlineIcon />
            )}


            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },

                borderRadius: 4,

                background:
                  "linear-gradient(135deg,#eef4ff,#f5f0ff)",

                border:
                  "1px solid rgba(124,77,255,.12)",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.5rem",
                  },

                  fontWeight: 950,
                  color: "#263238",
                  letterSpacing: "-1px",
                }}
              >
                {careerReadiness?.predicted_role ||
                  predictedRole}
              </Typography>


              <Typography
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  lineHeight: 1.7,
                  maxWidth: 750,
                }}
              >
                TalentLens identifies the career direction
                that your current resume most strongly
                represents. This is a resume consistency
                indicator, not a recommendation of what
                career you should choose.
              </Typography>


              {roleEvidence.length > 0 && (

                <>

                  <Divider
                    sx={{
                      my: 3,
                    }}
                  />


                  <Typography
                    fontWeight={800}
                    sx={{
                      mb: 1.5,
                    }}
                  >
                    Resume evidence
                  </Typography>


                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >

                    {roleEvidence.map(
                      (
                        evidence,
                        index
                      ) => (

                        <Chip
                          key={index}
                          label={evidence}
                          sx={{
                            fontWeight: 600,
                            background:
                              "rgba(25,118,210,.08)",
                          }}
                        />

                      )
                    )}

                  </Box>

                </>

              )}

            </Paper>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* ATS SUPPORTING ANALYSIS */}
        {/* ================================================= */}

        <Card
          sx={{
            ...cardStyle,
            mb: 4,
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            {sectionTitle(
              "Resume Compatibility",
              "One technical metric that helps you understand how your resume may work with automated screening.",
              <AssignmentTurnedInIcon />
            )}


            <Grid
              container
              spacing={3}
            >

              <Grid
                item
                xs={12}
                md={5}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,

                    background:
                      "linear-gradient(145deg,#eef7ff,#ffffff)",

                    border:
                      "1px solid #dcecff",
                  }}
                >

                  <Typography
                    color="text.secondary"
                    fontWeight={700}
                  >
                    ATS Compatibility Score
                  </Typography>


                  <Typography
                    sx={{
                      fontSize: "3rem",
                      fontWeight: 950,
                      mt: 1,
                    }}
                  >
                    {safeAts}
                    <Typography
                      component="span"
                      sx={{
                        fontSize:
                          "1.1rem",
                        color:
                          "text.secondary",
                        ml: .5,
                      }}
                    >
                      /100
                    </Typography>
                  </Typography>


                  <LinearProgress
                    variant="determinate"
                    value={safeAts}
                    sx={{
                      mt: 2,
                      height: 9,
                      borderRadius: 5,

                      background:
                        "#e5edf7",

                      "& .MuiLinearProgress-bar": {
                        background:
                          "linear-gradient(90deg,#1976d2,#42a5f5)",
                        borderRadius: 5,
                      },
                    }}
                  />

                </Paper>

              </Grid>


              <Grid
                item
                xs={12}
                md={7}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    height: "100%",

                    background:
                      "#f8fafc",

                    border:
                      "1px solid #e6ebf2",
                  }}
                >

                  <Typography
                    fontWeight={800}
                    sx={{
                      mb: 1,
                    }}
                  >
                    What does this mean?
                  </Typography>


                  <Typography
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                    }}
                  >
                    The ATS Compatibility Score estimates
                    how well the skills detected from your
                    resume align with the analysis job
                    requirements. It is a TalentLens compatibility
                    measure, not the score produced by a
                    specific company's ATS.
                  </Typography>

                </Paper>

              </Grid>

            </Grid>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* AI RESUME INSIGHTS */}
        {/* ================================================= */}

        <Card
          sx={{
            ...cardStyle,
            mb: 4,

            background:
              "linear-gradient(135deg,#101828,#172554,#312e81)",

            color: "white",

            "&:hover": {
              boxShadow:
                "0 25px 55px rgba(30,41,90,.25)",
            },
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                mb: 3,
              }}
            >

              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  background:
                    "rgba(255,255,255,.10)",
                }}
              >
                <SmartToyIcon />
              </Box>


              <Box>

                <Typography
                  variant="h5"
                  fontWeight={900}
                >
                  AI Resume Insights
                </Typography>


                <Typography
                  sx={{
                    opacity: .7,
                    fontSize: ".9rem",
                  }}
                >
                  Personalized observations from your resume.
                </Typography>

              </Box>

            </Stack>


            {resumeInsights &&
            Object.keys(
              resumeInsights
            ).length > 0 ? (

              <Grid
                container
                spacing={2}
              >

                {Object.entries(
                  resumeInsights
                ).map(
                  (
                    [key, value],
                    index
                  ) => (

                    <Grid
                      item
                      xs={12}
                      md={6}
                      key={index}
                    >

                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,

                          background:
                            "rgba(255,255,255,.07)",

                          color: "white",

                          border:
                            "1px solid rgba(255,255,255,.10)",
                        }}
                      >

                        <Typography
                          fontWeight={800}
                          sx={{
                            mb: .7,
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {String(key).replace(
                            /_/g,
                            " "
                          )}
                        </Typography>


                        <Typography
                          sx={{
                            opacity: .8,
                            fontSize: ".92rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </Typography>

                      </Paper>

                    </Grid>

                  )
                )}

              </Grid>

            ) : (

              <Typography
                sx={{
                  opacity: .7,
                }}
              >
                AI-generated resume insights will
                appear here after analysis.
              </Typography>

            )}

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* SKILLS */}
        {/* ================================================= */}

        <Card
          sx={{
            ...cardStyle,
            mb: 4,
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            {sectionTitle(
              "Your Skills",
              "Skills detected from your resume.",
              <CodeIcon />
            )}


            {skills.length > 0 ? (

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.2,
                }}
              >

                {skills.map(
                  (
                    skill,
                    index
                  ) => (

                    <Chip
                      key={index}
                      label={skill}
                      sx={{
                        px: 1,
                        py: 2.5,

                        borderRadius: 3,

                        fontWeight: 700,

                        background:
                          "linear-gradient(135deg,#eef4ff,#f4efff)",

                        border:
                          "1px solid #dce3f4",

                        color:
                          "#263238",
                      }}
                    />

                  )
                )}

              </Box>

            ) : (

              <Typography
                color="text.secondary"
              >
                No skills detected.
              </Typography>

            )}

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* EDUCATION + EXPERIENCE */}
        {/* ================================================= */}

        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
          }}
        >

          {/* EDUCATION */}

          <Grid
            item
            xs={12}
            md={6}
          >

            <Card
              sx={{
                ...cardStyle,
                height: "100%",
              }}
            >

              <CardContent
                sx={{
                  p: {
                    xs: 3,
                    md: 4,
                  },
                }}
              >

                {sectionTitle(
                  "Education",
                  "Academic information detected from your resume.",
                  <SchoolIcon />
                )}


                {education.length > 0 ? (

                  <Stack spacing={1.5}>

                    {education.map(
                      (
                        item,
                        index
                      ) => (

                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 3,

                            background:
                              "#f7f9fd",

                            border:
                              "1px solid #e6ebf3",
                          }}
                        >

                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >

                            <CheckCircleIcon
                              color="primary"
                            />

                            <Typography
                              fontWeight={600}
                            >
                              {typeof item ===
                              "string"
                                ? item
                                : JSON.stringify(item)}
                            </Typography>

                          </Stack>

                        </Paper>

                      )
                    )}

                  </Stack>

                ) : (

                  <Typography
                    color="text.secondary"
                  >
                    No education information detected.
                  </Typography>

                )}

              </CardContent>

            </Card>

          </Grid>


          {/* EXPERIENCE */}

          <Grid
            item
            xs={12}
            md={6}
          >

            <Card
              sx={{
                ...cardStyle,
                height: "100%",
              }}
            >

              <CardContent
                sx={{
                  p: {
                    xs: 3,
                    md: 4,
                  },
                }}
              >

                {sectionTitle(
                  "Experience",
                  "Professional experience detected from your resume.",
                  <WorkOutlineIcon />
                )}


                {experience.length > 0 ? (

                  <Stack spacing={1.5}>

                    {experience.map(
                      (
                        item,
                        index
                      ) => (

                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 3,

                            background:
                              "#f7f9fd",

                            border:
                              "1px solid #e6ebf3",
                          }}
                        >

                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >

                            <CheckCircleIcon
                              color="primary"
                            />

                            <Typography
                              fontWeight={600}
                            >
                              {typeof item ===
                              "string"
                                ? item
                                : JSON.stringify(item)}
                            </Typography>

                          </Stack>

                        </Paper>

                      )
                    )}

                  </Stack>

                ) : (

                  <Typography
                    color="text.secondary"
                  >
                    No experience information detected.
                  </Typography>

                )}

              </CardContent>

            </Card>

          </Grid>

        </Grid>


        {/* ================================================= */}
        {/* IMPROVEMENTS */}
        {/* ================================================= */}

        <Card
          sx={{
            ...cardStyle,
            mb: 4,
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            {sectionTitle(
              "What You Can Improve",
              "Actionable recommendations to strengthen your resume.",
              <LightbulbIcon />
            )}


            {suggestions.length > 0 ? (

              <Grid
                container
                spacing={2}
              >

                {suggestions.map(
                  (
                    suggestion,
                    index
                  ) => (

                    <Grid
                      item
                      xs={12}
                      md={6}
                      key={index}
                    >

                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 4,

                          background:
                            "linear-gradient(145deg,#fffaf0,#ffffff)",

                          border:
                            "1px solid #f5e6c8",
                        }}
                      >

                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                        >

                          <LightbulbIcon
                            sx={{
                              color:
                                "#f59e0b",
                            }}
                          />

                          <Typography
                            fontWeight={600}
                            sx={{
                              lineHeight: 1.6,
                            }}
                          >
                            {suggestion}
                          </Typography>

                        </Stack>

                      </Paper>

                    </Grid>

                  )
                )}

              </Grid>

            ) : (

              <Alert severity="info">
                No additional suggestions available.
              </Alert>

            )}

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* AI INTERVIEW PREPARATION */}
        {/* ================================================= */}

        <Card
          sx={{
            ...cardStyle,
            mb: 4,

            background:
              "linear-gradient(135deg,#ffffff,#f4f0ff)",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
              spacing={3}
            >

              <Box>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    mb: 1,
                  }}
                >

                  <SmartToyIcon
                    sx={{
                      color:
                        "#7c4dff",
                      fontSize: 32,
                    }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={900}
                  >
                    AI Interview Preparation
                  </Typography>

                </Stack>


                <Typography
                  color="text.secondary"
                  sx={{
                    maxWidth: 700,
                    lineHeight: 1.7,
                  }}
                >
                  Practice interviews using your actual
                  resume. TalentLens can ask about your
                  skills, projects, education, experience
                  and career direction.
                </Typography>

              </Box>


              {/* ONLY MAIN INTERVIEW BUTTON */}

              <Button
                variant="contained"
                size="large"
                endIcon={
                  <ArrowForwardIcon />
                }
                onClick={() => {
                  window.location.href =
                    "/ai-interview";
                }}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,

                  fontWeight: 900,

                  background:
                    "linear-gradient(135deg,#1976d2,#7c4dff)",

                  boxShadow:
                    "0 10px 25px rgba(92,77,255,.22)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1565c0,#6a3de8)",
                  },
                }}
              >
                Open Interview Center
              </Button>

            </Stack>


            {/* INTERVIEW OPTIONS */}

            <Grid
              container
              spacing={2}
              sx={{
                mt: 3,
              }}
            >

              {/* RESUME */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    height: "100%",

                    background:
                      "linear-gradient(145deg,#eef4ff,#ffffff)",

                    border:
                      "1px solid #dcecff",
                  }}
                >

                  <RecordVoiceOverIcon
                    sx={{
                      color:
                        "#1976d2",
                      fontSize: 32,
                      mb: 1,
                    }}
                  />


                  <Typography
                    fontWeight={900}
                    sx={{
                      mb: .5,
                    }}
                  >
                    Resume Interview
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Questions generated from
                    your resume.
                  </Typography>

                </Paper>

              </Grid>


              {/* TECHNICAL */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    height: "100%",

                    background:
                      "linear-gradient(145deg,#f4efff,#ffffff)",

                    border:
                      "1px solid #e8dcff",
                  }}
                >

                  <CodeIcon
                    sx={{
                      color:
                        "#7c4dff",
                      fontSize: 32,
                      mb: 1,
                    }}
                  />


                  <Typography
                    fontWeight={900}
                    sx={{
                      mb: .5,
                    }}
                  >
                    Technical Practice
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Practice questions related
                    to your resume skills.
                  </Typography>

                </Paper>

              </Grid>


              {/* HR */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    height: "100%",

                    background:
                      "linear-gradient(145deg,#edfff9,#ffffff)",

                    border:
                      "1px solid #d7f5ea",
                  }}
                >

                  <PsychologyIcon
                    sx={{
                      color:
                        "#00a896",
                      fontSize: 32,
                      mb: 1,
                    }}
                  />


                  <Typography
                    fontWeight={900}
                    sx={{
                      mb: .5,
                    }}
                  >
                    HR & Behavioral
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Prepare for recruiter and
                    behavioral questions.
                  </Typography>

                </Paper>

              </Grid>


              {/* TRACKING */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    height: "100%",

                    background:
                      "linear-gradient(145deg,#fffaf0,#ffffff)",

                    border:
                      "1px solid #f5e6c8",
                  }}
                >

                  <TrendingUpIcon
                    sx={{
                      color:
                        "#f59e0b",
                      fontSize: 32,
                      mb: 1,
                    }}
                  />


                  <Typography
                    fontWeight={900}
                    sx={{
                      mb: .5,
                    }}
                  >
                    Performance Tracking
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Track interview performance
                    after completing interviews.
                  </Typography>

                </Paper>

              </Grid>

            </Grid>


            {/* SAMPLE QUESTIONS */}

            {interviewQuestions.length > 0 && (

              <>

                <Divider
                  sx={{
                    my: 3,
                  }}
                />


                <Typography
                  fontWeight={900}
                  sx={{
                    mb: 2,
                  }}
                >
                  Sample Resume Interview Questions
                </Typography>


                <Stack spacing={1.5}>

                  {interviewQuestions
                    .slice(0, 3)
                    .map(
                      (
                        question,
                        index
                      ) => (

                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2,

                            borderRadius: 3,

                            background:
                              "rgba(255,255,255,.8)",

                            border:
                              "1px solid #e6e0ff",
                          }}
                        >

                          <Stack
                            direction="row"
                            spacing={1.5}
                          >

                            <Typography
                              fontWeight={900}
                              color="primary"
                            >
                              Q{index + 1}
                            </Typography>


                            <Typography
                              fontWeight={600}
                            >
                              {typeof question ===
                              "string"
                                ? question
                                : question.question ||
                                  JSON.stringify(
                                    question
                                  )}
                            </Typography>

                          </Stack>

                        </Paper>

                      )
                    )}

                </Stack>

              </>

            )}

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* FINAL MESSAGE */}
        {/* ================================================= */}

        <Card
          sx={{
            ...cardStyle,
            mb: 4,

            background:
              "linear-gradient(135deg,#0d47a1,#1976d2,#7c4dff)",

            color: "white",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={3}
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
            >

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={950}
                  sx={{
                    mb: 1,
                  }}
                >
                  Your next step is clear.
                </Typography>


                <Typography
                  sx={{
                    opacity: .9,
                    maxWidth: 750,
                    lineHeight: 1.7,
                  }}
                >
                  Keep improving your resume and use the
                  AI Interview Center to practice before
                  your next interview.
                </Typography>

              </Box>

            </Stack>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <Box
          sx={{
            textAlign: "center",
            py: 3,
          }}
        >

          <Typography
            fontWeight={900}
            sx={{
              color:
                "#263238",
            }}
          >
            TalentLens AI
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              fontSize: ".85rem",
              mt: .5,
            }}
          >
            AI-powered resume intelligence and career preparation
          </Typography>

        </Box>

      </Container>

    </Box>
  );
}


export default Dashboard;