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
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";
import PsychologyIcon from "@mui/icons-material/Psychology";

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
      <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
        🤖 AI Resume Analytics Dashboard
      </Typography>

      <Typography align="center" color="text.secondary" mb={5}>
        AI Powered ATS Prediction • Resume Intelligence • Skill Analysis
      </Typography>

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

      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5">⭐ Overall Resume Score</Typography>

        <Typography variant="h1" color="primary" fontWeight="bold">
          {overallScore}
        </Typography>

        <Typography color="text.secondary">
          Combined score based on ATS, Semantic Match, Skills, Education and
          Experience.
        </Typography>
      </Paper>

      <Divider sx={{ my: 5 }} />

      <Charts
        atsScore={atsScore}
        semanticScore={semanticScore}
        overallScore={overallScore}
      />

      <Divider sx={{ my: 5 }} />

      <SkillsCard skills={skills} />

      <Divider sx={{ my: 5 }} />
      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ✅ Matched Skills
        </Typography>

        {matchedSkills?.length > 0 ? (
          matchedSkills.map((skill, index) => (
            <Typography key={index} sx={{ mb: 1 }}>
              • {skill}
            </Typography>
          ))
        ) : (
          <Typography>No matched skills found.</Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ❌ Missing Skills
        </Typography>

        {missingSkills?.length > 0 ? (
          missingSkills.map((skill, index) => (
            <Typography key={index} sx={{ mb: 1 }}>
              • {skill}
            </Typography>
          ))
        ) : (
          <Typography>No missing skills found.</Typography>
        )}
      </Paper>

      <Divider sx={{ my: 5 }} />

      <SuggestionCard suggestions={suggestions} />

      <Divider sx={{ my: 5 }} />

      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🎯 Recommended Interview Questions
        </Typography>

        {interviewQuestions?.length > 0 ? (
          interviewQuestions.map((question, index) => (
            <Typography key={index} sx={{ mb: 2 }}>
              {index + 1}. {question}
            </Typography>
          ))
        ) : (
          <Typography>No interview questions available.</Typography>
        )}
      </Paper>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📄 Resume Details
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">🎓 Education</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <EducationCard education={education} />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">💼 Experience</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ExperienceCard experience={experience} />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}

export default Dashboard;
