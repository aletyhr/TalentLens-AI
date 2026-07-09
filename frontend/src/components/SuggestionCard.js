import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

function SuggestionCard({ suggestions }) {
  return (
    <Card
      elevation={6}
      sx={{
        borderRadius: 4,
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🤖 AI Resume Insights
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" color="success.main" gutterBottom>
          Strengths
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Resume successfully parsed and analyzed." />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Skills detected from your resume." />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="ATS compatibility calculated." />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" color="warning.main" gutterBottom>
          Improvements
        </Typography>

        <List dense>
          {suggestions.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <WarningAmberIcon color="warning" />
              </ListItemIcon>

              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" color="primary" gutterBottom>
          AI Recommendation
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <TipsAndUpdatesIcon color="primary" />
            </ListItemIcon>

            <ListItemText primary="Add measurable achievements, certifications, cloud technologies, and project links to improve recruiter visibility." />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default SuggestionCard;
