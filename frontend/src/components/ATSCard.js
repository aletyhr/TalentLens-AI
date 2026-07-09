import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

function ATSCard({ score }) {
  let color = "#d32f2f";

  if (score >= 80) color = "#2e7d32";
  else if (score >= 60) color = "#ed6c02";

  return (
    <Card elevation={6} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography align="center" variant="h6">
          ATS Score
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          mt={3}
          mb={2}
          position="relative"
        >
          <CircularProgress
            variant="determinate"
            value={score}
            size={120}
            thickness={5}
            sx={{ color }}
          />

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <Typography variant="h4">{score}%</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ATSCard;
