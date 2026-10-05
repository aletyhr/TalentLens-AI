import React, { useEffect, useState } from "react";

import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

import {
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  EmojiEvents as EmojiEventsIcon,
  Group as GroupIcon,
  Psychology as PsychologyIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  ShowChart as ShowChartIcon,
  TrendingUp as TrendingUpIcon,
  WarningAmber as WarningAmberIcon,
  MilitaryTech as MilitaryTechIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import API from "../services/api";


// =====================================================
// HELPERS
// =====================================================

const safeNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, number)
  );
};


const formatScore = (value) => {
  const score = safeNumber(value);

  if (Number.isInteger(score)) {
    return `${score}%`;
  }

  return `${score.toFixed(2)}%`;
};


const getPerformanceLabel = (score) => {
  const value = safeNumber(score);

  if (value >= 80) {
    return "Excellent";
  }

  if (value >= 70) {
    return "Good";
  }

  if (value >= 50) {
    return "Needs Improvement";
  }

  return "Needs Attention";
};


const getPerformanceColor = (score) => {
  const value = safeNumber(score);

  if (value >= 80) {
    return "#16a34a";
  }

  if (value >= 70) {
    return "#2563eb";
  }

  if (value >= 50) {
    return "#f59e0b";
  }

  return "#dc2626";
};


// =====================================================
// PROGRESS CHART
// =====================================================

function ProgressChart({
  data,
  title,
  icon,
  emptyMessage,
}) {
  const chartWidth = 900;
  const chartHeight = 320;

  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 35;
  const paddingBottom = 55;

  const innerWidth =
    chartWidth -
    paddingLeft -
    paddingRight;

  const innerHeight =
    chartHeight -
    paddingTop -
    paddingBottom;


  if (!data || data.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          border:
            "1px solid #e2e8f0",
          borderRadius: 4,
          minHeight: 360,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              color: "#2563eb",
            }}
          >
            {icon}
          </Box>

          <Typography
            variant="h6"
            fontWeight={900}
            sx={{
              mb: 1,
            }}
          >
            {title}
          </Typography>

          <Typography
            color="text.secondary"
          >
            {emptyMessage}
          </Typography>
        </Box>
      </Paper>
    );
  }


  const points = data.map(
    (item, index) => {
      const value =
        safeNumber(item.value);

      const x =
        data.length === 1
          ? chartWidth / 2
          : paddingLeft +
            (
              index /
              (data.length - 1)
            ) *
            innerWidth;

      const y =
        paddingTop +
        (
          1 -
          value / 100
        ) *
        innerHeight;

      return {
        x,
        y,
        value,
        label:
          item.label ||
          `A${index + 1}`,
      };
    }
  );


  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${
          point.x
        } ${point.y}`
    )
    .join(" ");


  return (
    <Paper
      elevation={0}
      sx={{
        border:
          "1px solid #e2e8f0",
        borderRadius: 4,
        p: {
          xs: 2,
          md: 3,
        },
        backgroundColor:
          "#ffffff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            backgroundColor:
              "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2563eb",
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          fontWeight={900}
        >
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          height="320"
          role="img"
          aria-label={title}
        >

          {[0, 25, 50, 75, 100].map(
            (value) => {
              const y =
                paddingTop +
                (
                  1 -
                  value / 100
                ) *
                innerHeight;

              return (
                <g key={value}>

                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={
                      chartWidth -
                      paddingRight
                    }
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />

                  <text
                    x={
                      paddingLeft -
                      12
                    }
                    y={y + 5}
                    textAnchor="end"
                    fontSize="13"
                    fill="#64748b"
                  >
                    {value}
                  </text>

                </g>
              );
            }
          )}

          {points.length > 1 && (
            <path
              d={path}
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map(
            (point, index) => (
              <g key={index}>

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="4"
                />

                <text
                  x={point.x}
                  y={point.y - 16}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="#172033"
                >
                  {Math.round(
                    point.value
                  )}
                </text>

                <text
                  x={point.x}
                  y={
                    chartHeight -
                    20
                  }
                  textAnchor="middle"
                  fontSize="13"
                  fill="#64748b"
                >
                  {point.label}
                </text>

              </g>
            )
          )}

        </svg>
      </Box>
    </Paper>
  );
}


// =====================================================
// SCORE CARD
// =====================================================

function ScoreCard({
  title,
  score,
  subtitle,
  icon,
  loading,
}) {
  const value =
    safeNumber(score);

  const color =
    getPerformanceColor(value);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border:
          "1px solid #e2e8f0",
        transition:
          "all 0.2s ease",
        "&:hover": {
          transform:
            "translateY(-4px)",
          boxShadow:
            "0 14px 32px rgba(15,23,42,0.08)",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2.5,
              backgroundColor:
                "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>

          <Chip
            label={
              loading
                ? "Loading"
                : getPerformanceLabel(
                    value
                  )
            }
            size="small"
            sx={{
              fontWeight: 800,
              color: loading
                ? "#64748b"
                : color,
              backgroundColor:
                loading
                  ? "#f1f5f9"
                  : `${color}15`,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          fontWeight={800}
          sx={{
            color: "#64748b",
            mb: 1,
          }}
        >
          {title}
        </Typography>

        {loading ? (
          <CircularProgress
            size={30}
          />
        ) : (
          <Typography
            variant="h3"
            fontWeight={950}
            sx={{
              color: "#0f172a",
              lineHeight: 1,
              mb: 1.5,
            }}
          >
            {formatScore(value)}
          </Typography>
        )}

        <LinearProgress
          variant="determinate"
          value={
            loading
              ? 0
              : value
          }
          sx={{
            height: 8,
            borderRadius: 8,
            backgroundColor:
              "#e2e8f0",
            mb: 1.5,
            "& .MuiLinearProgress-bar":
              {
                borderRadius: 8,
                backgroundColor:
                  color,
              },
          }}
        />

        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Card>
  );
}


// =====================================================
// PROGRESS ROW
// =====================================================

function ProgressRow({
  label,
  value,
  notStarted,
}) {
  const score =
    safeNumber(value);

  return (
    <Box
      sx={{
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          fontWeight={800}
        >
          {label}
        </Typography>

        <Typography
          fontWeight={900}
        >
          {notStarted
            ? "Not Started"
            : formatScore(score)}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={
          notStarted
            ? 0
            : score
        }
        sx={{
          height: 10,
          borderRadius: 10,
          backgroundColor:
            "#e2e8f0",
          "& .MuiLinearProgress-bar":
            {
              borderRadius: 10,
              backgroundColor:
                getPerformanceColor(
                  score
                ),
            },
        }}
      />
    </Box>
  );
}


// =====================================================
// ANALYTICS PAGE
// =====================================================

function Analytics() {
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ===================================================
  // LOAD ANALYTICS
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const loadAnalytics =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await API.get(
              "/analytics"
            );

          if (!mounted) {
            return;
          }

          if (
            response.data &&
            response.data.success
          ) {
            setAnalytics(
              response.data
            );
          } else {
            setError(
              response.data?.message ||
              "Unable to load analytics."
            );
          }
        } catch (
          requestError
        ) {
          console.error(
            "Analytics loading error:",
            requestError
          );

          if (!mounted) {
            return;
          }

          if (
            requestError.response
              ?.status === 401
          ) {
            setError(
              "Your session has expired. Please login again."
            );
          } else {
            setError(
              requestError.response
                ?.data?.message ||
              "Unable to load analytics."
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight:
            "calc(100vh - 70px)",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          backgroundColor:
            "#f8fafc",
        }}
      >
        <Box
          sx={{
            textAlign:
              "center",
          }}
        >
          <CircularProgress
            size={50}
          />

          <Typography
            sx={{
              mt: 2,
              fontWeight: 700,
              color: "#475569",
            }}
          >
            Loading your career
            analytics...
          </Typography>
        </Box>
      </Box>
    );
  }


  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            border:
              "1px solid #fecaca",
            backgroundColor:
              "#fff7f7",
            textAlign:
              "center",
          }}
        >
          <WarningAmberIcon
            sx={{
              fontSize: 55,
              color: "#dc2626",
              mb: 2,
            }}
          />

          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              mb: 1,
            }}
          >
            Unable to load analytics
          </Typography>

          <Typography
            color="text.secondary"
          >
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }


  // ===================================================
  // SAFE DATA
  // ===================================================

  const overview =
    analytics?.overview || {};

  const resume =
    analytics?.resume || {};

  const interview =
    analytics?.interview || {};

  const skills =
    analytics?.skills || {};

  const careerReadiness =
    analytics?.career_readiness ||
    {};


  const careerScore =
    safeNumber(
      overview.career_readiness
    );

  const resumeScore =
    safeNumber(
      overview.resume_score
    );

  const interviewScore =
    overview.interview_score ===
      null ||
    overview.interview_score ===
      undefined
      ? 0
      : safeNumber(
          overview.interview_score
        );

  const profileScore =
    safeNumber(
      overview.profile_completeness
    );


  // ===================================================
  // COUNTS
  // ===================================================

  const resumeAnalysisCount =
    Number(
      overview.resume_analyses || 0
    );

  const interviewCount =
    Number(
      overview.interviews_completed ||
      0
    );


  const bestResumeScore =
    safeNumber(
      overview.best_resume_score ??
      resume.best_score ??
      0
    );

  const bestInterviewScore =
    safeNumber(
      overview.best_interview_score ??
      interview.best_score ??
      0
    );


  // ===================================================
  // RESUME HISTORY
  // ===================================================

  const resumeHistory =
    Array.isArray(
      resume.history
    )
      ? resume.history
      : [];


  const resumeChartData =
    resumeHistory.map(
      (item, index) => ({
        value:
          safeNumber(
            item.overall_score
          ),
        label:
          `A${index + 1}`,
      })
    );


  // ===================================================
  // INTERVIEW HISTORY
  // ===================================================

  const interviewHistory =
    Array.isArray(
      interview.history
    )
      ? interview.history
      : [];


  const interviewChartData =
    interviewHistory.map(
      (item, index) => ({
        value:
          safeNumber(
            item.overall_score
          ),
        label:
          `A${index + 1}`,
      })
    );


  // ===================================================
  // CAREER READINESS HISTORY
  // ===================================================

  const backendCareerHistory =
    Array.isArray(
      analytics?.career_readiness_history
    )
      ? analytics.career_readiness_history
      : Array.isArray(
          careerReadiness.history
        )
        ? careerReadiness.history
        : [];


  const careerChartData =
    backendCareerHistory.length > 0
      ? backendCareerHistory.map(
          (item, index) => ({
            value:
              safeNumber(
                item.career_readiness ??
                item.score ??
                item.value
              ),
            label:
              `A${index + 1}`,
          })
        )
      : resumeHistory.map(
          (item, index) => ({
            value:
              Math.min(
                100,
                Math.max(
                  0,
                  safeNumber(
                    item.overall_score
                  ) *
                    0.70 +
                  profileScore *
                    0.30
                )
              ),
            label:
              `A${index + 1}`,
          })
        );


  // ===================================================
  // SKILLS
  // ===================================================

  const currentSkills =
    Array.isArray(
      skills.current
    )
      ? skills.current
      : [];

  const skillsToImprove =
    Array.isArray(
      skills.missing
    )
      ? skills.missing
      : [];


  // ===================================================
  // SUMMARY
  // ===================================================

  let progressSummary =
    "Continue analyzing your resume and completing AI interviews to build a stronger career profile.";

  if (careerScore >= 80) {
    progressSummary =
      "Your career profile is performing strongly. Continue practicing interviews and improving your resume to maintain your progress.";
  } else if (
    careerScore >= 70
  ) {
    progressSummary =
      "Your career profile is progressing well. Focus on your weaker areas and practice interviews regularly.";
  } else if (
    careerScore >= 50
  ) {
    progressSummary =
      "You have a good foundation, but there are clear areas to improve. Strengthen your resume and continue interview practice.";
  } else {
    progressSummary =
      "You are building your career profile. Start by strengthening your resume and completing AI interview practice.";
  }


  // ===================================================
  // PAGE
  // ===================================================

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 70px)",
        backgroundColor:
          "#f8fafc",
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >

      <Container
        maxWidth="xl"
      >

        {/* =========================================
            HERO
        ========================================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            p: {
              xs: 3,
              md: 5,
            },
            mb: 5,
            color: "#ffffff",
            background:
              "linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#2563eb 100%)",
            position:
              "relative",
            overflow:
              "hidden",
          }}
        >

          <Box
            sx={{
              position:
                "absolute",
              width: 300,
              height: 300,
              borderRadius:
                "50%",
              backgroundColor:
                "rgba(255,255,255,0.05)",
              right: -100,
              top: -120,
            }}
          />

          <Box
            sx={{
              position:
                "absolute",
              width: 180,
              height: 180,
              borderRadius:
                "50%",
              backgroundColor:
                "rgba(255,255,255,0.04)",
              left: -80,
              bottom: -100,
            }}
          />

          <Box
            sx={{
              position:
                "relative",
              zIndex: 1,
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 1,
                mb: 2,
              }}
            >

              <AnalyticsIcon />

              <Typography
                variant="overline"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 1.4,
                  color:
                    "rgba(255,255,255,0.75)",
                }}
              >
                PERFORMANCE DASHBOARD
              </Typography>

            </Box>


            <Grid
              container
              spacing={4}
              alignItems="center"
            >

              <Grid
                item
                xs={12}
                md={8}
              >

                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 2,
                  }}
                >

                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 3,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      backgroundColor:
                        "rgba(255,255,255,0.12)",
                      border:
                        "1px solid rgba(255,255,255,0.16)",
                    }}
                  >
                    <AnalyticsIcon
                      sx={{
                        fontSize: 38,
                      }}
                    />
                  </Box>

                  <Box>

                    <Typography
                      variant="h3"
                      fontWeight={950}
                      sx={{
                        fontSize: {
                          xs: "2rem",
                          md: "3rem",
                        },
                        lineHeight: 1.1,
                      }}
                    >
                      Career Analytics
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1,
                        maxWidth: 700,
                        color:
                          "rgba(255,255,255,0.78)",
                        lineHeight: 1.7,
                      }}
                    >
                      Track your resume performance,
                      interview progress and overall
                      career readiness over time.
                    </Typography>

                  </Box>

                </Box>

              </Grid>


              <Grid
                item
                xs={12}
                md={4}
              >

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    backgroundColor:
                      "rgba(255,255,255,0.09)",
                    border:
                      "1px solid rgba(255,255,255,0.12)",
                    textAlign:
                      "center",
                  }}
                >

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: 1,
                      color:
                        "rgba(255,255,255,0.65)",
                    }}
                  >
                    CURRENT READINESS
                  </Typography>

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      alignItems:
                        "baseline",
                      mt: 0.5,
                    }}
                  >

                    <Typography
                      variant="h2"
                      fontWeight={950}
                    >
                      {careerScore.toFixed(
                        1
                      )}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        ml: 0.5,
                        color:
                          "rgba(255,255,255,0.7)",
                      }}
                    >
                      %
                    </Typography>

                  </Box>

                  <Chip
                    label={getPerformanceLabel(
                      careerScore
                    )}
                    size="small"
                    sx={{
                      mt: 1,
                      fontWeight: 900,
                      color:
                        "#ffffff",
                      backgroundColor:
                        "rgba(255,255,255,0.14)",
                    }}
                  />

                </Box>

              </Grid>

            </Grid>

          </Box>

        </Paper>


        {/* =========================================
            PERFORMANCE OVERVIEW
        ========================================= */}

        <Box sx={{ mb: 5 }}>

          <Box sx={{ mb: 2.5 }}>

            <Typography
              variant="h5"
              fontWeight={950}
              sx={{
                color: "#0f172a",
              }}
            >
              Performance Overview
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mt: 0.5,
              }}
            >
              Your latest career-readiness indicators.
            </Typography>

          </Box>


          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <ScoreCard
                title="Career Readiness"
                score={careerScore}
                subtitle="Overall job-readiness indicator."
                icon={
                  <TrendingUpIcon />
                }
              />
            </Grid>


            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <ScoreCard
                title="Resume Score"
                score={resumeScore}
                subtitle="Current resume quality score."
                icon={
                  <DescriptionIcon />
                }
              />
            </Grid>


            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <ScoreCard
                title="Interview Score"
                score={interviewScore}
                subtitle={
                  interviewCount > 0
                    ? "Latest interview performance."
                    : "Complete an interview to measure this."
                }
                icon={
                  <RecordVoiceOverIcon />
                }
              />
            </Grid>


            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <ScoreCard
                title="Profile Completeness"
                score={profileScore}
                subtitle="Completeness of your professional profile."
                icon={
                  <PersonIcon />
                }
              />
            </Grid>

          </Grid>

        </Box>


        {/* =========================================
            CAREER READINESS BREAKDOWN
        ========================================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border:
              "1px solid #e2e8f0",
            overflow: "hidden",
            mb: 5,
          }}
        >

          <Box
            sx={{
              px: {
                xs: 2.5,
                md: 3.5,
              },
              py: 2.5,
              borderBottom:
                "1px solid #e2e8f0",
              background:
                "#f8fafc",
            }}
          >

            <Box
              sx={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 1.5,
              }}
            >

              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2.5,
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  backgroundColor:
                    "#eff6ff",
                  color:
                    "#2563eb",
                }}
              >
                <TrendingUpIcon />
              </Box>

              <Box>

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  Career Readiness Breakdown
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Understand the main areas contributing
                  to your current readiness.
                </Typography>

              </Box>

            </Box>

          </Box>


          <Box
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
          >

            <Grid
              container
              spacing={3}
            >

              <Grid
                item
                xs={12}
                md={6}
              >

                <ProgressRow
                  label="Resume Score"
                  value={
                    careerReadiness.resume ??
                    resumeScore
                  }
                />

                <ProgressRow
                  label="Interview Performance"
                  value={
                    careerReadiness.interview ??
                    interviewScore
                  }
                  notStarted={
                    !interview.has_history &&
                    interviewCount === 0
                  }
                />

              </Grid>


              <Grid
                item
                xs={12}
                md={6}
              >

                <ProgressRow
                  label="Profile Completeness"
                  value={
                    careerReadiness.profile ??
                    profileScore
                  }
                />

                <ProgressRow
                  label="Career Readiness"
                  value={
                    careerReadiness.score ??
                    careerScore
                  }
                />

              </Grid>

            </Grid>


            <Divider
              sx={{
                my: 2.5,
              }}
            />


            <Box
              sx={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 1.5,
                flexWrap:
                  "wrap",
              }}
            >

              <EmojiEventsIcon
                sx={{
                  color:
                    "#2563eb",
                }}
              />

              <Typography
                fontWeight={900}
              >
                Current Career Readiness:
              </Typography>

              <Chip
                label={`${formatScore(
                  careerScore
                )} — ${getPerformanceLabel(
                  careerScore
                )}`}
                sx={{
                  fontWeight: 900,
                  color: "#ffffff",
                  backgroundColor:
                    getPerformanceColor(
                      careerScore
                    ),
                }}
              />

            </Box>

          </Box>

        </Paper>


        {/* =========================================
            CAREER READINESS TREND
        ========================================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border:
              "1px solid #e2e8f0",
            overflow: "hidden",
            mb: 5,
          }}
        >

          <Box
            sx={{
              px: {
                xs: 2.5,
                md: 3.5,
              },
              py: 2.5,
              borderBottom:
                "1px solid #e2e8f0",
              background:
                "#f8fafc",
            }}
          >

            <Box
              sx={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 1.5,
              }}
            >

              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2.5,
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  backgroundColor:
                    "#f0fdf4",
                  color:
                    "#16a34a",
                }}
              >
                <ShowChartIcon />
              </Box>

              <Box>

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  Career Readiness Trend
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Track how your overall career readiness
                  has changed over time.
                </Typography>

              </Box>

            </Box>

          </Box>


          <Box
            sx={{
              p: {
                xs: 2,
                md: 3.5,
              },
            }}
          >

            <ProgressChart
              data={
                careerChartData
              }
              title="Career Readiness Progress"
              icon={
                <ShowChartIcon />
              }
              emptyMessage="Complete more assessments to build your career-readiness history."
            />

          </Box>

        </Paper>


        {/* =========================================
            RESUME PROGRESS
        ========================================= */}

        <Box sx={{ mb: 5 }}>

          <Typography
            variant="h5"
            fontWeight={950}
            sx={{
              mb: 2.5,
            }}
          >
            Resume Progress
          </Typography>


          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              xs={12}
              lg={8}
            >

              <ProgressChart
                data={
                  resumeChartData
                }
                title="Resume Score History"
                icon={
                  <DescriptionIcon />
                }
                emptyMessage="Analyze your resume to start tracking resume performance."
              />

            </Grid>


            <Grid
              item
              xs={12}
              lg={4}
            >

              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: 4,
                  p: 3,
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{
                    mb: 3,
                  }}
                >
                  Resume Performance
                </Typography>


                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Current Score
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={950}
                  sx={{
                    mt: 0.5,
                    mb: 2.5,
                  }}
                >
                  {formatScore(
                    resumeScore
                  )}
                </Typography>


                <Divider
                  sx={{
                    mb: 2.5,
                  }}
                />


                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Best Score
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{
                    mt: 0.5,
                    mb: 2.5,
                    color:
                      "#2563eb",
                  }}
                >
                  {formatScore(
                    bestResumeScore
                  )}
                </Typography>


                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Analyses Completed
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {resumeAnalysisCount}
                </Typography>

              </Paper>

            </Grid>

          </Grid>

        </Box>


        {/* =========================================
            INTERVIEW PROGRESS
        ========================================= */}

        <Box sx={{ mb: 5 }}>

          <Typography
            variant="h5"
            fontWeight={950}
            sx={{
              mb: 2.5,
            }}
          >
            Interview Performance
          </Typography>


          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              xs={12}
              lg={8}
            >

              <ProgressChart
                data={
                  interviewChartData
                }
                title="Interview Score History"
                icon={
                  <RecordVoiceOverIcon />
                }
                emptyMessage="Complete AI interviews to start tracking interview performance."
              />

            </Grid>


            <Grid
              item
              xs={12}
              lg={4}
            >

              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: 4,
                  p: 3,
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{
                    mb: 3,
                  }}
                >
                  Interview Performance
                </Typography>


                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Current Score
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={950}
                  sx={{
                    mt: 0.5,
                    mb: 2.5,
                  }}
                >
                  {formatScore(
                    interviewScore
                  )}
                </Typography>


                <Divider
                  sx={{
                    mb: 2.5,
                  }}
                />


                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Best Score
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{
                    mt: 0.5,
                    mb: 2.5,
                    color:
                      "#7c3aed",
                  }}
                >
                  {formatScore(
                    bestInterviewScore
                  )}
                </Typography>


                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Interviews Completed
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {interviewCount}
                </Typography>

              </Paper>

            </Grid>

          </Grid>

        </Box>


        {/* =========================================
            SKILL DEVELOPMENT
        ========================================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border:
              "1px solid #e2e8f0",
            overflow: "hidden",
            mb: 5,
          }}
        >

          <Box
            sx={{
              px: {
                xs: 2.5,
                md: 3.5,
              },
              py: 2.5,
              borderBottom:
                "1px solid #e2e8f0",
              background:
                "#f8fafc",
            }}
          >

            <Box
              sx={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 1.5,
              }}
            >

              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2.5,
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  backgroundColor:
                    "#fff7ed",
                  color:
                    "#ea580c",
                }}
              >
                <PsychologyIcon />
              </Box>

              <Box>

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  Skill Development
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Review your current strengths and identify
                  skills that need improvement.
                </Typography>

              </Box>

            </Box>

          </Box>


          <Box
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
          >

            <Grid
              container
              spacing={3}
            >

              <Grid
                item
                xs={12}
                md={6}
              >

                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 3,
                    border:
                      "1px solid #dcfce7",
                    background:
                      "linear-gradient(135deg,#f0fdf4,#ffffff)",
                  }}
                >

                  <Box
                    sx={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      mb: 2,
                    }}
                  >

                    <Box>

                      <Typography
                        variant="subtitle1"
                        fontWeight={900}
                        sx={{
                          color:
                            "#166534",
                        }}
                      >
                        Current Skills
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Skills identified from your profile.
                      </Typography>

                    </Box>

                    <Chip
                      label={
                        currentSkills.length
                      }
                      size="small"
                      sx={{
                        fontWeight: 900,
                        backgroundColor:
                          "#dcfce7",
                        color:
                          "#166534",
                      }}
                    />

                  </Box>


                  {currentSkills.length >
                  0 ? (
                    <Box
                      sx={{
                        display:
                          "flex",
                        flexWrap:
                          "wrap",
                        gap: 1,
                      }}
                    >

                      {currentSkills.map(
                        (
                          skill,
                          index
                        ) => (
                          <Chip
                            key={`${skill}-${index}`}
                            label={skill}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 700,
                              backgroundColor:
                                "#ffffff",
                              border:
                                "1px solid #bbf7d0",
                              color:
                                "#166534",
                            }}
                          />
                        )
                      )}

                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No current skills are available.
                    </Typography>
                  )}

                </Paper>

              </Grid>


              <Grid
                item
                xs={12}
                md={6}
              >

                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 3,
                    border:
                      "1px solid #fee2e2",
                    background:
                      "linear-gradient(135deg,#fff7f7,#ffffff)",
                  }}
                >

                  <Box
                    sx={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      mb: 2,
                    }}
                  >

                    <Box>

                      <Typography
                        variant="subtitle1"
                        fontWeight={900}
                        sx={{
                          color:
                            "#b91c1c",
                        }}
                      >
                        Skills to Improve
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Skills that may strengthen your profile.
                      </Typography>

                    </Box>

                    <Chip
                      label={
                        skillsToImprove.length
                      }
                      size="small"
                      sx={{
                        fontWeight: 900,
                        backgroundColor:
                          "#fee2e2",
                        color:
                          "#b91c1c",
                      }}
                    />

                  </Box>


                  {skillsToImprove.length >
                  0 ? (
                    <Box
                      sx={{
                        display:
                          "flex",
                        flexWrap:
                          "wrap",
                        gap: 1,
                      }}
                    >

                      {skillsToImprove.map(
                        (
                          skill,
                          index
                        ) => (
                          <Chip
                            key={`${skill}-${index}`}
                            label={skill}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 700,
                              backgroundColor:
                                "#ffffff",
                              border:
                                "1px solid #fecaca",
                              color:
                                "#991b1b",
                            }}
                          />
                        )
                      )}

                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No major skill gaps are currently available.
                    </Typography>
                  )}

                </Paper>

              </Grid>

            </Grid>

          </Box>

        </Paper>


        {/* =========================================
            ASSESSMENT STATISTICS
        ========================================= */}

        <Box sx={{ mb: 5 }}>

          <Typography
            variant="h5"
            fontWeight={950}
            sx={{
              mb: 2.5,
            }}
          >
            Assessment Statistics
          </Typography>


          <Grid
            container
            spacing={2.5}
          >

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <StatCard
                icon={
                  <DescriptionIcon />
                }
                label="Resume Analyses"
                value={
                  resumeAnalysisCount
                }
                color="#2563eb"
                background="#eff6ff"
              />
            </Grid>


            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <StatCard
                icon={
                  <RecordVoiceOverIcon />
                }
                label="Interviews"
                value={
                  interviewCount
                }
                color="#7c3aed"
                background="#f5f3ff"
              />
            </Grid>


            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <StatCard
                icon={
                  <EmojiEventsIcon />
                }
                label="Best Resume Score"
                value={
                  formatScore(
                    bestResumeScore
                  )
                }
                color="#16a34a"
                background="#f0fdf4"
              />
            </Grid>


            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <StatCard
                icon={
                  <MilitaryTechIcon />
                }
                label="Best Interview Score"
                value={
                  formatScore(
                    bestInterviewScore
                  )
                }
                color="#ea580c"
                background="#fff7ed"
              />
            </Grid>

          </Grid>

        </Box>


        {/* =========================================
            PROGRESS SUMMARY
        ========================================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            mb: 5,
            overflow:
              "hidden",
            position:
              "relative",
            color: "#ffffff",
            background:
              "linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#2563eb 100%)",
          }}
        >

          <Box
            sx={{
              position:
                "absolute",
              width: 220,
              height: 220,
              borderRadius:
                "50%",
              backgroundColor:
                "rgba(255,255,255,0.05)",
              right: -70,
              top: -90,
            }}
          />

          <Box
            sx={{
              position:
                "relative",
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            <Box
              sx={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 1.5,
                mb: 2.5,
              }}
            >

              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  backgroundColor:
                    "rgba(255,255,255,0.12)",
                }}
              >
                <AutoAwesomeIcon />
              </Box>

              <Box>

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  Progress Summary
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "rgba(255,255,255,0.7)",
                  }}
                >
                  A quick interpretation of your current
                  career-readiness position.
                </Typography>

              </Box>

            </Box>


            <Typography
              sx={{
                maxWidth: 950,
                lineHeight: 1.9,
                color:
                  "rgba(255,255,255,0.9)",
              }}
            >
              {progressSummary}
            </Typography>


            <Grid
              container
              spacing={2}
              sx={{
                mt: 2,
              }}
            >

              <Grid
                item
                xs={12}
                sm={4}
              >
                <SummaryMetric
                  label="READINESS"
                  value={
                    formatScore(
                      careerScore
                    )
                  }
                />
              </Grid>


              <Grid
                item
                xs={12}
                sm={4}
              >
                <SummaryMetric
                  label="RESUME"
                  value={
                    formatScore(
                      resumeScore
                    )
                  }
                />
              </Grid>


              <Grid
                item
                xs={12}
                sm={4}
              >
                <SummaryMetric
                  label="INTERVIEW"
                  value={
                    interviewCount >
                    0
                      ? formatScore(
                          interviewScore
                        )
                      : "Not Started"
                  }
                />
              </Grid>

            </Grid>

          </Box>

        </Paper>


        {/* =========================================
            FOOTER
        ========================================= */}

        <Box
          sx={{
            textAlign:
              "center",
            py: 3,
          }}
        >

          <Typography
            fontWeight={900}
            sx={{
              mb: 0.5,
              color:
                "#334155",
            }}
          >
            TalentLens AI
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Track your progress. Improve your readiness.
            Prepare with confidence.
          </Typography>

        </Box>

      </Container>

    </Box>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  label,
  value,
  color,
  background,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: 2.5,
        borderRadius: 3,
        border:
          "1px solid #e2e8f0",
        transition:
          "all 0.2s ease",
        "&:hover": {
          transform:
            "translateY(-3px)",
          boxShadow:
            "0 10px 25px rgba(15,23,42,0.07)",
        },
      }}
    >

      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          backgroundColor:
            background,
          color,
          mb: 1.8,
        }}
      >
        {icon}
      </Box>


      <Typography
        variant="caption"
        sx={{
          color: "#64748b",
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        {label.toUpperCase()}
      </Typography>


      <Typography
        variant="h4"
        fontWeight={950}
        sx={{
          color:
            "#0f172a",
          mt: 0.5,
        }}
      >
        {value}
      </Typography>

    </Paper>
  );
}


// =====================================================
// SUMMARY METRIC
// =====================================================

function SummaryMetric({
  label,
  value,
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor:
          "rgba(255,255,255,0.08)",
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >

      <Typography
        variant="caption"
        sx={{
          color:
            "rgba(255,255,255,0.62)",
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="h5"
        fontWeight={950}
        sx={{
          mt: 0.4,
        }}
      >
        {value}
      </Typography>

    </Box>
  );
}


export default Analytics;