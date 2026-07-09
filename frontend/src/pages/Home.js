import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
} from "@mui/material";

import {
  Psychology,
  UploadFile,
  Insights,
  Work,
  AutoAwesome,
  Speed,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 55 }} color="primary" />,
      title: "AI Resume Analysis",
      desc: "Deep NLP analysis extracts skills, education, experience and predicts ATS performance.",
    },
    {
      icon: <Insights sx={{ fontSize: 55 }} color="success" />,
      title: "ATS Score",
      desc: "Get an accurate ATS compatibility score with missing skills and recruiter insights.",
    },
    {
      icon: <Work sx={{ fontSize: 55 }} color="warning" />,
      title: "Role Prediction",
      desc: "Predict your most suitable job role using Machine Learning and semantic matching.",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 55 }} color="secondary" />,
      title: "AI Suggestions",
      desc: "Receive intelligent recommendations to improve resume quality instantly.",
    },
  ];

  const handleAnalyze = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Hero Section */}

      <Box
        sx={{
          background: "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
          color: "white",
          py: 12,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold">
                TalentLens AI
              </Typography>

              <Typography variant="h4" mt={2}>
                Smart Resume Analyzer powered by Artificial Intelligence
              </Typography>

              <Typography mt={3} fontSize={18}>
                Analyze resumes using NLP, Machine Learning, ATS scoring,
                Semantic Matching and AI Suggestions.
              </Typography>

              <Stack direction="row" spacing={2} mt={5}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<UploadFile />}
                  onClick={handleAnalyze}
                >
                  Analyze Resume
                </Button>

                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "white",
                    borderColor: "white",
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="AI"
                style={{
                  width: "100%",
                  maxWidth: "450px",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics */}

      <Container sx={{ mt: 8 }}>
        <Grid container spacing={3}>
          {[
            ["10K+", "Resumes Analyzed"],
            ["95%", "ATS Accuracy"],
            ["500+", "Recruiters Supported"],
            ["24/7", "AI Availability"],
          ].map((item, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Card elevation={6}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {item[0]}
                  </Typography>

                  <Typography>{item[1]}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features */}

      <Container sx={{ mt: 10 }}>
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Why Choose TalentLens AI?
        </Typography>

        <Typography textAlign="center" color="text.secondary" mb={6}>
          AI Powered Resume Intelligence
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                elevation={8}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                }}
              >
                <CardContent>
                  {feature.icon}

                  <Typography variant="h5" fontWeight="bold" mt={2}>
                    {feature.title}
                  </Typography>

                  <Typography mt={2}>{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}

      <Box
        sx={{
          background: "#0f172a",
          color: "white",
          py: 10,
          mt: 10,
        }}
      >
        <Container sx={{ textAlign: "center" }}>
          <Speed sx={{ fontSize: 70 }} />

          <Typography variant="h3" fontWeight="bold" mt={2}>
            Ready to Improve Your Resume?
          </Typography>

          <Typography mt={2} mb={4}>
            Upload your resume and let AI evaluate your ATS score, skills,
            experience and overall resume quality.
          </Typography>

          <Button variant="contained" size="large" onClick={handleAnalyze}>
            Analyze My Resume
          </Button>
        </Container>
      </Box>
    </>
  );
}

export default Home;
