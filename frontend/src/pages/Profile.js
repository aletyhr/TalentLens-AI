import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function Profile() {
  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "Not Available";

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Card
        elevation={8}
        sx={{
          borderRadius: 5,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box textAlign="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "primary.main",
                margin: "auto",
                fontSize: 40,
                mb: 2,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="h4" fontWeight="bold">
              {name}
            </Typography>

            <Typography color="text.secondary">TalentLens AI User</Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PersonIcon color="primary" />
                    <Typography>
                      <strong>Name:</strong> {name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <EmailIcon color="primary" />
                    <Typography>
                      <strong>Email:</strong> {email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={4}>
                <CardContent sx={{ textAlign: "center" }}>
                  <DescriptionIcon color="primary" sx={{ fontSize: 45 }} />

                  <Typography variant="h5" mt={2}>
                    Resume Analysis
                  </Typography>

                  <Typography color="text.secondary">
                    Upload resumes and receive AI-powered ATS scoring, semantic
                    analysis, and improvement suggestions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={4}>
                <CardContent sx={{ textAlign: "center" }}>
                  <EmojiEventsIcon color="warning" sx={{ fontSize: 45 }} />

                  <Typography variant="h5" mt={2}>
                    AI Features
                  </Typography>

                  <Typography color="text.secondary">
                    ATS Score Prediction, Resume Grading, Role Prediction,
                    Skills Extraction, and AI Suggestions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;
