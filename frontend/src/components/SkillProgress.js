import { Paper, Typography, Chip, Grid, Box } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function SkillProgress({
  skills = [],
  matchedSkills = [],
  missingSkills = [],
}) {
  return (
    <Paper
      elevation={5}
      sx={{
        p: 4,
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📊 Skill Analysis
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Comparison between your resume skills and the Job Description.
      </Typography>

      <Grid container spacing={4}>
        {/* Resume Skills */}

        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📄 Resume Skills
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" />
              ))
            ) : (
              <Typography>No skills found.</Typography>
            )}
          </Box>
        </Grid>

        {/* Matched Skills */}

        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ✅ Matched Skills
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="success"
                  icon={<CheckCircleIcon />}
                />
              ))
            ) : (
              <Typography>No matched skills.</Typography>
            )}
          </Box>
        </Grid>

        {/* Missing Skills */}

        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ❌ Missing Skills
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="error"
                  icon={<WarningAmberIcon />}
                />
              ))
            ) : (
              <Typography>No missing skills.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default SkillProgress;
