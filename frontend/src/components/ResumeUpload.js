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
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [jobDescription, setJobDescription] = useState("");

  const [atsScore, setAtsScore] = useState(0);
  const [semanticScore, setSemanticScore] = useState(0);
  const [resumeGrade, setResumeGrade] = useState("");
  const [overallScore, setOverallScore] = useState(0);
  const [predictedRole, setPredictedRole] = useState("");

  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);

  // NEW
  const [resumeInsights, setResumeInsights] = useState(null);

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

  const uploadResume = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      setProgress(15);

      const timer = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const response = await API.post("/upload", formData);

      clearInterval(timer);
      setProgress(100);

      setAtsScore(response.data.ats_score);
      setSemanticScore(response.data.semantic_score);
      setResumeGrade(response.data.resume_grade);
      setOverallScore(response.data.overall_score);
      setPredictedRole(response.data.predicted_role);

      setSkills(response.data.skills || []);
      setEducation(response.data.education || []);
      setExperience(response.data.experience || []);
      setSuggestions(response.data.suggestions || []);

      setMatchedSkills(response.data.matched_skills || []);
      setMissingSkills(response.data.missing_skills || []);
      setInterviewQuestions(response.data.interview_questions || []);

      // NEW
      setResumeInsights(response.data.resume_insights || null);

      try {
        await API.post("/save_resume", {
          filename: file.name,
          ats_score: response.data.ats_score,
          semantic_score: response.data.semantic_score,
          resume_grade: response.data.resume_grade,
          overall_score: response.data.overall_score,
          predicted_role: response.data.predicted_role,
          skills: response.data.skills || [],
          education: response.data.education || [],
          experience: response.data.experience || [],
          suggestions: response.data.suggestions || [],
          matched_skills: response.data.matched_skills || [],
          missing_skills: response.data.missing_skills || [],
          resume_insights: response.data.resume_insights || {},
        });
      } catch (e) {
        console.log("History save failed", e);
      }

      setTimeout(() => {
        setLoading(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setProgress(0);
      alert("Resume upload failed.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f5f7ff,#ffffff)",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
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

            <TextField
              fullWidth
              multiline
              rows={7}
              sx={{ mt: 4 }}
              label="Paste Job Description (Optional)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 4 }}
              onClick={uploadResume}
              disabled={loading}
            >
              Analyze Resume
            </Button>

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
