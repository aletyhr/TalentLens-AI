import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Box,
  Divider,
  Stack,
  Button,
  Collapse,
  Paper,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [interviewHistory, setInterviewHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [interviewLoading, setInterviewLoading] = useState(true);

  const [expandedInterview, setExpandedInterview] =
    useState(null);


  // =========================================================
  // LOAD RESUME HISTORY
  // =========================================================

  useEffect(() => {
    fetchResumeHistory();
    fetchInterviewHistory();
  }, []);


  const fetchResumeHistory = async () => {
    try {
      const res = await API.get("/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Resume history error:", err);
      alert("Unable to load resume history");
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // LOAD AI INTERVIEW HISTORY
  // =========================================================

  const fetchInterviewHistory = async () => {
    try {
      const res = await API.get("/interview_history");

      setInterviewHistory(res.data);
    } catch (err) {
      console.error("Interview history error:", err);

      // Don't show an alert here because resume history
      // should still work if interview history has a problem.
    } finally {
      setInterviewLoading(false);
    }
  };


  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleString();
    } catch (error) {
      return "Date unavailable";
    }
  };


  // =========================================================
  // TOGGLE INTERVIEW DETAILS
  // =========================================================

  const toggleInterview = (index) => {
    setExpandedInterview(
      expandedInterview === index ? null : index
    );
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading || interviewLoading) {
    return (
      <Box
        sx={{
          mt: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 5,
        mb: 7,
      }}
    >

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Box
        sx={{
          textAlign: "center",
          mb: 6,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
        >
          📚 My History
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 700,
            mx: "auto",
          }}
        >
          View your previously analyzed resumes and
          completed AI mock interviews.
        </Typography>
      </Box>


      {/* =====================================================
          RESUME HISTORY
      ===================================================== */}

      <Box sx={{ mb: 7 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <DescriptionIcon color="primary" />

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Resume Analysis History
          </Typography>
        </Stack>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Your previously analyzed resumes and their
          AI-generated results.
        </Typography>


        <Grid container spacing={3}>

          {history.length === 0 ? (
            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                }}
              >
                <Typography color="text.secondary">
                  No resume history found.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            history.map((item, index) => (

              <Grid
                item
                xs={12}
                md={6}
                key={index}
              >

                <Card
                  elevation={5}
                  sx={{
                    borderRadius: 4,
                    height: "100%",
                  }}
                >

                  <CardContent>

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                    >
                      📄 {item.filename}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />


                    {/* ATS SCORE */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography fontWeight="bold">
                        ATS Score
                      </Typography>

                      <Chip
                        label={`${item.ats_score}%`}
                        color="primary"
                      />
                    </Stack>


                    {/* SEMANTIC SCORE */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography fontWeight="bold">
                        Semantic Score
                      </Typography>

                      <Chip
                        label={`${item.semantic_score}%`}
                        color="secondary"
                      />
                    </Stack>


                    {/* RESUME GRADE */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography fontWeight="bold">
                        Resume Grade
                      </Typography>

                      <Chip
                        label={item.resume_grade}
                        color="success"
                      />
                    </Stack>


                    {/* OVERALL SCORE */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography fontWeight="bold">
                        Overall Score
                      </Typography>

                      <Chip
                        label={item.overall_score}
                        color="warning"
                      />
                    </Stack>


                    <Divider sx={{ my: 2 }} />


                    {/* PREDICTED ROLE */}

                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      💼 Predicted Role
                    </Typography>

                    <Typography
                      color="primary"
                      mb={2}
                    >
                      {item.predicted_role}
                    </Typography>


                    {/* SKILLS */}

                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      🚀 Skills
                    </Typography>

                    <Box>
                      {item.skills &&
                        item.skills.map(
                          (skill, i) => (
                            <Chip
                              key={i}
                              label={skill}
                              sx={{
                                mr: 1,
                                mb: 1,
                              }}
                            />
                          )
                        )}
                    </Box>

                  </CardContent>
                </Card>

              </Grid>
            ))
          )}

        </Grid>
      </Box>


      {/* =====================================================
          AI INTERVIEW HISTORY
      ===================================================== */}

      <Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <SmartToyIcon color="secondary" />

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            AI Interview History
          </Typography>
        </Stack>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Review your previous AI mock interviews,
          answers and AI feedback.
        </Typography>


        <Grid container spacing={3}>

          {interviewHistory.length === 0 ? (

            <Grid item xs={12}>

              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                }}
              >
                <SmartToyIcon
                  sx={{
                    fontSize: 45,
                    mb: 1,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  No AI interviews yet
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Complete an AI mock interview to
                  see your results here.
                </Typography>
              </Paper>

            </Grid>

          ) : (

            interviewHistory.map(
              (interview, index) => (

                <Grid
                  item
                  xs={12}
                  key={index}
                >

                  <Card
                    elevation={5}
                    sx={{
                      borderRadius: 4,
                    }}
                  >

                    <CardContent>

                      {/* INTERVIEW HEADER */}

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
                      >

                        <Box>

                          <Typography
                            variant="h6"
                            fontWeight="bold"
                          >
                            🤖 {interview.role}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {formatDate(
                              interview.created_at
                            )}
                          </Typography>

                        </Box>


                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                        >

                          <Chip
                            label={`Score: ${
                              interview.overall_score
                            }`}
                            color="success"
                          />

                          <Chip
                            label={`Questions: ${
                              interview.total_questions
                            }`}
                            color="primary"
                          />

                        </Stack>

                      </Stack>


                      <Divider sx={{ my: 2 }} />


                      {/* VIEW DETAILS BUTTON */}

                      <Button
                        variant="outlined"
                        startIcon={
                          <ExpandMoreIcon
                            sx={{
                              transform:
                                expandedInterview ===
                                index
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              transition:
                                "0.2s",
                            }}
                          />
                        }
                        onClick={() =>
                          toggleInterview(index)
                        }
                      >
                        {expandedInterview === index
                          ? "Hide Interview Details"
                          : "View Interview Details"}
                      </Button>


                      {/* DETAILS */}

                      <Collapse
                        in={
                          expandedInterview ===
                          index
                        }
                      >

                        <Box sx={{ mt: 3 }}>

                          {interview.results &&
                          interview.results.length >
                            0 ? (

                            <Stack spacing={2}>

                              {interview.results.map(
                                (result, resultIndex) => (

                                  <Paper
                                    key={
                                      resultIndex
                                    }
                                    variant="outlined"
                                    sx={{
                                      p: 3,
                                      borderRadius: 3,
                                    }}
                                  >

                                    {/* QUESTION */}

                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                      sx={{
                                        mb: 1,
                                      }}
                                    >

                                      <Chip
                                        label={`Question ${
                                          resultIndex +
                                          1
                                        }`}
                                        size="small"
                                        color="primary"
                                      />

                                    </Stack>


                                    <Typography
                                      fontWeight="bold"
                                      sx={{
                                        mb: 2,
                                      }}
                                    >
                                      {result.question}
                                    </Typography>


                                    {/* ANSWER */}

                                    <Box
                                      sx={{
                                        p: 2,
                                        mb: 2,
                                        borderRadius: 2,
                                        backgroundColor:
                                          "#f8fafc",
                                      }}
                                    >

                                      <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        sx={{
                                          mb: 0.5,
                                        }}
                                      >
                                        👤 Your Answer
                                      </Typography>

                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                          whiteSpace:
                                            "pre-wrap",
                                        }}
                                      >
                                        {result.answer ||
                                          "No answer recorded."}
                                      </Typography>

                                    </Box>


                                    {/* AI EVALUATION */}

                                    {result.evaluation && (

                                      <Box
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          backgroundColor:
                                            "#f1f5f9",
                                        }}
                                      >

                                        <Stack
                                          direction={{
                                            xs: "column",
                                            sm: "row",
                                          }}
                                          justifyContent="space-between"
                                          spacing={1}
                                          sx={{
                                            mb: 1,
                                          }}
                                        >

                                          <Typography
                                            variant="subtitle2"
                                            fontWeight="bold"
                                          >
                                            🤖 AI Evaluation
                                          </Typography>

                                          {result
                                            .evaluation
                                            .score !==
                                            undefined && (
                                            <Chip
                                              label={`Score: ${
                                                result
                                                  .evaluation
                                                  .score
                                              }`}
                                              size="small"
                                              color="success"
                                            />
                                          )}

                                        </Stack>


                                        {result.evaluation
                                          .feedback && (
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              mb: 1,
                                            }}
                                          >
                                            {
                                              result
                                                .evaluation
                                                .feedback
                                            }
                                          </Typography>
                                        )}


                                        {result.evaluation
                                          .suggestion && (
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            <strong>
                                              Suggestion:
                                            </strong>{" "}
                                            {
                                              result
                                                .evaluation
                                                .suggestion
                                            }
                                          </Typography>
                                        )}


                                        {result.evaluation
                                          .strengths && (
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              mt: 1,
                                            }}
                                          >
                                            <strong>
                                              Strengths:
                                            </strong>{" "}
                                            {Array.isArray(
                                              result
                                                .evaluation
                                                .strengths
                                            )
                                              ? result.evaluation.strengths.join(
                                                  ", "
                                                )
                                              : result
                                                  .evaluation
                                                  .strengths}
                                          </Typography>
                                        )}


                                        {result.evaluation
                                          .improvements && (
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              mt: 1,
                                            }}
                                          >
                                            <strong>
                                              Improvements:
                                            </strong>{" "}
                                            {Array.isArray(
                                              result
                                                .evaluation
                                                .improvements
                                            )
                                              ? result.evaluation.improvements.join(
                                                  ", "
                                                )
                                              : result
                                                  .evaluation
                                                  .improvements}
                                          </Typography>
                                        )}

                                      </Box>

                                    )}

                                  </Paper>

                                )
                              )}

                            </Stack>

                          ) : (

                            <Typography
                              color="text.secondary"
                            >
                              No detailed results
                              available for this
                              interview.
                            </Typography>

                          )}

                        </Box>

                      </Collapse>

                    </CardContent>

                  </Card>

                </Grid>

              )
            )

          )}

        </Grid>

      </Box>

    </Container>
  );
}

export default ResumeHistory;