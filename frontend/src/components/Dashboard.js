import {
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip,
  Box,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import ATSCard from "./ATSCard";
import SkillsCard from "./SkillsCard";
import SuggestionCard from "./SuggestionCard";
import EducationCard from "./EducationCard";
import ExperienceCard from "./ExperienceCard";
import Charts from "./Charts";

function Dashboard({
  atsScore,
  semanticScore,
  resumeGrade,
  overallScore,
  predictedRole,
  skills,
  education,
  experience,
  suggestions,
  matchedSkills,
  missingSkills,
  interviewQuestions,
}) {
  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
      {/* ================= HEADER ================= */}

      <Paper
        elevation={8}
        sx={{
          p: 5,
          borderRadius: 5,
          background: "linear-gradient(135deg,#1565c0,#1976d2,#42a5f5)",
          color: "white",
          mb: 5,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          TalentLens AI Resume Analyzer
        </Typography>

        <Typography sx={{ mt: 1 }}>
          AI Powered Resume Intelligence & ATS Optimization
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Chip
            label={`Predicted Role : ${predictedRole}`}
            color="success"
            sx={{
              fontWeight: "bold",
              fontSize: 16,
              p: 2,
            }}
          />
        </Box>
      </Paper>

      {/* ================= KPI CARDS ================= */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <ATSCard score={atsScore} />
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={6} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <EmojiEventsIcon color="warning" sx={{ fontSize: 45 }} />

              <Typography variant="h6">Resume Grade</Typography>

              <Typography variant="h2" color="success.main" fontWeight="bold">
                {resumeGrade}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={6} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <WorkIcon color="primary" sx={{ fontSize: 45 }} />

              <Typography variant="h6">Predicted Role</Typography>

              <Typography variant="h5" color="primary" fontWeight="bold" mt={2}>
                {predictedRole}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={6} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <PsychologyIcon color="secondary" sx={{ fontSize: 45 }} />

              <Typography variant="h6">Semantic Match</Typography>

              <Typography variant="h2" color="secondary" fontWeight="bold">
                {semanticScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />
      {/* ================= OVERALL SCORE ================= */}

      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 5,
          textAlign: "center",
        }}
      >
        <TrendingUpIcon
          color="primary"
          sx={{
            fontSize: 60,
          }}
        />

        <Typography variant="h5" fontWeight="bold" mt={2}>
          Overall Resume Score
        </Typography>

        <Typography variant="h1" color="primary" fontWeight="bold">
          {overallScore}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Overall score is calculated using ATS Score, Semantic Similarity,
          Resume Quality, Skills, Education and Experience.
        </Typography>
      </Paper>

      <Divider sx={{ my: 5 }} />

      {/* ================= RESUME SUMMARY ================= */}

      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📌 Resume Summary
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Typography>
              <b>Resume Grade:</b> {resumeGrade}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <b>ATS Score:</b> {atsScore}%
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <b>Semantic Match:</b> {semanticScore}%
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <b>Predicted Role:</b> {predictedRole}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <b>Skills Extracted:</b> {skills.length}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <b>Overall Score:</b> {overallScore}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 5 }} />

      {/* ================= CHARTS ================= */}

      <Charts
        atsScore={atsScore}
        semanticScore={semanticScore}
        overallScore={overallScore}
      />

      <Divider sx={{ my: 5 }} />

      {/* ================= EXTRACTED SKILLS ================= */}

      <SkillsCard skills={skills} />

      <Divider sx={{ my: 5 }} />

      {/* ================= JOB MATCH ANALYSIS ================= */}

      <Grid container spacing={3}>
        {/* ================= MATCHED SKILLS ================= */}

        <Grid item xs={12} md={6}>
          <Paper
            elevation={5}
            sx={{
              p: 4,
              borderRadius: 4,
              height: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              color="success.main"
              gutterBottom
            >
              ✅ Skills Matching Job Description
            </Typography>

            {matchedSkills && matchedSkills.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {matchedSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    color="success"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                No matched skills detected.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* ================= MISSING SKILLS ================= */}

        <Grid item xs={12} md={6}>
          <Paper
            elevation={5}
            sx={{
              p: 4,
              borderRadius: 4,
              height: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              color="error.main"
              gutterBottom
            >
              ❌ Skills Missing from Resume
            </Typography>

            {missingSkills && missingSkills.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {missingSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    color="error"
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                No missing skills found.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* ================= AI SUGGESTIONS ================= */}

      <SuggestionCard suggestions={suggestions} />

      <Divider sx={{ my: 5 }} />

      {/* ================= INTERVIEW QUESTIONS ================= */}

      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🎯 AI Recommended Interview Questions
        </Typography>

        {interviewQuestions && interviewQuestions.length > 0 ? (
          interviewQuestions.map((question, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                borderLeft: "5px solid #1976d2",
                borderRadius: 2,
              }}
            >
              <Typography>
                <strong>Q{index + 1}.</strong> {question}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary">
            No interview questions available.
          </Typography>
        )}
      </Paper>

      <Divider sx={{ my: 5 }} />
      {/* ================= RESUME DETAILS ================= */}

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📄 Resume Details
      </Typography>

      <Accordion
        sx={{
          borderRadius: 3,
          mb: 2,
          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">🎓 Education</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <EducationCard education={education} />
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          borderRadius: 3,
          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">💼 Experience</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ExperienceCard experience={experience} />
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 5 }} />

      {/* ================= FOOTER ================= */}

      <Paper
        elevation={2}
        sx={{
          p: 3,
          textAlign: "center",
          borderRadius: 4,
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          🚀 TalentLens AI Resume Analyzer
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Built using React • Flask • Machine Learning • NLP
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          © 2026 TalentLens AI. All Rights Reserved.
        </Typography>
      </Paper>
    </Container>
  );
}

export default Dashboard;
