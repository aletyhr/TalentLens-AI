import { Paper, Typography, Stepper, Step, StepLabel } from "@mui/material";

function CareerRoadmap({ role }) {
  const roadmap = {
    "Python Developer": [
      "Learn Advanced Python",
      "Master Flask/Django",
      "Build REST APIs",
      "Learn Docker",
      "Deploy on AWS",
    ],

    "Frontend Developer": [
      "HTML & CSS",
      "JavaScript",
      "React",
      "Redux",
      "Next.js",
    ],

    "Machine Learning Engineer": [
      "Python",
      "Pandas",
      "Scikit-Learn",
      "Deep Learning",
      "MLOps",
    ],
  };

  const steps = roadmap[role] || [
    "Improve Skills",
    "Build Projects",
    "Practice DSA",
    "Apply for Jobs",
    "Keep Learning",
  ];

  return (
    <Paper
      elevation={5}
      sx={{
        p: 4,
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🛣 Career Roadmap
      </Typography>

      <Stepper alternativeLabel activeStep={steps.length}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}

export default CareerRoadmap;
