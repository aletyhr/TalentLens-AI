import { useState } from "react";
import { useDropzone } from "react-dropzone";

import API from "../services/api";
import generateReport from "../utils/generateReport";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
  LinearProgress,
  Fade,
  Paper,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

import Dashboard from "./Dashboard";

function ResumeUpload() {
  // ==========================================
  // STATES
  // ==========================================

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [jobDescription, setJobDescription] = useState("");

  // Scores
  const [atsScore, setAtsScore] = useState(0);
  const [semanticScore, setSemanticScore] = useState(0);
  const [resumeGrade, setResumeGrade] = useState("");
  const [overallScore, setOverallScore] = useState(0);

  // Role
  const [predictedRole, setPredictedRole] = useState("");

  // Resume Data
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  // Analysis
  const [suggestions, setSuggestions] = useState([]);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);

  // Resume Insights
  const [resumeInsights, setResumeInsights] = useState(null);

  // ==========================================
  // FILE DROP
  // ==========================================

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,

    accept: {
      "application/pdf": [".pdf"],
    },

    multiple: false,
  });

  // ==========================================
  // UPLOAD RESUME
  // ==========================================

  const uploadResume = async () => {
    // Check file
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      // ------------------------------------------
      // Start Loading
      // ------------------------------------------

      setLoading(true);
      setProgress(10);

      // Fake progress animation while AI processes
      const timer = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      // ------------------------------------------
      // CALL RESUME ANALYSIS API
      // ------------------------------------------

      const response = await API.post("/upload", formData);

      clearInterval(timer);

      setProgress(100);

      // ------------------------------------------
      // STORE RESULTS
      // ------------------------------------------

      setAtsScore(response.data.ats_score || 0);

      setSemanticScore(response.data.semantic_score || 0);

      setResumeGrade(response.data.resume_grade || "");

      setOverallScore(response.data.overall_score || 0);

      setPredictedRole(response.data.predicted_role || "");

      // ------------------------------------------
      // RESUME DATA
      // ------------------------------------------

      setSkills(response.data.skills || []);

      setEducation(response.data.education || []);

      setExperience(response.data.experience || []);

      // ------------------------------------------
      // AI ANALYSIS
      // ------------------------------------------

      setSuggestions(response.data.suggestions || []);

      setMatchedSkills(response.data.matched_skills || []);

      setMissingSkills(response.data.missing_skills || []);

      setInterviewQuestions(response.data.interview_questions || []);

      // ------------------------------------------
      // RESUME INSIGHTS
      // ------------------------------------------

      setResumeInsights(response.data.resume_insights || {});

      // ==========================================
      // SAVE RESUME HISTORY
      // ==========================================

      try {
        await API.post("/save_resume", {
          // File
          filename: file.name,

          // Scores
          ats_score: response.data.ats_score || 0,

          semantic_score: response.data.semantic_score || 0,

          resume_grade: response.data.resume_grade || "",

          overall_score: response.data.overall_score || 0,

          // Job Role
          predicted_role: response.data.predicted_role || "",

          // Resume Information
          skills: response.data.skills || [],

          education: response.data.education || [],

          experience: response.data.experience || [],

          // Skill Analysis
          matched_skills: response.data.matched_skills || [],

          missing_skills: response.data.missing_skills || [],

          // Suggestions
          suggestions: response.data.suggestions || [],

          // Resume Insights
          resume_insights: response.data.resume_insights || {},

          // Interview Questions
          interview_questions: response.data.interview_questions || [],
        });

        console.log("Resume history saved successfully.");
      } catch (historyError) {
        console.error(
          "History save failed:",
          historyError.response?.data || historyError.message,
        );
      }

      // ------------------------------------------
      // Finish Loading
      // ------------------------------------------

      setTimeout(() => {
        setLoading(false);
      }, 600);
    } catch (err) {
      console.error("Resume upload failed:", err.response?.data || err.message);

      setLoading(false);

      setProgress(0);

      alert(err.response?.data?.message || "Resume upload failed.");
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f5f7ff,#ffffff)",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        {/* ======================================
            UPLOAD CARD
        ====================================== */}

        <Card
          elevation={10}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography
              variant="h3"
              align="center"
              fontWeight="bold"
              gutterBottom
            >
              🤖 TalentLens AI Resume Analyzer
            </Typography>

            <Typography align="center" color="text.secondary" mb={5}>
              Upload your resume and let AI analyze your ATS score, semantic
              similarity, skills, education, experience and generate intelligent
              suggestions.
            </Typography>

            {/* ======================================
                DROPZONE
            ====================================== */}

            <Paper
              {...getRootProps()}
              elevation={0}
              sx={{
                border: "3px dashed #1976d2",

                borderRadius: 4,

                p: 6,

                textAlign: "center",

                cursor: "pointer",

                bgcolor: "#f8fbff",
              }}
            >
              <input {...getInputProps()} />

              <CloudUploadIcon
                sx={{
                  fontSize: 80,

                  color: "primary.main",
                }}
              />

              <Typography variant="h5" mt={2}>
                Drag & Drop Resume Here
              </Typography>

              <Typography color="text.secondary">
                or Click to Browse PDF
              </Typography>

              {/* Selected File */}

              {file && (
                <Fade in>
                  <Paper
                    sx={{
                      mt: 4,

                      p: 2,

                      display: "flex",

                      justifyContent: "center",

                      alignItems: "center",

                      gap: 2,
                    }}
                  >
                    <DescriptionIcon color="primary" />

                    <Typography fontWeight="bold">{file.name}</Typography>
                  </Paper>
                </Fade>
              )}
            </Paper>

            {/* ======================================
                JOB DESCRIPTION
            ====================================== */}

            <TextField
              fullWidth
              multiline
              rows={7}
              sx={{
                mt: 4,
              }}
              label="Paste Job Description (Optional)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            {/* ======================================
                ANALYZE BUTTON
            ====================================== */}

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 4,
              }}
              onClick={uploadResume}
              disabled={loading}
            >
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </Button>

            {/* ======================================
                LOADING
            ====================================== */}

            {loading && (
              <Box mt={4}>
                <LinearProgress variant="determinate" value={progress} />

                <Typography align="center" mt={2}>
                  AI is analyzing your resume...
                </Typography>

                <Box display="flex" justifyContent="center" mt={3}>
                  <CircularProgress />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* ======================================
            DOWNLOAD REPORT
        ====================================== */}

        {skills.length > 0 && (
          <>
            <Box
              sx={{
                mt: 4,

                mb: 3,

                display: "flex",

                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={() =>
                  generateReport({
                    filename: file?.name || "Resume.pdf",

                    atsScore,

                    semanticScore,

                    resumeGrade,

                    overallScore,

                    predictedRole,

                    skills,

                    education,

                    experience,

                    suggestions,
                  })
                }
              >
                📥 Download AI Report
              </Button>
            </Box>

            {/* ======================================
                RESULTS DASHBOARD
            ====================================== */}

            <Dashboard
              atsScore={atsScore}
              semanticScore={semanticScore}
              resumeGrade={resumeGrade}
              overallScore={overallScore}
              predictedRole={predictedRole}
              skills={skills}
              education={education}
              experience={experience}
              suggestions={suggestions}
              matchedSkills={matchedSkills}
              missingSkills={missingSkills}
              interviewQuestions={interviewQuestions}
              resumeInsights={resumeInsights}
            />
          </>
        )}
      </Container>
    </Box>
  );
}

export default ResumeUpload;
