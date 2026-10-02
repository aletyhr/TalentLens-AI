import React from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

function ATSCard({
  atsScore,
  score,
  matchedSkills = [],
  missingSkills = [],
}) {
  // Support both prop names so the component remains compatible
  // with older parts of the project.
  const rawScore =
    atsScore !== undefined && atsScore !== null
      ? atsScore
      : score;

  const numericScore = Number(rawScore);

  const safeScore = Number.isNaN(numericScore)
    ? 0
    : Math.max(0, Math.min(100, numericScore));

  const getLabel = () => {
    if (safeScore >= 85) {
      return "Excellent ATS compatibility";
    }

    if (safeScore >= 70) {
      return "Strong ATS compatibility";
    }

    if (safeScore >= 50) {
      return "Moderate ATS compatibility";
    }

    return "Needs ATS improvement";
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 4,
        border: "1px solid #e5eaf2",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* HEADER */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2.5,
                backgroundColor: "#edf4ff",
                color: "#1976d2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUpRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 21,
                  fontWeight: 800,
                  color: "#172033",
                }}
              >
                ATS Score
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#7b8495",
                  mt: 0.3,
                }}
              >
                Applicant Tracking System compatibility
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={getLabel()}
            size="small"
            sx={{
              display: { xs: "none", sm: "flex" },
              backgroundColor:
                safeScore >= 70
                  ? "#eefaf4"
                  : "#fff7e9",
              color:
                safeScore >= 70
                  ? "#26733b"
                  : "#8a620c",
              fontWeight: 700,
            }}
          />
        </Stack>

        {/* SCORE */}
        <Box
          sx={{
            mt: 3,
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #f6f9ff, #ffffff)",
            border: "1px solid #edf1f7",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={3}
          >
            <Box
              sx={{
                minWidth: 150,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 48,
                  fontWeight: 850,
                  lineHeight: 1,
                  color: "#1976d2",
                }}
              >
                {Math.round(safeScore)}
                <Typography
                  component="span"
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#7b8495",
                    ml: 0.5,
                  }}
                >
                  %
                </Typography>
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#7b8495",
                  mt: 1,
                  fontWeight: 600,
                }}
              >
                ATS Compatibility
              </Typography>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#424c5e",
                  }}
                >
                  Overall Match
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    color: "#1976d2",
                  }}
                >
                  {Math.round(safeScore)}%
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={safeScore}
                sx={{
                  height: 10,
                  borderRadius: 10,
                  backgroundColor: "#e9eef6",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 10,
                  },
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#7d8798",
                  mt: 1.2,
                  lineHeight: 1.5,
                }}
              >
                The score represents how well the detected resume
                skills match the analyzed job requirements.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* SKILL BREAKDOWN */}
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 800,
              color: "#172033",
              mb: 1.5,
            }}
          >
            ATS Skill Breakdown
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            {/* MATCHED */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                backgroundColor: "#eefaf4",
                border: "1px solid #d9f0e2",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <CheckCircleRoundedIcon
                    sx={{
                      color: "#2e7d32",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#285e32",
                    }}
                  >
                    Matched
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontWeight: 850,
                    color: "#285e32",
                  }}
                >
                  {matchedSkills.length}
                </Typography>
              </Stack>
            </Box>

            {/* MISSING */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                backgroundColor: "#fff7e9",
                border: "1px solid #f2e2bd",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <WarningAmberRoundedIcon
                    sx={{
                      color: "#c17b00",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#76530f",
                    }}
                  >
                    Missing
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontWeight: 850,
                    color: "#76530f",
                  }}
                >
                  {missingSkills.length}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* SKILL LISTS */}
        {(matchedSkills.length > 0 ||
          missingSkills.length > 0) && (
          <>
            <Divider sx={{ my: 3 }} />

            {matchedSkills.length > 0 && (
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#697488",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  Matched Skills
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.8}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mt: 1 }}
                >
                  {matchedSkills.map((skill, index) => (
                    <Chip
                      key={`matched-${index}`}
                      label={skill}
                      size="small"
                      icon={
                        <CheckCircleRoundedIcon
                          sx={{ fontSize: 16 }}
                        />
                      }
                      sx={{
                        backgroundColor: "#eefaf4",
                        color: "#286237",
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {missingSkills.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#697488",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  Missing Skills
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.8}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mt: 1 }}
                >
                  {missingSkills.map((skill, index) => (
                    <Chip
                      key={`missing-${index}`}
                      label={skill}
                      size="small"
                      icon={
                        <WarningAmberRoundedIcon
                          sx={{ fontSize: 16 }}
                        />
                      }
                      sx={{
                        backgroundColor: "#fff7e9",
                        color: "#76530f",
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ATSCard;