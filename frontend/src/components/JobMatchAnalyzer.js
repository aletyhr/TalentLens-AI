import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";


function JobMatchAnalyzer({
  resumeText = "",
}) {

  // =====================================================
  // TARGET JOB
  // =====================================================

  const [targetJob, setTargetJob] =
    useState(
      () =>
        localStorage.getItem(
          "talentlens_target_job"
        ) || ""
    );


  // =====================================================
  // JOB DESCRIPTION
  // =====================================================

  const [jobDescription, setJobDescription] =
    useState(
      () =>
        localStorage.getItem(
          "talentlens_job_description"
        ) || ""
    );


  // =====================================================
  // RESULT
  // =====================================================

  const [result, setResult] =
    useState(null);


  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] =
    useState("");


  // =====================================================
  // RESTORE PREVIOUS JOB MATCH RESULT
  // =====================================================

  useEffect(() => {

    const savedResult =
      localStorage.getItem(
        "talentlens_job_match_result"
      );


    if (!savedResult) {

      return;

    }


    try {

      const parsedResult =
        JSON.parse(
          savedResult
        );


      setResult(
        parsedResult
      );


    } catch (restoreError) {

      console.error(
        "Unable to restore job match result:",
        restoreError
      );


      localStorage.removeItem(
        "talentlens_job_match_result"
      );

    }

  }, []);


  // =====================================================
  // TARGET JOB CHANGE
  // =====================================================

  const handleTargetJobChange =
    (event) => {

      const value =
        event.target.value;


      setTargetJob(
        value
      );


      localStorage.setItem(
        "talentlens_target_job",
        value
      );

    };


  // =====================================================
  // JOB DESCRIPTION CHANGE
  // =====================================================

  const handleJobDescriptionChange =
    (event) => {

      const value =
        event.target.value;


      setJobDescription(
        value
      );


      localStorage.setItem(
        "talentlens_job_description",
        value
      );


      /*
       * The old result belongs to the
       * previous job description.
       *
       * Remove it when the user edits
       * the description.
       */

      setResult(
        null
      );


      localStorage.removeItem(
        "talentlens_job_match_result"
      );

    };


  // =====================================================
  // ANALYZE JOB MATCH
  // =====================================================

  const analyzeJobMatch =
    async () => {

      setError("");


      // -------------------------------------------------
      // VALIDATE TARGET JOB
      // -------------------------------------------------

      const cleanTargetJob =
        targetJob.trim();


      if (!cleanTargetJob) {

        setError(
          "Please enter the target job."
        );

        return;

      }


      // -------------------------------------------------
      // VALIDATE JOB DESCRIPTION
      // -------------------------------------------------

      const cleanJobDescription =
        jobDescription.trim();


      if (!cleanJobDescription) {

        setError(
          "Please enter a job description."
        );

        return;

      }


      // -------------------------------------------------
      // VALIDATE RESUME
      // -------------------------------------------------

      if (!resumeText.trim()) {

        setError(
          "Resume analysis is not available. Please analyze your resume first."
        );

        return;

      }


      // -------------------------------------------------
      // SAVE INPUTS
      // -------------------------------------------------

      localStorage.setItem(
        "talentlens_target_job",
        cleanTargetJob
      );


      localStorage.setItem(
        "talentlens_job_description",
        cleanJobDescription
      );


      // -------------------------------------------------
      // START
      // -------------------------------------------------

      setLoading(
        true
      );


      try {

        const response =
          await API.post(
            "/job_match",
            {

              resume_text:
                resumeText,

              job_description:
                cleanJobDescription,

            }
          );


        const data =
          response.data || {};


        // -------------------------------------------------
        // BUILD RESULT
        // -------------------------------------------------

        const jobMatchResult = {

          target_job:
            cleanTargetJob,

          match_score:
            Number(
              data.match_score || 0
            ),

          match_level:
            data.match_level ||
            "Not Available",

          ats_score:
            Number(
              data.ats_score || 0
            ),

          semantic_score:
            Number(
              data.semantic_score || 0
            ),

          matched_skills:
            Array.isArray(
              data.matched_skills
            )
              ? data.matched_skills
              : [],

          missing_skills:
            Array.isArray(
              data.missing_skills
            )
              ? data.missing_skills
              : [],

          recommendations:
            Array.isArray(
              data.recommendations
            )
              ? data.recommendations
              : [],

          updatedAt:
            new Date().toISOString(),

        };


        // -------------------------------------------------
        // SAVE RESULT
        // -------------------------------------------------

        setResult(
          jobMatchResult
        );


        localStorage.setItem(
          "talentlens_job_match_result",
          JSON.stringify(
            jobMatchResult
          )
        );


      } catch (requestError) {

        console.error(
          "Job match analysis failed:",
          requestError
            .response?.data ||
          requestError.message
        );


        setError(
          requestError
            .response?.data?.message ||
          "Unable to analyze the job description."
        );


      } finally {

        setLoading(
          false
        );

      }

    };


  // =====================================================
  // SCORE COLOR
  // =====================================================

  const getScoreColor =
    (score) => {

      if (score >= 80) {

        return "success";

      }


      if (score >= 60) {

        return "warning";

      }


      return "error";

    };


  // =====================================================
  // UI
  // =====================================================

  return (

    <Card
      elevation={6}
      sx={{
        borderRadius: 4,
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

        {/* =================================================
            HEADER
        ================================================= */}

        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
        >
          🎯 Job Description Match Analyzer
        </Typography>


        <Typography
          color="text.secondary"
          sx={{
            mb: 3,
          }}
        >
          Compare your current resume with a specific
          target job and identify matching skills,
          missing skills and improvement areas.
        </Typography>


        <Alert
          severity="info"
          sx={{
            mb: 3,
          }}
        >
          <strong>
            Resume Career Direction
          </strong>
          {" "}
          and
          {" "}
          <strong>
            Target Job
          </strong>
          {" "}
          are separate. Your resume may represent one
          career direction while you apply for another
          role. TalentLens measures the alignment between
          them.
        </Alert>


        {/* =================================================
            TARGET JOB
        ================================================= */}

        <TextField
          fullWidth
          label="Target Job"
          placeholder="Example: Backend Developer"
          value={
            targetJob
          }
          onChange={
            handleTargetJobChange
          }
          sx={{
            mb: 3,
          }}
        />


        {/* =================================================
            JOB DESCRIPTION
        ================================================= */}

        <TextField
          fullWidth
          multiline
          rows={8}
          label="Job Description"
          placeholder={
            "Paste the complete job description here..."
          }
          value={
            jobDescription
          }
          onChange={
            handleJobDescriptionChange
          }
        />


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mt: 3,
            }}
          >
            {error}
          </Alert>

        )}


        {/* =================================================
            ANALYZE BUTTON
        ================================================= */}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={
            analyzeJobMatch
          }
          disabled={
            loading
          }
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
          }}
        >

          {loading ? (

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >

              <CircularProgress
                size={22}
                color="inherit"
              />

              <span>
                Analyzing Job Match...
              </span>

            </Stack>

          ) : (

            "Analyze Job Match"

          )}

        </Button>


        {/* =================================================
            RESULT
        ================================================= */}

        {result && (

          <Box
            sx={{
              mt: 5,
            }}
          >

            <Divider
              sx={{
                mb: 4,
              }}
            />


            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
            >
              Job Match Result
            </Typography>


            {/* =============================================
                TARGET JOB
            ============================================= */}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mt: 2,
                mb: 3,
                borderRadius: 3,
                background:
                  "#f5f7ff",
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Target Job
              </Typography>


              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {result.target_job}
              </Typography>

            </Paper>


            {/* =============================================
                MAIN SCORE
            ============================================= */}

            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                mb: 3,
              }}
            >

              <Typography
                color="text.secondary"
                gutterBottom
              >
                Overall Job Match
              </Typography>


              <Typography
                variant="h2"
                fontWeight="bold"
              >
                {result.match_score}%
              </Typography>


              <Chip
                label={
                  result.match_level
                }
                color={
                  getScoreColor(
                    result.match_score
                  )
                }
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                }}
              />

            </Paper>


            {/* =============================================
                ATS + SEMANTIC
            ============================================= */}

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
              sx={{
                mb: 4,
              }}
            >

              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 3,
                }}
              >

                <Typography
                  color="text.secondary"
                >
                  ATS Keyword Match
                </Typography>


                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {result.ats_score}%
                </Typography>

              </Paper>


              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 3,
                }}
              >

                <Typography
                  color="text.secondary"
                >
                  Semantic Match
                </Typography>


                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {result.semantic_score}%
                </Typography>

              </Paper>

            </Stack>


            {/* =============================================
                MATCHED SKILLS
            ============================================= */}

            <Box
              sx={{
                mb: 4,
              }}
            >

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                ✅ Matched Skills
              </Typography>


              {result.matched_skills.length > 0 ? (

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                >

                  {result.matched_skills.map(
                    (skill, index) => (

                      <Chip
                        key={
                          `${skill}-${index}`
                        }
                        label={
                          skill
                        }
                        color="success"
                        variant="outlined"
                      />

                    )
                  )}

                </Stack>

              ) : (

                <Typography
                  color="text.secondary"
                >
                  No matching skills were detected.
                </Typography>

              )}

            </Box>


            {/* =============================================
                MISSING SKILLS
            ============================================= */}

            <Box
              sx={{
                mb: 4,
              }}
            >

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                ⚠️ Missing Skills
              </Typography>


              {result.missing_skills.length > 0 ? (

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                >

                  {result.missing_skills.map(
                    (skill, index) => (

                      <Chip
                        key={
                          `${skill}-${index}`
                        }
                        label={
                          skill
                        }
                        color="warning"
                        variant="outlined"
                      />

                    )
                  )}

                </Stack>

              ) : (

                <Typography
                  color="text.secondary"
                >
                  No major missing skills were detected.
                </Typography>

              )}

            </Box>


            {/* =============================================
                RECOMMENDATIONS
            ============================================= */}

            <Box>

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                💡 Recommendations
              </Typography>


              <Stack
                spacing={1.5}
              >

                {result.recommendations.map(
                  (recommendation, index) => (

                    <Alert
                      key={
                        `recommendation-${index}`
                      }
                      severity="info"
                    >
                      {recommendation}
                    </Alert>

                  )
                )}

              </Stack>

            </Box>

          </Box>

        )}

      </CardContent>

    </Card>

  );

}


export default JobMatchAnalyzer;