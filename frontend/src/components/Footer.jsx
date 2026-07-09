import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        mt: 8,
        py: 3,
        textAlign: "center",
        backgroundColor: "#0f172a",
        color: "white",
      }}
    >
      <Typography variant="h6">TalentLens AI Resume Analyzer</Typography>

      <Typography variant="body2">
        © 2026 TalentLens AI | Built with React, Flask, AI & MongoDB
      </Typography>
    </Box>
  );
}

export default Footer;
