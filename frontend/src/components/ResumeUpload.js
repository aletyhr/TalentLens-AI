import {
  useEffect,
  useState,
} from "react";

import {
  useDropzone,
} from "react-dropzone";

import API from "../services/api";
import generateReport from "../utils/generateReport";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
  LinearProgress,
  Fade,
  Paper,
  Alert,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

import Dashboard from "./Dashboard";


// =====================================================
// ACCOUNT-SPECIFIC STORAGE
// =====================================================

const getCurrentUserEmail = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4
      );

    const payload = JSON.parse(
      atob(paddedBase64)
    );

    return (
      typeof payload.sub === "string"
        ? payload.sub.toLowerCase()
        : null
    );

  } catch (error) {
    console.error(
      "Unable to identify logged-in user:",
      error
    );

    return null;
  }
};


const getStorageKey = (baseKey) => {
  const email =
    getCurrentUserEmail();

  if (!email) {
    return baseKey;
  }

  return (
    `${baseKey}_${encodeURIComponent(email)}`
  );
};


// =====================================================
// STORAGE NAMES
// =====================================================

const RESUME_ANALYSIS_BASE_KEY =
  "talentlens_resume_analysis";

const INTERVIEW_DATA_BASE_KEY =
  "talentlens_interview_data";

const JOB_DESCRIPTION_BASE_KEY =
  "talentlens_job_description";

const TARGET_JOB_BASE_KEY =
  "talentlens_target_job";

const JOB_MATCH_RESULT_BASE_KEY =
  "talentlens_job_match_result";


// =====================================================
// RESUME UPLOAD COMPONENT
// =====================================================

function ResumeUpload() {

  // =====================================================
  // FILE
  // =====================================================

  const [file, setFile] =
    useState(null);

  const [fileName, setFileName] =
    useState("");


  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);


  // =====================================================
  // JOB DESCRIPTION
  // =====================================================

  const [jobDescription, setJobDescription] =
    useState("");


  // =====================================================
  // RESUME TEXT
  // =====================================================

  const [resumeText, setResumeText] =
    useState("");


  // =====================================================
  // SCORES
  // =====================================================

  const [atsScore, setAtsScore] =
    useState(0);

  const [semanticScore, setSemanticScore] =
    useState(0);

  const [resumeGrade, setResumeGrade] =
    useState("");

  const [overallScore, setOverallScore] =
    useState(0);


  // =====================================================
  // ROLE
  // =====================================================

  const [predictedRole, setPredictedRole] =
    useState("");

  const [roleEvidence, setRoleEvidence] =
    useState([]);


  // =====================================================
  // RESUME DATA
  // =====================================================

  const [skills, setSkills] =
    useState([]);

  const [education, setEducation] =
    useState([]);

  const [experience, setExperience] =
    useState([]);


  // =====================================================
  // ANALYSIS
  // =====================================================

  const [suggestions, setSuggestions] =
    useState([]);

  const [matchedSkills, setMatchedSkills] =
    useState([]);

  const [missingSkills, setMissingSkills] =
    useState([]);

  const [interviewQuestions, setInterviewQuestions] =
    useState([]);


  // =====================================================
  // RESUME INSIGHTS
  // =====================================================

  const [resumeInsights, setResumeInsights] =
    useState({});


  // =====================================================
  // RESTORE CURRENT USER DATA
  // =====================================================

  useEffect(() => {

    const resumeKey =
      getStorageKey(
        RESUME_ANALYSIS_BASE_KEY
      );

    const jobDescriptionKey =
      getStorageKey(
        JOB_DESCRIPTION_BASE_KEY
      );


    // -----------------------------------------------
    // Restore job description
    // -----------------------------------------------

    const savedJobDescription =
      localStorage.getItem(
        jobDescriptionKey
      );

    if (savedJobDescription) {
      setJobDescription(
        savedJobDescription
      );
    }


    // -----------------------------------------------
    // Restore resume analysis
    // -----------------------------------------------

    const savedAnalysis =
      localStorage.getItem(
        resumeKey
      );

    if (!savedAnalysis) {
      return;
    }


    try {

      const data =
        JSON.parse(
          savedAnalysis
        );

      if (!data) {
        return;
      }


      setFileName(
        data.fileName || ""
      );

      setResumeText(
        data.resumeText || ""
      );

      setAtsScore(
        Number(
          data.atsScore || 0
        )
      );

      setSemanticScore(
        Number(
          data.semanticScore || 0
        )
      );

      setResumeGrade(
        data.resumeGrade || ""
      );

      setOverallScore(
        Number(
          data.overallScore || 0
        )
      );

      setPredictedRole(
        data.predictedRole || ""
      );

      setRoleEvidence(
        Array.isArray(
          data.roleEvidence
        )
          ? data.roleEvidence
          : []
      );

      setSkills(
        Array.isArray(
          data.skills
        )
          ? data.skills
          : []
      );

      setEducation(
        Array.isArray(
          data.education
        )
          ? data.education
          : []
      );

      setExperience(
        Array.isArray(
          data.experience
        )
          ? data.experience
          : []
      );

      setSuggestions(
        Array.isArray(
          data.suggestions
        )
          ? data.suggestions
          : []
      );

      setMatchedSkills(
        Array.isArray(
          data.matchedSkills
        )
          ? data.matchedSkills
          : []
      );

      setMissingSkills(
        Array.isArray(
          data.missingSkills
        )
          ? data.missingSkills
          : []
      );

      setInterviewQuestions(
        Array.isArray(
          data.interviewQuestions
        )
          ? data.interviewQuestions
          : []
      );

      setResumeInsights(
        data.resumeInsights &&
        typeof data.resumeInsights ===
          "object"
          ? data.resumeInsights
          : {}
      );

    } catch (error) {

      console.error(
        "Unable to restore saved resume analysis:",
        error
      );

      localStorage.removeItem(
        resumeKey
      );

    }

  }, []);


  // =====================================================
  // SAVE ANALYSIS TO CURRENT USER STORAGE
  // =====================================================

  const saveAnalysisToStorage = ({
    analyzedFileName,
    analyzedResumeText,
    analyzedAtsScore,
    analyzedSemanticScore,
    analyzedResumeGrade,
    analyzedOverallScore,
    analyzedRole,
    analyzedRoleEvidence,
    analyzedSkills,
    analyzedEducation,
    analyzedExperience,
    analyzedSuggestions,
    analyzedMatchedSkills,
    analyzedMissingSkills,
    analyzedInterviewQuestions,
    analyzedInsights,
  }) => {

    const analysisData = {

      fileName:
        analyzedFileName,

      resumeText:
        analyzedResumeText,

      atsScore:
        analyzedAtsScore,

      semanticScore:
        analyzedSemanticScore,

      resumeGrade:
        analyzedResumeGrade,

      overallScore:
        analyzedOverallScore,

      predictedRole:
        analyzedRole,

      roleEvidence:
        analyzedRoleEvidence,

      skills:
        analyzedSkills,

      education:
        analyzedEducation,

      experience:
        analyzedExperience,

      suggestions:
        analyzedSuggestions,

      matchedSkills:
        analyzedMatchedSkills,

      missingSkills:
        analyzedMissingSkills,

      interviewQuestions:
        analyzedInterviewQuestions,

      resumeInsights:
        analyzedInsights,

      updatedAt:
        new Date().toISOString(),

    };


    localStorage.setItem(
      getStorageKey(
        RESUME_ANALYSIS_BASE_KEY
      ),
      JSON.stringify(
        analysisData
      )
    );

  };


  // =====================================================
  // CLEAR CURRENT USER ANALYSIS
  // =====================================================

  const clearPreviousAnalysis = () => {

    setFile(null);

    setFileName("");

    setResumeText("");

    setAtsScore(0);

    setSemanticScore(0);

    setResumeGrade("");

    setOverallScore(0);

    setPredictedRole("");

    setRoleEvidence([]);

    setSkills([]);

    setEducation([]);

    setExperience([]);

    setSuggestions([]);

    setMatchedSkills([]);

    setMissingSkills([]);

    setInterviewQuestions([]);

    setResumeInsights({});


    localStorage.removeItem(
      getStorageKey(
        RESUME_ANALYSIS_BASE_KEY
      )
    );


    localStorage.removeItem(
      getStorageKey(
        INTERVIEW_DATA_BASE_KEY
      )
    );


    localStorage.removeItem(
      getStorageKey(
        TARGET_JOB_BASE_KEY
      )
    );


    localStorage.removeItem(
      getStorageKey(
        JOB_DESCRIPTION_BASE_KEY
      )
    );


    localStorage.removeItem(
      getStorageKey(
        JOB_MATCH_RESULT_BASE_KEY
      )
    );

  };


  // =====================================================
  // FILE DROP
  // =====================================================

  const onDrop = (
    acceptedFiles
  ) => {

    if (
      acceptedFiles.length === 0
    ) {
      return;
    }


    const selectedFile =
      acceptedFiles[0];


    // New resume = new analysis
    clearPreviousAnalysis();


    setFile(
      selectedFile
    );

    setFileName(
      selectedFile.name
    );

  };


  // =====================================================
  // DROPZONE
  // =====================================================

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({

    onDrop,

    accept: {
      "application/pdf": [
        ".pdf",
      ],
    },

    multiple: false,

  });


  // =====================================================
  // ANALYZE RESUME
  // =====================================================

  const uploadResume =
    async () => {

      if (!file) {

        alert(
          "Please upload your resume first."
        );

        return;
      }


      const cleanJobDescription =
        jobDescription.trim();


      // -----------------------------------------------
      // Save JD for CURRENT USER only
      // -----------------------------------------------

      localStorage.setItem(
        getStorageKey(
          JOB_DESCRIPTION_BASE_KEY
        ),
        cleanJobDescription
      );


      const formData =
        new FormData();


      formData.append(
        "resume",
        file
      );

      formData.append(
        "job_description",
        cleanJobDescription
      );


      let timer = null;


      try {

        // ---------------------------------------------
        // START LOADING
        // ---------------------------------------------

        setLoading(true);

        setProgress(10);


        timer =
          setInterval(() => {

            setProgress(
              (previous) =>
                previous < 90
                  ? previous + 10
                  : previous
            );

          }, 300);


        // ---------------------------------------------
        // BACKEND REQUEST
        // ---------------------------------------------

        const response =
          await API.post(
            "/upload",
            formData
          );


        if (timer) {

          clearInterval(
            timer
          );

          timer = null;
        }


        setProgress(100);


        const data =
          response.data || {};


        // ---------------------------------------------
        // RESUME TEXT
        // ---------------------------------------------

        const analyzedResumeText =
          typeof data.text ===
          "string"
            ? data.text
            : "";


        // ---------------------------------------------
        // SCORES
        // ---------------------------------------------

        const analyzedAtsScore =
          Number(
            data.ats_score || 0
          );

        const analyzedSemanticScore =
          Number(
            data.semantic_score || 0
          );

        const analyzedOverallScore =
          Number(
            data.overall_score || 0
          );

        const analyzedResumeGrade =
          data.resume_grade || "";


        // ---------------------------------------------
        // ROLE
        // ---------------------------------------------

        const analyzedRole =
          data.predicted_role || "";

        const analyzedRoleEvidence =
          Array.isArray(
            data.role_evidence
          )
            ? data.role_evidence
            : [];


        // ---------------------------------------------
        // SKILLS
        // ---------------------------------------------

        const analyzedSkills =
          Array.isArray(
            data.skills
          )
            ? data.skills
            : [];


        // ---------------------------------------------
        // EDUCATION
        // ---------------------------------------------

        const analyzedEducation =
          Array.isArray(
            data.education
          )
            ? data.education
            : [];


        // ---------------------------------------------
        // EXPERIENCE
        // ---------------------------------------------

        const analyzedExperience =
          Array.isArray(
            data.experience
          )
            ? data.experience
            : [];


        // ---------------------------------------------
        // SUGGESTIONS
        // ---------------------------------------------

        const analyzedSuggestions =
          Array.isArray(
            data.suggestions
          )
            ? data.suggestions
            : [];


        // ---------------------------------------------
        // MATCHED SKILLS
        // ---------------------------------------------

        const analyzedMatchedSkills =
          Array.isArray(
            data.matched_skills
          )
            ? data.matched_skills
            : [];


        // ---------------------------------------------
        // MISSING SKILLS
        // ---------------------------------------------

        const analyzedMissingSkills =
          Array.isArray(
            data.missing_skills
          )
            ? data.missing_skills
            : [];


        // ---------------------------------------------
        // INTERVIEW QUESTIONS
        // ---------------------------------------------

        const analyzedInterviewQuestions =
          Array.isArray(
            data.interview_questions
          )
            ? data.interview_questions
            : [];


        // ---------------------------------------------
        // RESUME INSIGHTS
        // ---------------------------------------------

        const analyzedInsights =
          data.resume_insights &&
          typeof data.resume_insights ===
            "object"
            ? data.resume_insights
            : {};


        // ---------------------------------------------
        // UPDATE REACT STATE
        // ---------------------------------------------

        setFileName(
          file.name
        );

        setResumeText(
          analyzedResumeText
        );

        setAtsScore(
          analyzedAtsScore
        );

        setSemanticScore(
          analyzedSemanticScore
        );

        setResumeGrade(
          analyzedResumeGrade
        );

        setOverallScore(
          analyzedOverallScore
        );

        setPredictedRole(
          analyzedRole
        );

        setRoleEvidence(
          analyzedRoleEvidence
        );

        setSkills(
          analyzedSkills
        );

        setEducation(
          analyzedEducation
        );

        setExperience(
          analyzedExperience
        );

        setSuggestions(
          analyzedSuggestions
        );

        setMatchedSkills(
          analyzedMatchedSkills
        );

        setMissingSkills(
          analyzedMissingSkills
        );

        setInterviewQuestions(
          analyzedInterviewQuestions
        );

        setResumeInsights(
          analyzedInsights
        );


        // ---------------------------------------------
        // SAVE INTERVIEW DATA FOR CURRENT USER
        // ---------------------------------------------

        const interviewData = {

          predictedRole:
            analyzedRole,

          skills:
            analyzedSkills,

          education:
            analyzedEducation,

          experience:
            analyzedExperience,

          resumeText:
            analyzedResumeText,

          interviewQuestions:
            analyzedInterviewQuestions,

          resumeInsights:
            analyzedInsights,

          updatedAt:
            new Date().toISOString(),

        };


        localStorage.setItem(
          getStorageKey(
            INTERVIEW_DATA_BASE_KEY
          ),
          JSON.stringify(
            interviewData
          )
        );


        // ---------------------------------------------
        // SAVE COMPLETE ANALYSIS
        // ---------------------------------------------

        saveAnalysisToStorage({

          analyzedFileName:
            file.name,

          analyzedResumeText:
            analyzedResumeText,

          analyzedAtsScore:
            analyzedAtsScore,

          analyzedSemanticScore:
            analyzedSemanticScore,

          analyzedResumeGrade:
            analyzedResumeGrade,

          analyzedOverallScore:
            analyzedOverallScore,

          analyzedRole:
            analyzedRole,

          analyzedRoleEvidence:
            analyzedRoleEvidence,

          analyzedSkills:
            analyzedSkills,

          analyzedEducation:
            analyzedEducation,

          analyzedExperience:
            analyzedExperience,

          analyzedSuggestions:
            analyzedSuggestions,

          analyzedMatchedSkills:
            analyzedMatchedSkills,

          analyzedMissingSkills:
            analyzedMissingSkills,

          analyzedInterviewQuestions:
            analyzedInterviewQuestions,

          analyzedInsights:
            analyzedInsights,

        });


        // ---------------------------------------------
        // SAVE RESUME HISTORY
        // ---------------------------------------------

        try {

          await API.post(
            "/save_resume",
            {

              filename:
                file.name,

              ats_score:
                analyzedAtsScore,

              semantic_score:
                analyzedSemanticScore,

              resume_grade:
                analyzedResumeGrade,

              overall_score:
                analyzedOverallScore,

              predicted_role:
                analyzedRole,

              skills:
                analyzedSkills,

              education:
                analyzedEducation,

              experience:
                analyzedExperience,

              matched_skills:
                analyzedMatchedSkills,

              missing_skills:
                analyzedMissingSkills,

              suggestions:
                analyzedSuggestions,

              resume_insights:
                analyzedInsights,

              interview_questions:
                analyzedInterviewQuestions,

            }
          );

        } catch (
          historyError
        ) {

          console.error(
            "History save failed:",
            historyError
              .response?.data ||
            historyError.message
          );

        }


        // ---------------------------------------------
        // COMPLETE
        // ---------------------------------------------

        setTimeout(() => {

          setLoading(false);

        }, 600);


      } catch (error) {

        if (timer) {

          clearInterval(
            timer
          );

        }


        console.error(
          "Resume upload failed:",
          error.response?.data ||
          error.message
        );


        setLoading(false);

        setProgress(0);


        alert(
          error.response?.data?.message ||
          "Resume upload failed."
        );

      }

    };


  // =====================================================
  // JOB DESCRIPTION CHANGE
  // =====================================================

  const handleJobDescriptionChange =
    (event) => {

      const value =
        event.target.value;


      setJobDescription(
        value
      );


      localStorage.setItem(
        getStorageKey(
          JOB_DESCRIPTION_BASE_KEY
        ),
        value
      );

    };


  // =====================================================
  // DOWNLOAD REPORT
  // =====================================================

  const downloadReport =
    () => {

      generateReport({

        filename:
          fileName ||
          "Resume.pdf",

        atsScore:
          atsScore,

        semanticScore:
          semanticScore,

        resumeGrade:
          resumeGrade,

        overallScore:
          overallScore,

        predictedRole:
          predictedRole,

        skills:
          skills,

        education:
          education,

        experience:
          experience,

        suggestions:
          suggestions,

      });

    };


  // =====================================================
  // HAS ANALYSIS
  // =====================================================

  const hasAnalysis =
    Boolean(
      resumeText &&
      skills.length > 0
    );


  // =====================================================
  // UI
  // =====================================================

  return (

    <Box
      sx={{
        minHeight:
          "100vh",

        background:
          "linear-gradient(135deg,#eef2ff,#f5f7ff,#ffffff)",

        py: 5,
      }}
    >

      <Container
        maxWidth="lg"
      >

        {/* =================================================
            UPLOAD CARD
        ================================================= */}

        <Card
          elevation={10}
          sx={{
            borderRadius: 5,
            overflow:
              "hidden",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 5,
              },
            }}
          >

            <Typography
              variant="h3"
              align="center"
              fontWeight="bold"
              gutterBottom
            >
              🤖 TalentLens AI Resume Analyzer
            </Typography>


            <Typography
              align="center"
              color="text.secondary"
              mb={5}
            >
              Upload your resume and let TalentLens
              analyze its structure, ATS compatibility,
              semantic relevance, skills, education,
              experience and improvement areas.
            </Typography>


            {/* =================================================
                EXISTING ANALYSIS NOTICE
            ================================================= */}

            {hasAnalysis && (

              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 3,
                }}
              >
                Your previous resume analysis is saved.
                You can leave this page and return without
                uploading the resume again.
              </Alert>

            )}


            {/* =================================================
                DROPZONE
            ================================================= */}

            <Paper
              {...getRootProps()}
              elevation={0}
              sx={{
                border:
                  "3px dashed #1976d2",

                borderRadius: 4,

                p: {
                  xs: 4,
                  md: 6,
                },

                textAlign:
                  "center",

                cursor:
                  "pointer",

                bgcolor:
                  "#f8fbff",

                transition:
                  "all 0.25s ease",

                "&:hover": {
                  bgcolor:
                    "#eef6ff",

                  transform:
                    "translateY(-2px)",
                },
              }}
            >

              <input
                {...getInputProps()}
              />


              <CloudUploadIcon
                sx={{
                  fontSize: 80,
                  color:
                    "primary.main",
                }}
              />


              <Typography
                variant="h5"
                mt={2}
              >
                Drag & Drop Resume Here
              </Typography>


              <Typography
                color="text.secondary"
              >
                or Click to Browse PDF
              </Typography>


              {fileName && (

                <Fade in>

                  <Paper
                    elevation={2}
                    sx={{
                      mt: 4,
                      p: 2,

                      display:
                        "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      gap: 2,

                      borderRadius: 3,
                    }}
                  >

                    <DescriptionIcon
                      color="primary"
                    />


                    <Typography
                      fontWeight="bold"
                    >
                      {fileName}
                    </Typography>

                  </Paper>

                </Fade>

              )}

            </Paper>


            {/* =================================================
                JOB DESCRIPTION
            ================================================= */}

            <TextField
              fullWidth
              multiline
              rows={7}

              sx={{
                mt: 4,
              }}

              label="Paste Job Description (Optional)"

              placeholder={
                "Paste the job description here to compare your resume with the target job."
              }

              value={
                jobDescription
              }

              onChange={
                handleJobDescriptionChange
              }

              helperText={
                "This description is used by Job Match Analyzer. Your Resume Career Direction remains separate."
              }

            />


            {/* =================================================
                ANALYZE BUTTON
            ================================================= */}

            <Button
              variant="contained"
              fullWidth
              size="large"

              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight:
                  "bold",
              }}

              onClick={
                uploadResume
              }

              disabled={
                loading
              }
            >

              {loading
                ? "Analyzing Resume..."
                : hasAnalysis
                  ? "Analyze New Resume"
                  : "Analyze Resume"}

            </Button>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <Box
                mt={4}
              >

                <LinearProgress
                  variant="determinate"
                  value={
                    progress
                  }
                />


                <Typography
                  align="center"
                  mt={2}
                >
                  TalentLens is analyzing
                  your resume...
                </Typography>


                <Box
                  display="flex"
                  justifyContent="center"
                  mt={3}
                >

                  <CircularProgress />

                </Box>

              </Box>

            )}

          </CardContent>

        </Card>


        {/* =================================================
            RESULTS
        ================================================= */}

        {hasAnalysis && (

          <>

            {/* =================================================
                DOWNLOAD REPORT
            ================================================= */}

            <Box
              sx={{
                mt: 4,
                mb: 3,

                display:
                  "flex",

                justifyContent:
                  "center",
              }}
            >

              <Button
                variant="contained"
                color="success"
                size="large"

                onClick={
                  downloadReport
                }

                sx={{
                  borderRadius: 3,
                  px: 4,
                  fontWeight:
                    "bold",
                }}
              >
                📥 Download AI Report
              </Button>

            </Box>


            {/* =================================================
                DASHBOARD
            ================================================= */}

            <Dashboard

              atsScore={
                atsScore
              }

              semanticScore={
                semanticScore
              }

              resumeGrade={
                resumeGrade
              }

              overallScore={
                overallScore
              }

              predictedRole={
                predictedRole
              }

              roleEvidence={
                roleEvidence
              }

              skills={
                skills
              }

              education={
                education
              }

              experience={
                experience
              }

              suggestions={
                suggestions
              }

              matchedSkills={
                matchedSkills
              }

              missingSkills={
                missingSkills
              }

              interviewQuestions={
                interviewQuestions
              }

              resumeInsights={
                resumeInsights
              }

              resumeText={
                resumeText
              }

            />

          </>

        )}

      </Container>

    </Box>

  );

}


export default ResumeUpload;