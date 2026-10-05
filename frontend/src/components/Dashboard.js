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


  const readinessLevel =
    careerReadiness?.readiness_level ||
    "Not Started";


  // =========================================================
  // PROFILE CHECKS
  // =========================================================

  const profileChecks = [
    {
      label: "Skills",
      complete:
        Array.isArray(skills) &&
        skills.length > 0,
    },

    {
      label: "Education",
      complete:
        Array.isArray(education) &&
        education.length > 0,
    },

    {
      label: "Experience",
      complete:
        Array.isArray(experience) &&
        experience.length > 0,
    },

    {
      label: "Career Role",
      complete:
        Boolean(
          predictedRole &&
          predictedRole !== "Not predicted" &&
          String(predictedRole).trim()
        ),
    },

    {
      label: "Resume Insights",
      complete:
        resumeInsights &&
        typeof resumeInsights === "object" &&
        Object.keys(resumeInsights).length > 0,
    },
  ];


  const completedProfileItems =
    profileChecks.filter(
      (item) => item.complete
    ).length;


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
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}

    </Box>
  );


  // =========================================================
  // OPEN INTERVIEW CENTER
  // =========================================================

  const openInterviewCenter = () => {
    window.location.href =
      "/ai-interview";
  };


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

      <Container maxWidth="lg">


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
                  Understand your resume, measure your
                  career readiness, identify areas to improve,
                  and practice interviews with AI.
                </Typography>

              </Box>


              {/* ATS SCORE */}

              <Box
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 190,
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
        {/* CAREER READINESS */}
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
                    maxWidth: 680,
                    lineHeight: 1.7,
                  }}
                >
                  Your overall preparation level based on
                  your resume, interview performance and
                  profile completeness.
                </Typography>

              </Box>


              <Box
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 230,
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
                      OVERALL READINESS
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


                {/* ================================================= */}
                {/* READINESS COMPONENTS */}
                {/* ================================================= */}

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

                        height: "100%",
                      }}
                    >

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >

                        <DescriptionIcon />

                        <Typography
                          fontWeight={900}
                        >
                          Resume Readiness
                        </Typography>

                      </Stack>


                      <Typography
                        sx={{
                          fontSize: "2.3rem",
                          fontWeight: 950,
                          mt: 1,
                        }}
                      >
                        {safeResumeReadiness}
                      </Typography>


                      <LinearProgress
                        variant="determinate"
                        value={
                          safeResumeReadiness
                        }
                        sx={{
                          mt: 1,
                          height: 8,
                          borderRadius: 5,

                          background:
                            "rgba(255,255,255,.10)",
                        }}
                      />


                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
                          opacity: .7,
                          lineHeight: 1.6,
                        }}
                      >
                        Measures the current strength
                        of your resume.
                      </Typography>

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

                        height: "100%",
                      }}
                    >

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >

                        <RecordVoiceOverIcon />

                        <Typography
                          fontWeight={900}
                        >
                          Interview Readiness
                        </Typography>

                      </Stack>


                      <Typography
                        sx={{
                          fontSize: "2.3rem",
                          fontWeight: 950,
                          mt: 1,
                        }}
                      >
                        {hasInterview
                          ? safeInterviewReadiness
                          : "Not Started"}
                      </Typography>


                      {hasInterview && (

                        <LinearProgress
                          variant="determinate"
                          value={
                            safeInterviewReadiness
                          }
                          sx={{
                            mt: 1,
                            height: 8,
                            borderRadius: 5,

                            background:
                              "rgba(255,255,255,.10)",
                          }}
                        />

                      )}


                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
                          opacity: .7,
                          lineHeight: 1.6,
                        }}
                      >
                        {hasInterview
                          ? "Based on your interview performance."
                          : "Complete an AI interview to measure this area."}
                      </Typography>

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

                        height: "100%",
                      }}
                    >

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >

                        <AssignmentTurnedInIcon />

                        <Typography
                          fontWeight={900}
                        >
                          Profile Completeness
                        </Typography>

                      </Stack>


                      <Typography
                        sx={{
                          fontSize: "2.3rem",
                          fontWeight: 950,
                          mt: 1,
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
                          mt: 1,
                          height: 8,
                          borderRadius: 5,

                          background:
                            "rgba(255,255,255,.10)",
                        }}
                      />


                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
                          opacity: .7,
                          lineHeight: 1.6,
                        }}
                      >
                        {completedProfileItems}
                        /
                        {profileChecks.length}
                        {" "}
                        important areas detected.
                      </Typography>

                    </Paper>

                  </Grid>

                </Grid>
                                {/* ================================================= */}
                {/* SCORE EXPLANATION */}
                {/* ================================================= */}

                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 2.5,
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
                      mb: 1,
                    }}
                  >
                    How your Career Readiness is calculated
                  </Typography>


                  <Typography
                    sx={{
                      opacity: .7,
                      fontSize: ".88rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {hasInterview
                      ? "Because you have completed an interview, your Career Readiness combines Resume Readiness, Interview Readiness and Profile Completeness."
                      : "Until you complete an interview, your Career Readiness is based on Resume Readiness and Profile Completeness."}
                  </Typography>


                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{
                      mt: 2,
                    }}
                  >

                    {hasInterview ? (

                      <>

                        <Chip
                          label="Resume 50%"
                          sx={{
                            color: "white",

                            background:
                              "rgba(66,165,245,.18)",

                            fontWeight: 700,
                          }}
                        />

                        <Chip
                          label="Interview 35%"
                          sx={{
                            color: "white",

                            background:
                              "rgba(179,136,255,.18)",

                            fontWeight: 700,
                          }}
                        />

                        <Chip
                          label="Profile 15%"
                          sx={{
                            color: "white",

                            background:
                              "rgba(38,166,154,.18)",

                            fontWeight: 700,
                          }}
                        />

                      </>

                    ) : (

                      <>

                        <Chip
                          label="Resume 70%"
                          sx={{
                            color: "white",

                            background:
                              "rgba(66,165,245,.18)",

                            fontWeight: 700,
                          }}
                        />

                        <Chip
                          label="Profile 30%"
                          sx={{
                            color: "white",

                            background:
                              "rgba(38,166,154,.18)",

                            fontWeight: 700,
                          }}
                        />

                      </>

                    )}

                  </Stack>

                </Paper>


                {/* ================================================= */}
                {/* STRENGTHS / IMPROVEMENTS / NEXT ACTION */}
                {/* ================================================= */}

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
                      careerReadiness.strengths.length > 0 ? (

                        <Stack spacing={1}>

                          {careerReadiness.strengths.map(
                            (item, index) => (

                              <Stack
                                key={index}
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                              >

                                <CheckCircleIcon
                                  sx={{
                                    fontSize: 19,
                                    mt: .2,
                                  }}
                                />

                                <Typography
                                  variant="body2"
                                  sx={{
                                    opacity: .8,
                                    lineHeight: 1.6,
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
                          variant="body2"
                          sx={{
                            opacity: .65,
                            lineHeight: 1.6,
                          }}
                        >
                          Complete your resume analysis
                          to identify your strengths.
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
                        Focus Areas
                      </Typography>


                      {Array.isArray(
                        careerReadiness?.improvements
                      ) &&
                      careerReadiness.improvements.length > 0 ? (

                        <Stack spacing={1}>

                          {careerReadiness.improvements.map(
                            (item, index) => (

                              <Stack
                                key={index}
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                              >

                                <TrendingUpIcon
                                  sx={{
                                    fontSize: 19,
                                    mt: .2,
                                  }}
                                />

                                <Typography
                                  variant="body2"
                                  sx={{
                                    opacity: .8,
                                    lineHeight: 1.6,
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
                          variant="body2"
                          sx={{
                            opacity: .65,
                            lineHeight: 1.6,
                          }}
                        >
                          Your improvement areas will
                          appear here.
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
                        Recommended Next Step
                      </Typography>


                      <Typography
                        variant="body2"
                        sx={{
                          opacity: .8,
                          lineHeight: 1.7,
                        }}
                      >
                        {careerReadiness?.next_action ||
                          "Complete your resume analysis to begin."}
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
              "A quick overview of your current resume analysis.",
              <DescriptionIcon />
            )}


            <Grid
              container
              spacing={2}
            >

              {/* ATS */}

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

                    background:
                      "linear-gradient(145deg,#eef6ff,#ffffff)",

                    border:
                      "1px solid #dbeafe",
                  }}
                >

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    ATS Compatibility
                  </Typography>


                  <Typography
                    variant="h4"
                    fontWeight={950}
                    sx={{
                      mt: 1,
                      color: "#1976d2",
                    }}
                  >
                    {safeAts}
                  </Typography>


                  <LinearProgress
                    variant="determinate"
                    value={safeAts}
                    sx={{
                      mt: 1.5,
                      height: 7,
                      borderRadius: 5,
                    }}
                  />

                </Paper>

              </Grid>


              {/* SEMANTIC */}

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

                    background:
                      "linear-gradient(145deg,#f5f3ff,#ffffff)",

                    border:
                      "1px solid #e9d5ff",
                  }}
                >

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Semantic Match
                  </Typography>


                  <Typography
                    variant="h4"
                    fontWeight={950}
                    sx={{
                      mt: 1,
                      color: "#7c3aed",
                    }}
                  >
                    {Math.round(
                      Number(
                        semanticScore
                      ) || 0
                    )}
                  </Typography>


                  <LinearProgress
                    variant="determinate"
                    value={Math.max(
                      0,
                      Math.min(
                        100,
                        Number(
                          semanticScore
                        ) || 0
                      )
                    )}
                    sx={{
                      mt: 1.5,
                      height: 7,
                      borderRadius: 5,
                    }}
                  />

                </Paper>

              </Grid>


              {/* OVERALL */}

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

                    background:
                      "linear-gradient(145deg,#f0fdf4,#ffffff)",

                    border:
                      "1px solid #bbf7d0",
                  }}
                >

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Overall Resume Score
                  </Typography>


                  <Typography
                    variant="h4"
                    fontWeight={950}
                    sx={{
                      mt: 1,
                      color: "#16a34a",
                    }}
                  >
                    {Math.round(
                      Number(
                        overallScore
                      ) || 0
                    )}
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                    }}
                  >
                    Overall resume analysis
                  </Typography>

                </Paper>

              </Grid>


              {/* GRADE */}

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

                    background:
                      "linear-gradient(145deg,#fff7ed,#ffffff)",

                    border:
                      "1px solid #fed7aa",
                  }}
                >

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Resume Grade
                  </Typography>


                  <Typography
                    variant="h4"
                    fontWeight={950}
                    sx={{
                      mt: 1,
                      color: "#ea580c",
                    }}
                  >
                    {resumeGrade || "N/A"}
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                    }}
                  >
                    Current resume grade
                  </Typography>

                </Paper>

              </Grid>

            </Grid>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* PROFILE COMPLETENESS DETAILS */}
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
              "Profile Completeness",
              "Check which important resume areas TalentLens has detected.",
              <AssignmentTurnedInIcon />
            )}


            <Grid
              container
              spacing={2}
            >

              {profileChecks.map(
                (item, index) => (

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,

                        background:
                          item.complete
                            ? "#f0fdf4"
                            : "#fff7ed",

                        border:
                          item.complete
                            ? "1px solid #bbf7d0"
                            : "1px solid #fed7aa",
                      }}
                    >

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >

                        <CheckCircleIcon
                          color={
                            item.complete
                              ? "success"
                              : "disabled"
                          }
                        />


                        <Box>

                          <Typography
                            fontWeight={850}
                          >
                            {item.label}
                          </Typography>


                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {item.complete
                              ? "Completed"
                              : "Needs information"}
                          </Typography>

                        </Box>

                      </Stack>

                    </Paper>

                  </Grid>

                )
              )}

            </Grid>

          </CardContent>

        </Card>


                {/* ================================================= */}
        {/* RESUME COMPATIBILITY / ATS */}
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
              "See how your resume performs for automated screening and career relevance.",
              <DescriptionIcon />
            )}


            <Grid
              container
              spacing={3}
            >

              {/* ATS SCORE */}

              <Grid
                item
                xs={12}
                md={6}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,

                    background:
                      "linear-gradient(135deg,#eef6ff,#ffffff)",

                    border:
                      "1px solid #dbeafe",

                    height: "100%",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >

                    <AssignmentTurnedInIcon
                      sx={{
                        color: "#1976d2",
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight={900}
                    >
                      ATS Compatibility
                    </Typography>

                  </Stack>


                  <Typography
                    sx={{
                      fontSize: "3.2rem",
                      fontWeight: 950,
                      mt: 2,
                      color: "#1976d2",
                    }}
                  >
                    {safeAts}
                  </Typography>


                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: 2,
                    }}
                  >
                    out of 100
                  </Typography>


                  <LinearProgress
                    variant="determinate"
                    value={safeAts}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                    }}
                  />


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 2,
                      lineHeight: 1.7,
                    }}
                  >
                    This indicates how compatible your
                    resume is with automated screening
                    systems.
                  </Typography>

                </Paper>

              </Grid>


              {/* SEMANTIC MATCH */}

              <Grid
                item
                xs={12}
                md={6}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,

                    background:
                      "linear-gradient(135deg,#f5f3ff,#ffffff)",

                    border:
                      "1px solid #e9d5ff",

                    height: "100%",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >

                    <PsychologyIcon
                      sx={{
                        color: "#7c3aed",
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight={900}
                    >
                      Semantic Match
                    </Typography>

                  </Stack>


                  <Typography
                    sx={{
                      fontSize: "3.2rem",
                      fontWeight: 950,
                      mt: 2,
                      color: "#7c3aed",
                    }}
                  >
                    {Math.round(
                      Number(
                        semanticScore
                      ) || 0
                    )}
                  </Typography>


                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: 2,
                    }}
                  >
                    out of 100
                  </Typography>


                  <LinearProgress
                    variant="determinate"
                    value={Math.max(
                      0,
                      Math.min(
                        100,
                        Number(
                          semanticScore
                        ) || 0
                      )
                    )}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                    }}
                  />


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 2,
                      lineHeight: 1.7,
                    }}
                  >
                    This indicates how closely your resume
                    content matches the career direction
                    identified by TalentLens.
                  </Typography>

                </Paper>

              </Grid>

            </Grid>


            {/* OVERALL RESUME SCORE */}

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 4,

                background:
                  "linear-gradient(135deg,#f0fdf4,#ffffff)",

                border:
                  "1px solid #bbf7d0",
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
                spacing={2}
              >

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Overall Resume Score
                  </Typography>


                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: .5,
                    }}
                  >
                    Your combined resume analysis score.
                  </Typography>

                </Box>


                <Typography
                  sx={{
                    fontSize: "3rem",
                    fontWeight: 950,
                    color: "#16a34a",
                  }}
                >
                  {Math.round(
                    Number(
                      overallScore
                    ) || 0
                  )}
                </Typography>

              </Stack>

            </Paper>

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


            {Array.isArray(skills) &&
            skills.length > 0 ? (

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >

                {skills.map(
                  (skill, index) => (

                    <Chip
                      key={index}
                      label={skill}
                      sx={{
                        mb: .7,
                        fontWeight: 700,

                        background:
                          "#eef2ff",

                        color:
                          "#4338ca",

                        border:
                          "1px solid #c7d2fe",
                      }}
                    />

                  )
                )}

              </Stack>

            ) : (

              <Alert severity="info">
                No skills were detected from your resume.
              </Alert>

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

          {/* ================================================= */}
          {/* EDUCATION */}
          {/* ================================================= */}

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
                  "Education information detected from your resume.",
                  <SchoolIcon />
                )}


                {Array.isArray(education) &&
                education.length > 0 ? (

                  <Stack spacing={2}>

                    {education.map(
                      (item, index) => (

                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 4,

                            background:
                              "#f8fafc",

                            border:
                              "1px solid #e5e7eb",
                          }}
                        >

                          <Typography
                            fontWeight={850}
                          >
                            {typeof item === "string"
                              ? item
                              : item.degree ||
                                item.title ||
                                item.qualification ||
                                item.program ||
                                "Education"}
                          </Typography>


                          {typeof item === "object" && (

                            <>

                              {(item.institution ||
                                item.college ||
                                item.university) && (

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: .6,
                                  }}
                                >
                                  {item.institution ||
                                    item.college ||
                                    item.university}
                                </Typography>

                              )}


                              {item.year && (

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: .4,
                                  }}
                                >
                                  {item.year}
                                </Typography>

                              )}

                            </>

                          )}

                        </Paper>

                      )
                    )}

                  </Stack>

                ) : (

                  <Alert severity="info">
                    No education information was detected.
                  </Alert>

                )}

              </CardContent>

            </Card>

          </Grid>


          {/* ================================================= */}
          {/* EXPERIENCE */}
          {/* ================================================= */}

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


                {Array.isArray(experience) &&
                experience.length > 0 ? (

                  <Stack spacing={2}>

                    {experience.map(
                      (item, index) => (

                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 4,

                            background:
                              "#f8fafc",

                            border:
                              "1px solid #e5e7eb",
                          }}
                        >

                          <Typography
                            fontWeight={850}
                          >
                            {typeof item === "string"
                              ? item
                              : item.role ||
                                item.title ||
                                item.position ||
                                "Experience"}
                          </Typography>


                          {typeof item === "object" && (

                            <>

                              {(item.company ||
                                item.organization) && (

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: .6,
                                  }}
                                >
                                  {item.company ||
                                    item.organization}
                                </Typography>

                              )}


                              {(item.duration ||
                                item.period) && (

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: .4,
                                  }}
                                >
                                  {item.duration ||
                                    item.period}
                                </Typography>

                              )}

                            </>

                          )}

                        </Paper>

                      )
                    )}

                  </Stack>

                ) : (

                  <Alert severity="info">
                    No experience information was detected.
                  </Alert>

                )}

              </CardContent>

            </Card>

          </Grid>

        </Grid>


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
        xs: 2.5,
        md: 3,
      },
    }}
  >

    {sectionTitle(
      "Career Direction",
      "Your resume's current career direction at a glance.",
      <WorkOutlineIcon />
    )}

    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2.5,
          md: 3,
        },

        borderRadius: 4,

        background:
          "linear-gradient(135deg,#eef6ff,#f8f5ff)",

        border:
          "1px solid #dbeafe",
      }}
    >

      <Grid
        container
        spacing={3}
        alignItems="center"
      >

        {/* ================================================= */}
        {/* PREDICTED ROLE */}
        {/* ================================================= */}

        <Grid
          item
          xs={12}
          md={4}
        >

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.8,
              mb: 0.8,
            }}
          >
            PREDICTED CAREER ROLE
          </Typography>

          <Typography
            variant="h4"
            fontWeight={950}
            sx={{
              color: "#172033",
              lineHeight: 1.15,
            }}
          >
            {predictedRole ||
              "Not predicted"}
          </Typography>

        </Grid>


        {/* ================================================= */}
        {/* KEY RESUME SIGNALS */}
        {/* ================================================= */}

        <Grid
          item
          xs={12}
          md={8}
        >

          <Typography
            fontWeight={900}
            sx={{
              mb: 1.2,
              color: "#172033",
            }}
          >
            Key Resume Signals
          </Typography>

          {Array.isArray(roleEvidence) &&
          roleEvidence.length > 0 ? (

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >

              {roleEvidence
                .map((item) => {

                  if (
                    typeof item === "string"
                  ) {
                    return item;
                  }

                  return (
                    item?.label ||
                    item?.reason ||
                    item?.text ||
                    ""
                  );
                })
                .map((item) =>
                  String(item)
                    .replace(
                      /^skill:\s*/i,
                      ""
                    )
                    .replace(
                      /^resume evidence:\s*/i,
                      ""
                    )
                    .trim()
                )
                .filter(Boolean)
                .filter(
                  (item, index, array) =>
                    array.indexOf(item) === index
                )
                .slice(0, 8)
                .map((item, index) => (

                  <Chip
                    key={index}
                    label={item}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 650,

                      backgroundColor:
                        "#ffffff",

                      border:
                        "1px solid #dbeafe",

                      color:
                        "#334155",

                      maxWidth: "100%",

                      "& .MuiChip-label": {
                        whiteSpace:
                          "normal",
                        py: 0.6,
                      },
                    }}
                  />

                ))}

            </Box>

          ) : (

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
              }}
            >
              Upload and analyze your resume
              to see the key signals supporting
              your predicted career direction.
            </Typography>

          )}

        </Grid>

      </Grid>

    </Paper>

  </CardContent>
</Card>
                {/* ================================================= */}
        {/* AI RESUME INSIGHTS */}
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
              "AI Resume Insights",
              "AI-generated insights to help you understand and improve your resume.",
              <AutoAwesomeIcon />
            )}


            {resumeInsights &&
            Object.keys(resumeInsights).length > 0 ? (

              <Grid
                container
                spacing={3}
              >

                {Object.entries(
                  resumeInsights
                ).map(
                  ([key, value]) => (

                    <Grid
                      item
                      xs={12}
                      md={6}
                      key={key}
                    >

                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          height: "100%",
                          borderRadius: 4,

                          background:
                            "linear-gradient(135deg,#faf7ff,#ffffff)",

                          border:
                            "1px solid #e9ddff",
                        }}
                      >

                        <Typography
                          variant="subtitle1"
                          fontWeight={850}
                          sx={{
                            mb: 1,
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {String(key)
                            .replace(
                              /_/g,
                              " "
                            )}
                        </Typography>


                        <Typography
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.8,
                            whiteSpace:
                              "pre-wrap",
                          }}
                        >
                          {Array.isArray(value)
                            ? value.join(", ")
                            : typeof value ===
                              "object"
                            ? JSON.stringify(
                                value
                              )
                            : String(value)}
                        </Typography>

                      </Paper>

                    </Grid>

                  )
                )}

              </Grid>

            ) : (

              <Alert severity="info">
                No AI resume insights are available yet.
              </Alert>

            )}

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* WHAT YOU CAN IMPROVE */}
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
                            "#fffaf0",

                          border:
                            "1px solid #fde68a",
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
                              mt: 0.2,
                            }}
                          />

                          <Typography
                            sx={{
                              lineHeight: 1.7,
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

              <Alert severity="success">
                Your resume currently has no major improvement
                suggestions.
              </Alert>

            )}

          </CardContent>

        </Card>
                {/* ================================================= */}
        {/* AI INTERVIEW CENTER */}
        {/* ================================================= */}

        <Card
          sx={{
            mb: 4,
            borderRadius: 5,
            overflow: "hidden",

            boxShadow:
              "0 18px 45px rgba(79,70,229,.15)",

            border:
              "1px solid rgba(99,102,241,.15)",
          }}
        >

          {/* HERO */}

          <Box
            sx={{
              p: {
                xs: 3,
                md: 4,
              },

              background:
                "linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#9333ea 100%)",

              color: "white",
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
              justifyContent="space-between"
            >

              <Box>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    mb: 1,
                  }}
                >

                  <SmartToyIcon />

                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: 1,
                    }}
                  >
                    AI INTERVIEW CENTER
                  </Typography>

                </Stack>


                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    mb: 1,

                    fontSize: {
                      xs: "1.8rem",
                      md: "2.4rem",
                    },
                  }}
                >
                  Become Interview-Ready
                </Typography>


                <Typography
                  sx={{
                    maxWidth: 720,
                    opacity: .92,
                    lineHeight: 1.7,
                  }}
                >
                  Practice realistic interviews using your
                  resume and skills. Use camera and voice,
                  answer naturally, and receive AI-powered
                  feedback after your interview.
                </Typography>

              </Box>


              <Button
                variant="contained"
                size="large"
                endIcon={
                  <ArrowForwardIcon />
                }
                onClick={
                  openInterviewCenter
                }
                sx={{
                  minWidth: 220,
                  py: 1.4,
                  px: 3,
                  borderRadius: 3,

                  backgroundColor: "white",
                  color: "#4f46e5",

                  fontWeight: 900,

                  "&:hover": {
                    backgroundColor:
                      "#f5f3ff",
                  },
                }}
              >
                Open Interview Center
              </Button>

            </Stack>


            {/* FEATURES */}

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{
                mt: 3,
              }}
            >

              {[
                "Resume Based",
                "AI Feedback",
                "Camera & Voice",
                "Personalized Questions",
              ].map(
                (item) => (

                  <Chip
                    key={item}
                    label={item}
                    sx={{
                      color: "white",

                      border:
                        "1px solid rgba(255,255,255,.35)",

                      backgroundColor:
                        "rgba(255,255,255,.12)",

                      fontWeight: 700,
                    }}
                  />

                )
              )}

            </Stack>

          </Box>


          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 4,
              },
            }}
          >

            {/* PRACTICE HEADER */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              spacing={2}
              sx={{
                mb: 3,
              }}
            >

              <Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Choose Your Practice
                </Typography>


                <Typography
                  color="text.secondary"
                  sx={{
                    mt: .5,
                  }}
                >
                  Select a practice area and continue to
                  the AI Interview Center.
                </Typography>

              </Box>

            </Stack>


            {/* PRACTICE CARDS */}

            <Grid
              container
              spacing={2.5}
            >

              {/* RESUME MOCK */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,

                    border:
                      "2px solid #6366f1",

                    boxShadow: "none",

                    position: "relative",

                    transition:
                      "all .25s ease",

                    "&:hover": {
                      transform:
                        "translateY(-5px)",

                      boxShadow:
                        "0 12px 28px rgba(79,70,229,.15)",
                    },
                  }}
                >

                  <Chip
                    label="Recommended"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,

                      fontWeight: 700,

                      backgroundColor:
                        "#eef2ff",

                      color:
                        "#4f46e5",
                    }}
                  />


                  <CardContent
                    sx={{
                      p: 2.5,
                    }}
                  >

                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor:
                          "#eef2ff",

                        color:
                          "#4f46e5",

                        mb: 2,
                      }}
                    >
                      <DescriptionIcon />
                    </Box>


                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      AI Resume Mock
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 90,
                        lineHeight: 1.6,
                        mb: 2,
                      }}
                    >
                      Practice questions generated
                      from your resume, skills,
                      education and experience.
                    </Typography>


                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={
                        <ArrowForwardIcon />
                      }
                      onClick={
                        openInterviewCenter
                      }
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        py: 1,
                      }}
                    >
                      Start Mock Interview
                    </Button>

                  </CardContent>

                </Card>

              </Grid>


              {/* TECHNICAL */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,

                    border:
                      "1px solid #e5e7eb",

                    boxShadow: "none",

                    transition:
                      "all .25s ease",

                    "&:hover": {
                      transform:
                        "translateY(-5px)",

                      boxShadow:
                        "0 10px 25px rgba(0,0,0,.08)",
                    },
                  }}
                >

                  <CardContent
                    sx={{
                      p: 2.5,
                    }}
                  >

                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor:
                          "#eef2ff",

                        color:
                          "#4f46e5",

                        mb: 2,
                      }}
                    >
                      <CodeIcon />
                    </Box>


                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      Technical Practice
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 90,
                        lineHeight: 1.6,
                        mb: 2,
                      }}
                    >
                      Practice technical questions
                      based on your skills and
                      target career role.
                    </Typography>


                    <Button
                      fullWidth
                      variant="outlined"
                      endIcon={
                        <ArrowForwardIcon />
                      }
                      onClick={
                        openInterviewCenter
                      }
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        py: 1,
                      }}
                    >
                      Start Practice
                    </Button>

                  </CardContent>

                </Card>

              </Grid>


              {/* HR */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,

                    border:
                      "1px solid #e5e7eb",

                    boxShadow: "none",

                    transition:
                      "all .25s ease",

                    "&:hover": {
                      transform:
                        "translateY(-5px)",

                      boxShadow:
                        "0 10px 25px rgba(0,0,0,.08)",
                    },
                  }}
                >

                  <CardContent
                    sx={{
                      p: 2.5,
                    }}
                  >

                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor:
                          "#ecfdf5",

                        color:
                          "#059669",

                        mb: 2,
                      }}
                    >
                      <WorkOutlineIcon />
                    </Box>


                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      HR Interview
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 90,
                        lineHeight: 1.6,
                        mb: 2,
                      }}
                    >
                      Practice common HR questions,
                      communication, motivation and
                      workplace situations.
                    </Typography>


                    <Button
                      fullWidth
                      variant="outlined"
                      endIcon={
                        <ArrowForwardIcon />
                      }
                      onClick={
                        openInterviewCenter
                      }
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        py: 1,
                      }}
                    >
                      Start Practice
                    </Button>

                  </CardContent>

                </Card>

              </Grid>


              {/* BEHAVIORAL */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,

                    border:
                      "1px solid #e5e7eb",

                    boxShadow: "none",

                    transition:
                      "all .25s ease",

                    "&:hover": {
                      transform:
                        "translateY(-5px)",

                      boxShadow:
                        "0 10px 25px rgba(0,0,0,.08)",
                    },
                  }}
                >

                  <CardContent
                    sx={{
                      p: 2.5,
                    }}
                  >

                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor:
                          "#fff7ed",

                        color:
                          "#ea580c",

                        mb: 2,
                      }}
                    >
                      <PsychologyIcon />
                    </Box>


                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      Behavioral Practice
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 90,
                        lineHeight: 1.6,
                        mb: 2,
                      }}
                    >
                      Improve answers for teamwork,
                      leadership, challenges and
                      real-world situations.
                    </Typography>


                    <Button
                      fullWidth
                      variant="outlined"
                      endIcon={
                        <ArrowForwardIcon />
                      }
                      onClick={
                        openInterviewCenter
                      }
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        py: 1,
                      }}
                    >
                      Start Practice
                    </Button>

                  </CardContent>

                </Card>

              </Grid>

            </Grid>


            <Divider
              sx={{
                my: 4,
              }}
            />


            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                mb: 2.5,
              }}
            >
              How Your AI Interview Works
            </Typography>


            <Grid
              container
              spacing={2}
            >

              {[
                {
                  number: "01",
                  title: "Choose Practice",
                  text:
                    "Select the interview type you want to practice.",
                },

                {
                  number: "02",
                  title: "Answer Naturally",
                  text:
                    "Use your camera and microphone to answer AI-generated questions.",
                },

                {
                  number: "03",
                  title: "Get Feedback",
                  text:
                    "Review your performance and identify areas to improve.",
                },
              ].map(
                (step) => (

                  <Grid
                    item
                    xs={12}
                    md={4}
                    key={step.number}
                  >

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,

                        background:
                          "#f8fafc",

                        border:
                          "1px solid #e5e7eb",
                      }}
                    >

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          color: "#6366f1",
                          mb: 1,
                        }}
                      >
                        {step.number}
                      </Typography>


                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 800,
                          mb: .5,
                        }}
                      >
                        {step.title}
                      </Typography>


                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                        }}
                      >
                        {step.text}
                      </Typography>

                    </Paper>

                  </Grid>

                )
              )}

            </Grid>

          </CardContent>

        </Card>
                {/* ================================================= */}
        {/* FINAL NEXT STEP */}
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
              justifyContent="space-between"
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


              <Button
                variant="contained"
                size="large"
                endIcon={
                  <ArrowForwardIcon />
                }
                onClick={
                  openInterviewCenter
                }
                sx={{
                  px: 3,
                  py: 1.3,
                  borderRadius: 3,

                  backgroundColor: "white",
                  color: "#1976d2",

                  fontWeight: 900,

                  "&:hover": {
                    backgroundColor:
                      "#f5f5f5",
                  },
                }}
              >
                Practice Interview
              </Button>

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