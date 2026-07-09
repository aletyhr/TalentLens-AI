import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Divider,
} from "@mui/material";

function SkillsCard({ skills }) {
  const recommendedSkills = [
    "Docker",
    "AWS",
    "Kubernetes",
    "GitHub Actions",
    "REST API",
    "CI/CD",
  ];

  const missingSkills = recommendedSkills.filter(
    (skill) =>
      !skills.some(
        (userSkill) => userSkill.toLowerCase() === skill.toLowerCase(),
      ),
  );

  return (
    <Card
      elevation={6}
      sx={{
        borderRadius: 4,
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🚀 Skills Analysis
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" color="success.main">
          ✅ Detected Skills
        </Typography>

        <Grid container spacing={1} sx={{ mt: 1, mb: 3 }}>
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <Grid item key={index}>
                <Chip label={skill} color="success" variant="filled" />
              </Grid>
            ))
          ) : (
            <Typography>No skills detected.</Typography>
          )}
        </Grid>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" color="error.main">
          ⚠ Recommended Skills
        </Typography>

        <Grid container spacing={1} sx={{ mt: 1 }}>
          {missingSkills.map((skill, index) => (
            <Grid item key={index}>
              <Chip label={skill} color="error" variant="outlined" />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SkillsCard;
