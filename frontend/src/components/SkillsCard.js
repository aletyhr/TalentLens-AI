import { Paper, Typography, Chip, Stack } from "@mui/material";

function SkillsCard({ skills }) {
  return (
    <Paper
      elevation={5}
      sx={{
        p: 4,
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🛠 Extracted Resume Skills
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        AI extracted the following technical skills from your resume.
      </Typography>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        {skills?.length > 0 ? (
          skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              color="primary"
              variant="filled"
              sx={{
                fontWeight: "bold",
                mb: 1,
              }}
            />
          ))
        ) : (
          <Typography>No skills found.</Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default SkillsCard;
