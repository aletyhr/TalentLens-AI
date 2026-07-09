import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Box,
  Divider,
  Stack,
} from "@mui/material";

function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          mt: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
        📜 Resume History
      </Typography>

      <Typography align="center" color="text.secondary" mb={5}>
        View all your previously analyzed resumes
      </Typography>

      <Grid container spacing={3}>
        {history.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center">No resume history found.</Typography>
          </Grid>
        ) : (
          history.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    📄 {item.filename}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography fontWeight="bold">ATS Score</Typography>

                    <Chip label={`${item.ats_score}%`} color="primary" />
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography fontWeight="bold">Semantic Score</Typography>

                    <Chip label={`${item.semantic_score}%`} color="secondary" />
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography fontWeight="bold">Resume Grade</Typography>

                    <Chip label={item.resume_grade} color="success" />
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography fontWeight="bold">Overall Score</Typography>

                    <Chip label={item.overall_score} color="warning" />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" fontWeight="bold">
                    💼 Predicted Role
                  </Typography>

                  <Typography color="primary" mb={2}>
                    {item.predicted_role}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    🚀 Skills
                  </Typography>

                  <Box>
                    {item.skills &&
                      item.skills.map((skill, i) => (
                        <Chip key={i} label={skill} sx={{ mr: 1, mb: 1 }} />
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default ResumeHistory;
