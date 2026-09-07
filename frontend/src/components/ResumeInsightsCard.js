import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function ResumeInsightsCard({ resumeInsights }) {
  if (!resumeInsights) return null;

  return (
    <Card
      elevation={5}
      sx={{
        mt: 4,
        borderRadius: 4,
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🧠 AI Resume Insights
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" color="success.main" fontWeight="bold">
          ✅ Strengths
        </Typography>

        <List dense>
          {resumeInsights.strengths?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" color="warning.main" fontWeight="bold">
          ⚠ Areas to Improve
        </Typography>

        <List dense>
          {resumeInsights.improvements?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default ResumeInsightsCard;
