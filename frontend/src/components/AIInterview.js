import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  ArrowForward,
  AutoAwesome,
  CheckCircle,
  Code,
  EmojiEvents,
  Groups,
  Psychology,
  RecordVoiceOver,
  Refresh,
  SmartToy,
  WorkOutline,
} from "@mui/icons-material";

import API from "../services/api";


// =====================================================
// ACCOUNT-SPECIFIC STORAGE
// =====================================================

const getCurrentUserEmail = () => {

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  try {

    const parts =
      token.split(".");

    if (parts.length < 2) {
      return null;
    }

    const base64 =
      parts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const paddedBase64 =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4
      );

    const payload =
      JSON.parse(
        atob(paddedBase64)
      );

    return typeof payload.sub === "string"
      ? payload.sub.toLowerCase()
      : payload.sub !== undefined
      ? String(payload.sub).toLowerCase()
      : null;

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

  return `${baseKey}_${encodeURIComponent(email)}`;
};


const INTERVIEW_DATA_BASE_KEY =
  "talentlens_interview_data";

const TARGET_JOB_BASE_KEY =
  "talentlens_target_job";

const JOB_DESCRIPTION_BASE_KEY =
  "talentlens_job_description";


// =====================================================
// MAIN COMPONENT
// =====================================================

function AIInterview() {

  // =====================================================
  // RESUME DATA
  // =====================================================

  const [role, setRole] =
    useState("");

  const [skills, setSkills] =
    useState("");

  const [education, setEducation] =
    useState([]);

  const [experience, setExperience] =
    useState([]);

  const [resumeText, setResumeText] =
    useState("");

  const [targetJob, setTargetJob] =
    useState("");

  const [jobDescription, setJobDescription] =
    useState("");


  // =====================================================
  // PAGE MODE
  // =====================================================

  const [mode, setMode] =
    useState("hub");


  // =====================================================
  // INTERVIEW PROGRESS
  // =====================================================

  const [interviewStats, setInterviewStats] =
    useState({
      has_history: false,
      total_interviews: 0,
      total_questions: 0,
      average_score: 0,
      best_score: 0,
      latest_score: 0,
      improvement: 0,
      readiness_level: "Not Started",
      recent_attempts: [],
    });

  const [statsLoading, setStatsLoading] =
    useState(false);


  // =====================================================
  // INTERVIEW STATE
  // =====================================================

  const [questions, setQuestions] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] =
    useState("");

  const [feedback, setFeedback] =
    useState(null);

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [evaluationLoading, setEvaluationLoading] =
    useState(false);

  const [savingInterview, setSavingInterview] =
    useState(false);

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  const [interviewFinished, setInterviewFinished] =
    useState(false);


  // =====================================================
  // INTERVIEW TYPE
  // =====================================================

  const [interviewType, setInterviewType] =
    useState("resume");


  // =====================================================
  // CAMERA + MICROPHONE
  // =====================================================

  const videoRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const [cameraActive, setCameraActive] =
    useState(false);


  // =====================================================
  // SPEECH
  // =====================================================

  const recognitionRef =
    useRef(null);

  const [listening, setListening] =
    useState(false);

  const [voiceSupported, setVoiceSupported] =
    useState(true);


  // =====================================================
  // LOAD RESUME DATA
  // =====================================================

  useEffect(() => {

    const accountInterviewKey =
      getStorageKey(
        INTERVIEW_DATA_BASE_KEY
      );

    const accountTargetJobKey =
      getStorageKey(
        TARGET_JOB_BASE_KEY
      );

    const accountJobDescriptionKey =
      getStorageKey(
        JOB_DESCRIPTION_BASE_KEY
      );


    let savedData =
      localStorage.getItem(
        accountInterviewKey
      );


    // ResumeUpload.js uses the generic key.
    if (!savedData) {

      savedData =
        localStorage.getItem(
          INTERVIEW_DATA_BASE_KEY
        );

    }


    const savedTargetJob =
      localStorage.getItem(
        accountTargetJobKey
      ) ||
      localStorage.getItem(
        TARGET_JOB_BASE_KEY
      );


    const savedJobDescription =
      localStorage.getItem(
        accountJobDescriptionKey
      ) ||
      localStorage.getItem(
        JOB_DESCRIPTION_BASE_KEY
      );


    if (savedTargetJob) {

      setTargetJob(
        savedTargetJob
      );

    }


    if (savedJobDescription) {

      setJobDescription(
        savedJobDescription
      );

    }


    if (!savedData) {

      console.log(
        "No saved interview resume data found."
      );

      return;

    }


    try {

      const data =
        JSON.parse(
          savedData
        );


      setRole(
        data.predictedRole ||
        data.predicted_role ||
        data.role ||
        ""
      );


      if (
        Array.isArray(
          data.skills
        )
      ) {

        setSkills(
          data.skills
            .map(
              (skill) =>
                String(skill).trim()
            )
            .filter(Boolean)
            .join(", ")
        );

      } else if (
        typeof data.skills ===
        "string"
      ) {

        setSkills(
          data.skills
        );

      } else {

        setSkills("");

      }


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


      setResumeText(
        typeof data.resumeText ===
        "string"
          ? data.resumeText
          : typeof data.resume_text ===
            "string"
          ? data.resume_text
          : ""
      );


      console.log(
        "AI Interview resume data loaded:",
        data
      );


    } catch (error) {

      console.error(
        "Unable to load interview data:",
        error
      );

    }

  }, []);


  // =====================================================
  // LOAD INTERVIEW STATISTICS
  // =====================================================

  const loadInterviewStats =
    useCallback(
      async () => {

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("access_token");

        if (!token) {
          return;
        }


        try {

          setStatsLoading(true);


          const response =
            await API.get(
              "/interview_stats"
            );


          if (response.data) {

            setInterviewStats(
              response.data
            );

          }


        } catch (error) {

          console.error(
            "Unable to load interview statistics:",
            error.response?.data ||
            error.message
          );


        } finally {

          setStatsLoading(false);

        }

      },
      []
    );


  useEffect(() => {

    loadInterviewStats();

  }, [
    loadInterviewStats,
  ]);


  // =====================================================
  // GET SKILL LIST
  // =====================================================

  const getSkillList = () => {

    return skills
      .split(",")
      .map(
        (skill) =>
          skill.trim()
      )
      .filter(Boolean);

  };


  // =====================================================
  // SPEAK QUESTION
  // IMPORTANT:
  // No voiceschanged handler.
  // No undefined speak() function.
  // =====================================================

  const speakQuestion = (text) => {

    if (
      !("speechSynthesis" in window) ||
      !text ||
      !String(text).trim()
    ) {

      return;

    }


    try {

      const synthesis =
        window.speechSynthesis;


      synthesis.cancel();

      synthesis.resume();


      const speech =
        new SpeechSynthesisUtterance(
          String(text).trim()
        );


      speech.lang =
        "en-US";

      speech.rate =
        0.9;

      speech.pitch =
        1;

      speech.volume =
        1;


      const voices =
        synthesis.getVoices();


      const englishVoice =
        voices.find(
          (voice) =>
            voice.lang &&
            voice.lang
              .toLowerCase()
              .startsWith("en")
        );


      if (englishVoice) {

        speech.voice =
          englishVoice;

      }


      speech.onstart = () => {

        console.log(
          "AI interviewer started speaking"
        );

      };


      speech.onend = () => {

        console.log(
          "AI interviewer finished speaking"
        );

      };


      speech.onerror = (
        event
      ) => {

        console.error(
          "AI interviewer speech error:",
          event
        );

      };


      synthesis.speak(
        speech
      );


    } catch (error) {

      console.error(
        "Speech synthesis error:",
        error
      );

    }

  };


  // =====================================================
  // CAMERA + MICROPHONE START
  // BOTH ARE REQUIRED
  // =====================================================

  const startCamera =
    async () => {

      try {

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {

          alert(
            "Camera and microphone are not supported by this browser. Please use Google Chrome."
          );

          return false;

        }


        // Request BOTH camera and microphone.
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });


        const videoTracks =
          stream.getVideoTracks();

        const audioTracks =
          stream.getAudioTracks();


        // Both tracks must exist.
        if (
          videoTracks.length === 0 ||
          audioTracks.length === 0
        ) {

          stream
            .getTracks()
            .forEach(
              (track) =>
                track.stop()
            );


          alert(
            "Both camera and microphone access are required to start the interview."
          );


          return false;

        }


        // Camera must be live.
        const cameraReady =
          videoTracks.some(
            (track) =>
              track.readyState ===
              "live"
          );


        // Microphone must be live.
        const microphoneReady =
          audioTracks.some(
            (track) =>
              track.readyState ===
              "live"
          );


        if (
          !cameraReady ||
          !microphoneReady
        ) {

          stream
            .getTracks()
            .forEach(
              (track) =>
                track.stop()
            );


          alert(
            "Camera and microphone must both be active before the interview can start."
          );


          return false;

        }


        // Save valid stream.
        streamRef.current =
          stream;


        setCameraActive(
          true
        );


        return true;


      } catch (error) {

        console.error(
          "Camera/microphone permission failed:",
          error
        );


        if (
          streamRef.current
        ) {

          streamRef.current
            .getTracks()
            .forEach(
              (track) =>
                track.stop()
            );

          streamRef.current =
            null;

        }


        setCameraActive(
          false
        );


        if (
          error.name ===
          "NotAllowedError"
        ) {

          alert(
            "Camera and microphone access are required. Please click Allow for both permissions and try again."
          );


        } else if (
          error.name ===
          "NotFoundError"
        ) {

          alert(
            "Camera or microphone was not found. Please connect both devices and try again."
          );


        } else if (
          error.name ===
          "NotReadableError"
        ) {

          alert(
            "Your camera or microphone is already being used by another application. Close it and try again."
          );


        } else {

          alert(
            "Both camera and microphone access are required to start the interview."
          );

        }


        return false;

      }

    };


  // =====================================================
  // CAMERA ATTACH
  // =====================================================

  const attachCamera =
    useCallback(
      (element) => {

        videoRef.current =
          element;


        if (
          element &&
          streamRef.current
        ) {

          element.srcObject =
            streamRef.current;


          element
            .play()
            .catch(
              () => {}
            );

        }

      },
      []
    );


  // =====================================================
  // CAMERA REATTACH
  // =====================================================

  useEffect(() => {

    if (
      !cameraActive ||
      !interviewStarted ||
      !streamRef.current
    ) {

      return;

    }


    const timer =
      setTimeout(
        () => {

          if (
            videoRef.current &&
            streamRef.current
          ) {

            videoRef.current.srcObject =
              streamRef.current;


            videoRef.current
              .play()
              .catch(
                () => {}
              );

          }

        },
        100
      );


    return () =>
      clearTimeout(timer);


  }, [
    cameraActive,
    interviewStarted,
    mode,
  ]);


  // =====================================================
  // STOP CAMERA
  // =====================================================

  const stopCamera =
    () => {

      if (
        streamRef.current
      ) {

        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

      }


      streamRef.current =
        null;


      if (
        videoRef.current
      ) {

        videoRef.current.srcObject =
          null;

      }


      setCameraActive(
        false
      );

    };


  // =====================================================
  // SPEECH RECOGNITION
  // =====================================================

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (
      !SpeechRecognition
    ) {

      setVoiceSupported(
        false
      );

      return;

    }


    const recognition =
      new SpeechRecognition();


    recognition.continuous =
      true;

    recognition.interimResults =
      true;

    recognition.lang =
      "en-US";


    recognition.onstart =
      () => {

        setListening(
          true
        );

      };


    recognition.onend =
      () => {

        setListening(
          false
        );

      };


    recognition.onerror =
      (event) => {

        console.error(
          "Speech recognition error:",
          event.error
        );


        setListening(
          false
        );

      };


    recognition.onresult =
      (event) => {

        let transcript =
          "";


        for (
          let i =
            event.resultIndex;

          i <
            event.results.length;

          i++
        ) {

          if (
            event.results[i]
              .isFinal
          ) {

            transcript +=
              event.results[i][0]
                .transcript +
              " ";

          }

        }


        if (
          transcript.trim()
        ) {

          setAnswer(
            (previous) => {

              const separator =
                previous.trim()
                  ? " "
                  : "";


              return (
                previous +
                separator +
                transcript.trim()
              );

            }
          );

        }

      };


    recognitionRef.current =
      recognition;


    return () => {

      try {

        recognition.stop();

      } catch (error) {

        // cleanup

      }


      recognitionRef.current =
        null;

    };


  }, []);


  // =====================================================
  // START LISTENING
  // =====================================================

  const startListening =
    () => {

      if (
        !voiceSupported
      ) {

        alert(
          "Voice recognition is not supported. Please use Google Chrome."
        );

        return;

      }


      if (
        !interviewStarted
      ) {

        alert(
          "Please start the interview first."
        );

        return;

      }


      if (
        !streamRef.current
      ) {

        alert(
          "Microphone access is required for the interview."
        );

        return;

      }


      const microphoneTracks =
        streamRef.current
          .getAudioTracks();


      const microphoneReady =
        microphoneTracks.some(
          (track) =>
            track.readyState ===
            "live"
        );


      if (
        !microphoneReady
      ) {

        alert(
          "Microphone access is required. Please allow microphone access and restart the interview."
        );

        return;

      }


      try {

        recognitionRef.current?.start();

      } catch (error) {

        console.log(
          "Speech recognition already active."
        );

      }

    };


  // =====================================================
  // STOP LISTENING
  // =====================================================

  const stopListening =
    () => {

      try {

        recognitionRef.current?.stop();

      } catch (error) {

        // ignore

      }


      setListening(
        false
      );

    };
      // =====================================================
  // RELOAD LATEST RESUME DATA
  // =====================================================

  const getLatestResumeData = () => {

    let savedData = null;


    // ---------------------------------------------------
    // ACCOUNT-SPECIFIC KEY
    // ---------------------------------------------------

    const accountKey =
      getStorageKey(
        INTERVIEW_DATA_BASE_KEY
      );


    savedData =
      localStorage.getItem(
        accountKey
      );


    // ---------------------------------------------------
    // GENERIC KEY
    // ResumeUpload.js uses this key
    // ---------------------------------------------------

    if (!savedData) {

      savedData =
        localStorage.getItem(
          INTERVIEW_DATA_BASE_KEY
        );

    }


    // ---------------------------------------------------
    // SEARCH OTHER ACCOUNT-SPECIFIC KEYS
    // ---------------------------------------------------

    if (!savedData) {

      for (
        let i = 0;
        i < localStorage.length;
        i++
      ) {

        const key =
          localStorage.key(i);


        if (
          key &&
          key.startsWith(
            `${INTERVIEW_DATA_BASE_KEY}_`
          )
        ) {

          const value =
            localStorage.getItem(
              key
            );


          if (value) {

            savedData =
              value;

            break;

          }

        }

      }

    }


    if (!savedData) {

      return null;

    }


    try {

      return JSON.parse(
        savedData
      );

    } catch (error) {

      console.error(
        "Unable to parse latest resume data:",
        error
      );

      return null;

    }

  };


  // =====================================================
  // START INTERVIEW
  // CAMERA + MICROPHONE REQUIRED
  // =====================================================

  const startInterview =
    async (
      type = "resume"
    ) => {

      // ---------------------------------------------------
      // READ LATEST RESUME DATA DIRECTLY
      // ---------------------------------------------------

      const latestResumeData =
        getLatestResumeData();


      // ---------------------------------------------------
      // ROLE
      // ---------------------------------------------------

      const latestRole =
        latestResumeData?.predictedRole ||
        latestResumeData?.predicted_role ||
        latestResumeData?.role ||
        role ||
        "";


      // ---------------------------------------------------
      // SKILLS
      // ---------------------------------------------------

      let latestSkills = [];


      if (
        Array.isArray(
          latestResumeData?.skills
        )
      ) {

        latestSkills =
          latestResumeData.skills
            .map(
              (skill) =>
                String(skill).trim()
            )
            .filter(Boolean);

      } else if (
        typeof latestResumeData?.skills ===
        "string"
      ) {

        latestSkills =
          latestResumeData.skills
            .split(",")
            .map(
              (skill) =>
                skill.trim()
            )
            .filter(Boolean);

      } else {

        latestSkills =
          getSkillList();

      }


      // ---------------------------------------------------
      // EDUCATION
      // ---------------------------------------------------

      const latestEducation =
        Array.isArray(
          latestResumeData?.education
        )
          ? latestResumeData.education
          : education;


      // ---------------------------------------------------
      // EXPERIENCE
      // ---------------------------------------------------

      const latestExperience =
        Array.isArray(
          latestResumeData?.experience
        )
          ? latestResumeData.experience
          : experience;


      // ---------------------------------------------------
      // RESUME TEXT
      // ---------------------------------------------------

      const latestResumeText =
        latestResumeData?.resumeText ||
        latestResumeData?.resume_text ||
        resumeText ||
        "";


      console.log(
        "================================"
      );

      console.log(
        "START INTERVIEW CLICKED"
      );

      console.log(
        "Interview type:",
        type
      );

      console.log(
        "Latest resume data:",
        latestResumeData
      );

      console.log(
        "Role:",
        latestRole
      );

      console.log(
        "Skills:",
        latestSkills
      );

      console.log(
        "================================"
      );


      // ---------------------------------------------------
      // RESUME VALIDATION
      // ---------------------------------------------------

      const resumeInterview =
        type === "resume" ||
        type === "resume_questions";


      if (
        resumeInterview &&
        !String(
          latestRole
        ).trim()
      ) {

        alert(
          "Please analyze your resume first."
        );

        return;

      }


      // ---------------------------------------------------
      // TECHNICAL VALIDATION
      // ---------------------------------------------------

      if (
        type === "technical" &&
        latestSkills.length === 0
      ) {

        alert(
          "No resume skills were detected. Please analyze your resume first."
        );

        return;

      }


      // ---------------------------------------------------
      // UPDATE STATE
      // ---------------------------------------------------

      setRole(
        String(
          latestRole
        )
      );


      setSkills(
        latestSkills.join(", ")
      );


      setEducation(
        latestEducation || []
      );


      setExperience(
        latestExperience || []
      );


      setResumeText(
        String(
          latestResumeText
        )
      );


      // ---------------------------------------------------
      // TARGET JOB
      // ---------------------------------------------------

      const cleanTargetJob =
        String(
          targetJob || ""
        ).trim();


      const cleanJobDescription =
        String(
          jobDescription || ""
        ).trim();


      try {

        localStorage.setItem(
          getStorageKey(
            TARGET_JOB_BASE_KEY
          ),
          cleanTargetJob
        );


        localStorage.setItem(
          getStorageKey(
            JOB_DESCRIPTION_BASE_KEY
          ),
          cleanJobDescription
        );

      } catch (error) {

        console.error(
          "Unable to save target job data:",
          error
        );

      }


      // ---------------------------------------------------
      // LOADING
      // ---------------------------------------------------

      setLoading(true);


      try {

        // =================================================
        // IMPORTANT:
        // EVERY INTERVIEW REQUIRES CAMERA + MICROPHONE
        // =================================================

        const cameraReady =
          await startCamera();


        if (!cameraReady) {

          setLoading(false);

          return;

        }


        // =================================================
        // VERIFY ACTIVE STREAM
        // =================================================

        const activeStream =
          streamRef.current;


        if (!activeStream) {

          alert(
            "Camera and microphone access are required to start the interview."
          );

          setLoading(false);

          return;

        }


        const videoTracks =
          activeStream.getVideoTracks();


        const audioTracks =
          activeStream.getAudioTracks();


        const cameraReadyNow =
          videoTracks.some(
            (track) =>
              track.readyState ===
              "live"
          );


        const microphoneReadyNow =
          audioTracks.some(
            (track) =>
              track.readyState ===
              "live"
          );


        if (
          !cameraReadyNow ||
          !microphoneReadyNow
        ) {

          stopCamera();


          alert(
            "Both camera and microphone access must be granted before the interview can start."
          );


          setLoading(false);

          return;

        }


        // =================================================
        // BACKEND REQUEST
        // =================================================

        const response =
          await API.post(
            "/start_interview",
            {

              interview_type:
                type,

              role:
                String(
                  latestRole
                ).trim(),

              skills:
                latestSkills,

              education:
                latestEducation || [],

              experience:
                latestExperience || [],

              resume_text:
                String(
                  latestResumeText
                ),

              target_job:
                cleanTargetJob,

              job_description:
                cleanJobDescription,

            }
          );


        // =================================================
        // QUESTIONS
        // =================================================

        const receivedQuestions =
          Array.isArray(
            response.data?.questions
          )
            ? response.data.questions
            : [];


        if (
          receivedQuestions.length === 0
        ) {

          stopCamera();


          alert(
            "No interview questions were generated."
          );


          setLoading(false);

          return;

        }


        // =================================================
        // START INTERVIEW STATE
        // =================================================

        setInterviewType(
          type
        );


        setQuestions(
          receivedQuestions
        );


        setCurrentQuestion(
          0
        );


        setAnswer(
          ""
        );


        setFeedback(
          null
        );


        setResults(
          []
        );


        setInterviewFinished(
          false
        );


        setInterviewStarted(
          true
        );


        setMode(
          "interview"
        );


        console.log(
          "Interview started successfully."
        );


      } catch (error) {

        console.error(
          "Interview start error:",
          error.response?.data ||
          error.message
        );


        stopCamera();


        alert(
          error.response?.data?.message ||
          "Unable to start the interview."
        );


      } finally {

        setLoading(
          false
        );

      }

    };


  // =====================================================
  // AUTOMATIC QUESTION SPEECH
  // =====================================================

  useEffect(() => {

    if (
      !interviewStarted ||
      interviewFinished ||
      questions.length === 0
    ) {

      return;

    }


    const currentQuestionData =
      questions[
        currentQuestion
      ];


    // Support both:
    // "Tell me about yourself."
    //
    // and:
    // { question: "Tell me about yourself." }

    const questionText =
      typeof currentQuestionData ===
      "string"
        ? currentQuestionData
        : currentQuestionData?.question ||
          currentQuestionData?.text ||
          "";


    if (
      !String(
        questionText
      ).trim()
    ) {

      return;

    }


    console.log(
      "AI interviewer question:",
      questionText
    );


    const timer =
      setTimeout(
        () => {

          speakQuestion(
            String(
              questionText
            ).trim()
          );

        },
        800
      );


    return () => {

      clearTimeout(
        timer
      );


      if (
        "speechSynthesis" in
        window
      ) {

        window.speechSynthesis.cancel();

      }

    };

  }, [
    interviewStarted,
    currentQuestion,
    questions,
    interviewFinished,
  ]);


  // =====================================================
  // EVALUATE ANSWER
  // =====================================================

  const submitAnswer =
    async () => {

      if (
        !answer.trim()
      ) {

        alert(
          "Please answer the question."
        );

        return;

      }


      // ---------------------------------------------------
      // STOP VOICE INPUT
      // ---------------------------------------------------

      stopListening();


      // ---------------------------------------------------
      // VERIFY MICROPHONE
      // ---------------------------------------------------

      if (
        !streamRef.current
      ) {

        alert(
          "Camera and microphone access are required during the interview."
        );

        return;

      }


      const audioTracks =
        streamRef.current
          .getAudioTracks();


      const microphoneReady =
        audioTracks.some(
          (track) =>
            track.readyState ===
            "live"
        );


      if (
        !microphoneReady
      ) {

        alert(
          "Microphone access has been lost. The interview cannot continue."
        );

        return;

      }


      setEvaluationLoading(
        true
      );


      try {

        const currentQuestionData =
          questions[
            currentQuestion
          ];


        const questionText =
          typeof currentQuestionData ===
          "string"
            ? currentQuestionData
            : currentQuestionData?.question ||
              currentQuestionData?.text ||
              "";


        const response =
          await API.post(
            "/evaluate_answer",
            {

              question:
                questionText,

              answer:
                answer.trim(),

            }
          );


        setFeedback(
          response.data
        );


      } catch (error) {

        console.error(
          "Evaluation error:",
          error.response?.data ||
          error.message
        );


        alert(
          error.response?.data?.message ||
          "Unable to evaluate answer."
        );


      } finally {

        setEvaluationLoading(
          false
        );

      }

    };


  // =====================================================
  // SAVE INTERVIEW
  // IMPORTANT:
  // KEEP OVERALL SCORE CALCULATION
  // =====================================================

  const saveInterview =
    async (
      finalResults
    ) => {

      if (
        !finalResults ||
        finalResults.length === 0
      ) {

        return false;

      }


      try {

        setSavingInterview(
          true
        );


        const scores =
          finalResults
            .map(
              (item) =>
                Number(
                  item?.evaluation?.score ||
                  0
                )
            )
            .filter(
              (score) =>
                !Number.isNaN(
                  score
                )
            );


        const overallScore =
          scores.length > 0
            ? Number(
                (
                  scores.reduce(
                    (
                      total,
                      score
                    ) =>
                      total +
                      score,
                    0
                  ) /
                  scores.length
                ).toFixed(2)
              )
            : 0;


        console.log(
          "Final Overall Score:",
          overallScore
        );


        await API.post(
          "/save_interview",
          {

            interview_type:
              interviewType,

            role:
              role,

            skills:
              getSkillList(),

            overall_score:
              overallScore,

            total_questions:
              finalResults.length,

            results:
              finalResults,

          }
        );


        await loadInterviewStats();


        return true;


      } catch (error) {

        console.error(
          "Save interview error:",
          error.response?.data ||
          error.message
        );


        return false;


      } finally {

        setSavingInterview(
          false
        );

      }

    };


  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const nextQuestion =
    async () => {

      // Stop AI speech before changing question.
      if (
        "speechSynthesis" in
        window
      ) {

        window.speechSynthesis.cancel();

      }


      stopListening();


      // ---------------------------------------------------
      // CAMERA + MICROPHONE MUST REMAIN ACTIVE
      // ---------------------------------------------------

      if (
        !streamRef.current
      ) {

        alert(
          "Camera and microphone access are required to continue the interview."
        );

        return;

      }


      const activeStream =
        streamRef.current;


      const cameraTracks =
        activeStream.getVideoTracks();


      const microphoneTracks =
        activeStream.getAudioTracks();


      const cameraReady =
        cameraTracks.some(
          (track) =>
            track.readyState ===
            "live"
        );


      const microphoneReady =
        microphoneTracks.some(
          (track) =>
            track.readyState ===
            "live"
        );


      if (
        !cameraReady ||
        !microphoneReady
      ) {

        alert(
          "Both camera and microphone access must remain active during the interview."
        );

        return;

      }


      // ---------------------------------------------------
      // FEEDBACK REQUIRED
      // ---------------------------------------------------

      if (
        !feedback
      ) {

        alert(
          "Please evaluate your answer before continuing."
        );

        return;

      }


      // ---------------------------------------------------
      // CURRENT QUESTION
      // ---------------------------------------------------

      const currentQuestionData =
        questions[
          currentQuestion
        ];


      const questionText =
        typeof currentQuestionData ===
        "string"
          ? currentQuestionData
          : currentQuestionData?.question ||
            currentQuestionData?.text ||
            "";


      // ---------------------------------------------------
      // CURRENT RESULT
      // ---------------------------------------------------

      const currentResult = {

        question:
          questionText,

        answer:
          answer.trim(),

        evaluation:
          feedback,

      };


      // ---------------------------------------------------
      // FINAL RESULTS ARRAY
      // ---------------------------------------------------

      const finalResults = [
        ...results,
        currentResult,
      ];


      // =================================================
      // MORE QUESTIONS
      // =================================================

      if (
        currentQuestion <
        questions.length - 1
      ) {

        setResults(
          finalResults
        );


        setCurrentQuestion(
          (previous) =>
            previous + 1
        );


        setAnswer(
          ""
        );


        setFeedback(
          null
        );


        return;

      }


      // =================================================
      // LAST QUESTION
      // =================================================

      stopCamera();


      setResults(
        finalResults
      );


      await saveInterview(
        finalResults
      );


      setInterviewFinished(
        true
      );


      setInterviewStarted(
        false
      );


      setMode(
        "results"
      );

    };
      // =====================================================
  // RESET INTERVIEW
  // =====================================================

  const resetInterview =
    () => {

      stopListening();

      stopCamera();

      window.speechSynthesis?.cancel();


      setQuestions([]);

      setCurrentQuestion(0);

      setAnswer("");

      setFeedback(null);

      setResults([]);

      setInterviewStarted(false);

      setInterviewFinished(false);

      setInterviewType("resume");

      setMode("hub");

      loadInterviewStats();

    };


  // =====================================================
  // SESSION READINESS
  // =====================================================

  const sessionReadinessScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item?.evaluation?.score ||
                0
              ),
            0
          ) /
          results.length
        )
      : 0;


  const displayReadiness =
    interviewStats.has_history
      ? Number(
          interviewStats.latest_score ||
          0
        )
      : sessionReadinessScore;


  // =====================================================
  // INTERVIEW TYPE LABEL
  // =====================================================

  const getInterviewTypeLabel =
    (type) => {

      const labels = {

        resume:
          "Resume Mock Interview",

        technical:
          "Technical Practice",

        hr:
          "HR Interview",

        behavioral:
          "Behavioral Practice",

        resume_questions:
          "Resume Questions",

      };


      return (
        labels[type] ||
        "Interview Practice"
      );

    };


  // =====================================================
  // INTERVIEW TYPE DESCRIPTION
  // =====================================================

  const getInterviewTypeDescription =
    (type) => {

      const descriptions = {

        resume:
          "A personalized mock interview generated from your actual resume.",

        technical:
          "Technical questions based on the skills detected in your resume.",

        hr:
          "Common recruiter and HR questions to prepare for real interviews.",

        behavioral:
          "Situation-based questions designed to practice workplace behavior.",

        resume_questions:
          "Direct questions about your projects, skills, education and experience.",

      };


      return (
        descriptions[type] ||
        ""
      );

    };


  // =====================================================
  // PERFORMANCE ANALYSIS
  // =====================================================

  const getPerformanceAnalysis =
    () => {

      if (
        !results ||
        results.length === 0
      ) {

        return {

          overall: 0,

          communication: 0,

          technical: 0,

          structure: 0,

          practical: 0,

          strongest:
            "Not enough data",

          weakest:
            "Not enough data",

          plan: [],

        };

      }


      const scores =
        results.map(
          (item) =>
            Number(
              item?.evaluation?.score ||
              0
            )
        );


      const average =
        scores.length > 0
          ? Math.round(
              scores.reduce(
                (a, b) =>
                  a + b,
                0
              ) /
              scores.length
            )
          : 0;


      // ---------------------------------------------------
      // GET DETAILED METRIC AVERAGE
      // ---------------------------------------------------

      const getMetricAverage =
        (metric) => {

          const values =
            results
              .map(
                (item) =>
                  Number(
                    item?.evaluation
                      ?.analysis?.[metric]
                  )
              )
              .filter(
                (value) =>
                  !Number.isNaN(
                    value
                  )
              );


          if (
            values.length === 0
          ) {

            return average;

          }


          return Math.round(
            values.reduce(
              (a, b) =>
                a + b,
              0
            ) /
            values.length
          );

        };


      const communication =
        getMetricAverage(
          "clarity"
        );


      const technical =
        getMetricAverage(
          "technical"
        );


      const structure =
        getMetricAverage(
          "structure"
        );


      const practical =
        getMetricAverage(
          "practical"
        );


      const areas = [

        {
          name:
            "Communication",

          score:
            communication,
        },

        {
          name:
            "Technical Knowledge",

          score:
            technical,
        },

        {
          name:
            "Answer Structure",

          score:
            structure,
        },

        {
          name:
            "Practical Understanding",

          score:
            practical,
        },

      ];


      const strongestArea =
        [...areas].sort(
          (a, b) =>
            b.score -
            a.score
        )[0];


      const weakestArea =
        [...areas].sort(
          (a, b) =>
            a.score -
            b.score
        )[0];


      const plan = [];


      if (
        communication < 70
      ) {

        plan.push(
          "Practice giving clear and concise answers without unnecessary details."
        );

      }


      if (
        technical < 70
      ) {

        plan.push(
          "Review the technical concepts and skills mentioned in your resume."
        );

      }


      if (
        structure < 70
      ) {

        plan.push(
          "Structure answers with a clear explanation, example and result."
        );

      }


      if (
        practical < 70
      ) {

        plan.push(
          "Prepare real examples showing how you applied your skills in projects or experience."
        );

      }


      if (
        plan.length === 0
      ) {

        plan.push(
          "Continue practicing regularly to maintain consistent interview performance."
        );

      }


      return {

        overall:
          average,

        communication,

        technical,

        structure,

        practical,

        strongest:
          strongestArea.name,

        weakest:
          weakestArea.name,

        plan,

      };

    };


  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {

    return () => {

      try {

        recognitionRef.current?.stop();

      } catch (error) {

        // cleanup

      }


      window.speechSynthesis?.cancel();


      if (
        streamRef.current
      ) {

        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

      }

    };

  }, []);


  // =====================================================
  // INTERVIEW CENTER / HUB
  // =====================================================

  if (
    mode === "hub"
  ) {

    return (

      <Box
        sx={{
          minHeight: "100vh",

          py: {
            xs: 4,
            md: 7,
          },

          background:
            "radial-gradient(circle at 10% 10%,rgba(124,77,255,.13),transparent 25%),radial-gradient(circle at 90% 20%,rgba(25,118,210,.12),transparent 25%),linear-gradient(180deg,#f7f9ff,#edf2fa)",
        }}
      >

        <Container
          maxWidth="lg"
        >

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <Box
            sx={{
              mb: 5,
            }}
          >

            <Chip
              icon={
                <AutoAwesome />
              }
              label="CAREER PREPARATION CENTER"
              sx={{
                mb: 2,
                fontWeight: 800,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg,#eaf1ff,#f1eaff)",
              }}
            />


            <Typography
              variant="h2"
              sx={{
                fontWeight: 950,
                letterSpacing: "-2px",
                color: "#101828",

                fontSize: {
                  xs: "2.4rem",
                  md: "4rem",
                },
              }}
            >
              Become interview-ready.
            </Typography>


            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 760,
                color: "#667085",

                fontSize: {
                  xs: "1rem",
                  md: "1.15rem",
                },

                lineHeight: 1.8,
              }}
            >
              Practice interviews, improve your answers,
              strengthen your technical knowledge and
              build confidence before speaking to a real
              recruiter.
            </Typography>

          </Box>


          {/* =================================================
              INTERVIEW PROGRESS
          ================================================= */}

          <Card
            sx={{
              mb: 4,
              borderRadius: 5,
              overflow: "hidden",

              background:
                "linear-gradient(135deg,#101828,#1d2b64,#5b3fb8)",

              color: "white",

              boxShadow:
                "0 25px 60px rgba(41,55,120,.25)",
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },
              }}
            >

              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}

                justifyContent="space-between"

                alignItems={{
                  xs: "flex-start",
                  md: "center",
                }}

                spacing={2}
              >

                <Box>

                  <Typography
                    variant="h5"
                    fontWeight={950}
                  >
                    📈 Your Interview Progress
                  </Typography>


                  <Typography
                    sx={{
                      mt: 1,
                      color:
                        "rgba(255,255,255,.7)",
                    }}
                  >
                    Your progress is saved automatically
                    after completed interviews.
                  </Typography>

                </Box>


                {statsLoading && (

                  <CircularProgress
                    size={28}
                    sx={{
                      color: "white",
                    }}
                  />

                )}

              </Stack>


              <Grid
                container
                spacing={2}
                sx={{
                  mt: 2,
                }}
              >

                {[
                  [
                    "Latest Score",
                    `${Number(
                      interviewStats.latest_score ||
                      0
                    ).toFixed(0)}/100`,
                  ],

                  [
                    "Average Score",
                    `${Number(
                      interviewStats.average_score ||
                      0
                    ).toFixed(0)}/100`,
                  ],

                  [
                    "Best Score",
                    `${Number(
                      interviewStats.best_score ||
                      0
                    ).toFixed(0)}/100`,
                  ],

                  [
                    "Improvement",
                    `${
                      Number(
                        interviewStats.improvement ||
                        0
                      ) >= 0
                        ? "+"
                        : ""
                    }${Number(
                      interviewStats.improvement ||
                      0
                    ).toFixed(0)} pts`,
                  ],

                  [
                    "Interviews",
                    interviewStats.total_interviews ||
                    0,
                  ],

                  [
                    "Questions",
                    interviewStats.total_questions ||
                    0,
                  ],

                ].map(
                  (item) => (

                    <Grid
                      item
                      xs={6}
                      sm={4}
                      md={2}
                      key={item[0]}
                    >

                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          height: "100%",
                          borderRadius: 3,

                          background:
                            "rgba(255,255,255,.09)",

                          border:
                            "1px solid rgba(255,255,255,.12)",

                          color: "white",
                        }}
                      >

                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "rgba(255,255,255,.62)",
                          }}
                        >
                          {item[0]}
                        </Typography>


                        <Typography
                          sx={{
                            mt: 1,

                            fontSize: {
                              xs: "1.25rem",
                              md: "1.45rem",
                            },

                            fontWeight: 950,
                          }}
                        >
                          {item[1]}
                        </Typography>

                      </Paper>

                    </Grid>

                  )
                )}

              </Grid>


              {/* =================================================
                  READINESS
              ================================================= */}

              <Box
                sx={{
                  mt: 3,
                }}
              >

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    mb: 1,
                  }}
                >

                  <Typography
                    fontWeight={800}
                  >
                    Interview Readiness
                  </Typography>


                  <Chip
                    label={
                      interviewStats.readiness_level ||
                      "Not Started"
                    }

                    sx={{
                      color: "white",

                      background:
                        "rgba(255,255,255,.14)",

                      fontWeight: 800,
                    }}
                  />

                </Stack>


                <LinearProgress
                  variant="determinate"

                  value={
                    Math.max(
                      0,
                      Math.min(
                        100,
                        displayReadiness
                      )
                    )
                  }

                  sx={{
                    height: 12,
                    borderRadius: 10,

                    background:
                      "rgba(255,255,255,.12)",

                    "& .MuiLinearProgress-bar":
                      {
                        borderRadius: 10,

                        background:
                          "linear-gradient(90deg,#42a5f5,#b388ff)",
                      },
                  }}
                />

              </Box>

            </CardContent>

          </Card>


          {/* =================================================
              RECENT ATTEMPTS
          ================================================= */}

          {interviewStats.has_history &&
            interviewStats.recent_attempts?.length >
              0 && (

              <Card
                sx={{
                  mb: 4,
                  borderRadius: 5,
                  background: "white",
                }}
              >

                <CardContent
                  sx={{
                    p: {
                      xs: 3,
                      md: 4,
                    },
                  }}
                >

                  <Typography
                    variant="h5"
                    fontWeight={950}
                  >
                    🕒 Recent Interview Attempts
                  </Typography>


                  <Typography
                    sx={{
                      mt: 1,
                      color: "#667085",
                    }}
                  >
                    Track how your interview performance
                    changes over time.
                  </Typography>


                  <Grid
                    container
                    spacing={2}
                    sx={{
                      mt: 1,
                    }}
                  >

                    {interviewStats.recent_attempts
                      .slice(0, 5)
                      .map(
                        (
                          attempt,
                          index
                        ) => (

                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={`${attempt.created_at}-${index}`}
                          >

                            <Paper
                              elevation={0}
                              sx={{
                                p: 2.5,
                                borderRadius: 3,

                                border:
                                  "1px solid #e5e7eb",

                                background:
                                  "#f8fafc",
                              }}
                            >

                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >

                                <Box>

                                  <Typography
                                    fontWeight={900}
                                  >
                                    Attempt {index + 1}
                                  </Typography>


                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      mt: 0.5,
                                    }}
                                  >
                                    {getInterviewTypeLabel(
                                      attempt.interview_type
                                    )}
                                  </Typography>

                                </Box>


                                <Chip
                                  label={`${Number(
                                    attempt.score ||
                                    0
                                  ).toFixed(0)}/100`}

                                  color="primary"

                                  sx={{
                                    fontWeight: 900,
                                  }}
                                />

                              </Stack>


                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 1.5,
                                }}
                              >
                                {attempt.total_questions ||
                                  0}{" "}
                                questions
                              </Typography>

                            </Paper>

                          </Grid>

                        )
                      )}

                  </Grid>

                </CardContent>

              </Card>

            )}


          {/* =================================================
              AI RESUME MOCK INTERVIEW
          ================================================= */}

          <Card
            sx={{
              mb: 4,
              borderRadius: 5,

              background:
                "linear-gradient(135deg,#ffffff,#f3efff)",

              border:
                "1px solid #e4defc",

              boxShadow:
                "0 15px 40px rgba(63,52,120,.10)",
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },
              }}
            >

              <Grid
                container
                spacing={4}
                alignItems="center"
              >

                <Grid
                  item
                  xs={12}
                  md={8}
                >

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >

                    <SmartToy
                      sx={{
                        fontSize: 38,
                        color: "#7c4dff",
                      }}
                    />


                    <Typography
                      variant="h5"
                      fontWeight={950}
                    >
                      AI Resume Mock Interview
                    </Typography>

                  </Stack>


                  <Typography
                    sx={{
                      mt: 1.5,
                      color: "#667085",
                      lineHeight: 1.7,
                    }}
                  >
                    A personalized face-to-face mock interview
                    generated from your actual resume. The AI
                    interviewer can ask about your skills,
                    projects, education and experience.
                  </Typography>


                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{
                      mt: 2,
                    }}
                  >

                    <Chip label="Resume Based" />

                    <Chip label="Camera" />

                    <Chip label="Voice" />

                    <Chip label="Projects" />

                    <Chip label="AI Feedback" />

                  </Stack>

                </Grid>


                <Grid
                  item
                  xs={12}
                  md={4}
                >

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"

                    endIcon={
                      <ArrowForward />
                    }

                    onClick={() =>
                      startInterview(
                        "resume"
                      )
                    }

                    disabled={
                      loading
                    }

                    sx={{
                      py: 1.7,
                      borderRadius: 3,
                      fontWeight: 900,

                      background:
                        "linear-gradient(135deg,#1976d2,#7c4dff)",
                    }}
                  >

                    {loading
                      ? "Preparing..."
                      : "Start Mock Interview"}

                  </Button>

                </Grid>

              </Grid>

            </CardContent>

          </Card>


          {/* =================================================
              PRACTICE CENTER
          ================================================= */}

          <Typography
            variant="h5"
            fontWeight={950}
            sx={{
              mb: 2.5,
            }}
          >
            Practice Center
          </Typography>


          <Grid
            container
            spacing={2.5}
          >

            {[
              {
                key: "technical",

                title:
                  "Technical Practice",

                text:
                  "Technical questions based on the skills detected in your resume.",

                icon:
                  <Code />,

                gradient:
                  "linear-gradient(135deg,#1976d2,#42a5f5)",
              },

              {
                key: "hr",

                title:
                  "HR Interview",

                text:
                  "Practice common recruiter and HR interview questions.",

                icon:
                  <Groups />,

                gradient:
                  "linear-gradient(135deg,#7c4dff,#b388ff)",
              },

              {
                key: "behavioral",

                title:
                  "Behavioral Practice",

                text:
                  "Practice workplace situations, teamwork and problem-solving questions.",

                icon:
                  <Psychology />,

                gradient:
                  "linear-gradient(135deg,#00897b,#26a69a)",
              },

              {
                key:
                  "resume_questions",

                title:
                  "Resume Questions",

                text:
                  "Practice explaining projects, skills, education and achievements from your resume.",

                icon:
                  <WorkOutline />,

                gradient:
                  "linear-gradient(135deg,#ef6c00,#ffb300)",
              },

            ].map(
              (item) => (

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={item.key}
                >

                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 4,

                      transition:
                        "all .3s ease",

                      "&:hover": {
                        transform:
                          "translateY(-8px)",

                        boxShadow:
                          "0 20px 40px rgba(0,0,0,.12)",
                      },
                    }}
                  >

                    <CardContent
                      sx={{
                        p: 3,
                      }}
                    >

                      <Box
                        sx={{
                          width: 55,
                          height: 55,
                          borderRadius: 3,

                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",

                          color: "white",

                          background:
                            item.gradient,

                          mb: 2.5,
                        }}
                      >
                        {item.icon}
                      </Box>


                      <Typography
                        variant="h6"
                        fontWeight={900}
                      >
                        {item.title}
                      </Typography>


                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: "#667085",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.text}
                      </Typography>


                      <Button
                        sx={{
                          mt: 2,
                          fontWeight: 800,
                        }}

                        endIcon={
                          <ArrowForward />
                        }

                        onClick={() =>
                          startInterview(
                            item.key
                          )
                        }

                        disabled={
                          loading
                        }
                      >
                        Practice
                      </Button>

                    </CardContent>

                  </Card>

                </Grid>

              )
            )}

          </Grid>
                    {/* =================================================
              JOB SEEKER PREPARATION CHECKLIST
          ================================================= */}

          <Card
            sx={{
              mt: 4,
              borderRadius: 5,
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },
              }}
            >

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >

                <EmojiEvents
                  color="primary"
                />

                <Typography
                  variant="h5"
                  fontWeight={950}
                >
                  Job Seeker Preparation Checklist
                </Typography>

              </Stack>


              <Grid
                container
                spacing={2}
                sx={{
                  mt: 1,
                }}
              >

                {[
                  [
                    "Know your resume",
                    "Be ready to explain every important section.",
                  ],

                  [
                    "Prepare your projects",
                    "Explain the problem, approach, tools and result.",
                  ],

                  [
                    "Strengthen technical skills",
                    "Practice concepts relevant to your career direction.",
                  ],

                  [
                    "Prepare HR answers",
                    "Practice common recruiter questions.",
                  ],

                  [
                    "Practice behavioral answers",
                    "Use real examples from your experience.",
                  ],

                  [
                    "Improve communication",
                    "Give clear, structured and concise answers.",
                  ],

                ].map(
                  (
                    item,
                    index
                  ) => (

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={index}
                    >

                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,

                          background:
                            "#f7f9fc",

                          border:
                            "1px solid #e6eaf0",
                        }}
                      >

                        <Stack
                          direction="row"
                          spacing={1.5}
                        >

                          <CheckCircle
                            color="success"
                          />

                          <Box>

                            <Typography
                              fontWeight={800}
                            >
                              {item[0]}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {item[1]}
                            </Typography>

                          </Box>

                        </Stack>

                      </Paper>

                    </Grid>

                  )
                )}

              </Grid>

            </CardContent>

          </Card>

        </Container>

      </Box>

    );

  }


  // =====================================================
  // COMPLETED INTERVIEW / RESULTS
  // =====================================================

  if (
    interviewFinished
  ) {

    const analysis =
      getPerformanceAnalysis();


    const performanceAreas = [

      {
        title:
          "Communication",

        value:
          analysis.communication,

        icon:
          <RecordVoiceOver />,
      },

      {
        title:
          "Technical Knowledge",

        value:
          analysis.technical,

        icon:
          <Code />,
      },

      {
        title:
          "Answer Structure",

        value:
          analysis.structure,

        icon:
          <AutoAwesome />,
      },

      {
        title:
          "Practical Understanding",

        value:
          analysis.practical,

        icon:
          <WorkOutline />,
      },

    ];


    return (

      <Box
        sx={{
          minHeight: "100vh",

          py: {
            xs: 4,
            md: 7,
          },

          background:
            "linear-gradient(180deg,#f7f9ff,#edf2fa)",
        }}
      >

        <Container
          maxWidth="lg"
        >

          {/* =================================================
              RESULTS HEADER
          ================================================= */}

          <Card
            sx={{
              borderRadius: 5,
              mb: 3,
              overflow: "hidden",

              background:
                "linear-gradient(135deg,#101828,#243b80,#6a3fc7)",

              color: "white",
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

              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}

                justifyContent="space-between"

                alignItems={{
                  xs: "flex-start",
                  md: "center",
                }}

                spacing={3}
              >

                <Box>

                  <Chip
                    icon={
                      <CheckCircle />
                    }

                    label="INTERVIEW COMPLETED"

                    sx={{
                      mb: 2,
                      color: "white",

                      background:
                        "rgba(255,255,255,.14)",

                      fontWeight: 900,
                    }}
                  />


                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 950,
                      letterSpacing: "-1px",

                      fontSize: {
                        xs: "2.1rem",
                        md: "3.2rem",
                      },
                    }}
                  >
                    Interview Performance
                  </Typography>


                  <Typography
                    sx={{
                      mt: 1.5,
                      maxWidth: 720,

                      color:
                        "rgba(255,255,255,.75)",

                      lineHeight: 1.8,
                    }}
                  >
                    Here is a breakdown of how you performed,
                    where you were strongest and what you can
                    improve before your next interview.
                  </Typography>

                </Box>


                {/* =================================================
                    OVERALL SCORE
                ================================================= */}

                <Box
                  sx={{
                    minWidth: {
                      xs: "100%",
                      md: 180,
                    },

                    textAlign: "center",

                    p: 3,

                    borderRadius: 4,

                    background:
                      "rgba(255,255,255,.10)",

                    border:
                      "1px solid rgba(255,255,255,.15)",
                  }}
                >

                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        "rgba(255,255,255,.7)",
                    }}
                  >
                    Overall Score
                  </Typography>


                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: "3.4rem",
                      lineHeight: 1,
                      fontWeight: 950,
                    }}
                  >
                    {analysis.overall}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 0.5,

                      color:
                        "rgba(255,255,255,.7)",
                    }}
                  >
                    out of 100
                  </Typography>

                </Box>

              </Stack>

            </CardContent>

          </Card>


          {/* =================================================
              STRONGEST + WEAKEST
          ================================================= */}

          <Grid
            container
            spacing={2.5}
            sx={{
              mb: 3,
            }}
          >

            <Grid
              item
              xs={12}
              md={6}
            >

              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,

                  border:
                    "1px solid #d8f0dc",

                  background:
                    "linear-gradient(135deg,#ffffff,#f0fff3)",
                }}
              >

                <CardContent
                  sx={{
                    p: 3,
                  }}
                >

                  <Chip
                    icon={
                      <EmojiEvents />
                    }

                    label="Strongest Area"

                    color="success"

                    sx={{
                      fontWeight: 900,
                    }}
                  />


                  <Typography
                    variant="h5"
                    fontWeight={950}
                    sx={{
                      mt: 2,
                    }}
                  >
                    {analysis.strongest}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 1,
                      color: "#667085",
                      lineHeight: 1.7,
                    }}
                  >
                    This was the strongest area across
                    the evaluated answers in this interview.
                  </Typography>

                </CardContent>

              </Card>

            </Grid>


            <Grid
              item
              xs={12}
              md={6}
            >

              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,

                  border:
                    "1px solid #ffe0b2",

                  background:
                    "linear-gradient(135deg,#ffffff,#fff8ed)",
                }}
              >

                <CardContent
                  sx={{
                    p: 3,
                  }}
                >

                  <Chip
                    label="Area to Improve"

                    sx={{
                      fontWeight: 900,

                      background:
                        "#fff0d6",
                    }}
                  />


                  <Typography
                    variant="h5"
                    fontWeight={950}
                    sx={{
                      mt: 2,
                    }}
                  >
                    {analysis.weakest}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 1,
                      color: "#667085",
                      lineHeight: 1.7,
                    }}
                  >
                    Focus additional preparation on this
                    area during your next practice session.
                  </Typography>

                </CardContent>

              </Card>

            </Grid>

          </Grid>


          {/* =================================================
              PERFORMANCE BREAKDOWN
          ================================================= */}

          <Card
            sx={{
              mb: 3,
              borderRadius: 4,
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },
              }}
            >

              <Typography
                variant="h5"
                fontWeight={950}
              >
                Performance Breakdown
              </Typography>


              <Typography
                sx={{
                  mt: 1,
                  color: "#667085",
                }}
              >
                Review the main areas that influence the quality
                of your interview answers.
              </Typography>


              <Grid
                container
                spacing={2}
                sx={{
                  mt: 1,
                }}
              >

                {performanceAreas.map(
                  (item) => (

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      key={item.title}
                    >

                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,

                          border:
                            "1px solid #e5e7eb",

                          background:
                            "#f8fafc",

                          height: "100%",
                        }}
                      >

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >

                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: 2,

                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",

                              background:
                                "#eef4ff",

                              color:
                                "#1976d2",
                            }}
                          >
                            {item.icon}
                          </Box>


                          <Typography
                            fontWeight={850}
                          >
                            {item.title}
                          </Typography>

                        </Stack>


                        <Typography
                          sx={{
                            mt: 2,
                            fontSize: "2rem",
                            fontWeight: 950,
                          }}
                        >

                          {item.value}

                          <Typography
                            component="span"
                            sx={{
                              ml: 0.5,
                              fontSize: "0.9rem",
                              color: "#667085",
                              fontWeight: 700,
                            }}
                          >
                            /100
                          </Typography>

                        </Typography>


                        <LinearProgress
                          variant="determinate"

                          value={
                            Math.max(
                              0,
                              Math.min(
                                100,
                                item.value
                              )
                            )
                          }

                          sx={{
                            mt: 1.5,
                            height: 8,
                            borderRadius: 10,
                          }}
                        />

                      </Paper>

                    </Grid>

                  )
                )}

              </Grid>

            </CardContent>

          </Card>


          {/* =================================================
              IMPROVEMENT PLAN
          ================================================= */}

          <Card
            sx={{
              mb: 3,
              borderRadius: 4,

              background:
                "linear-gradient(135deg,#ffffff,#f5f1ff)",

              border:
                "1px solid #e5ddff",
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },
              }}
            >

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >

                <AutoAwesome
                  sx={{
                    color: "#7c4dff",
                  }}
                />


                <Typography
                  variant="h5"
                  fontWeight={950}
                >
                  Personalized Improvement Plan
                </Typography>

              </Stack>


              <Typography
                sx={{
                  mt: 1,
                  color: "#667085",
                }}
              >
                Use these points as your preparation plan
                for the next interview.
              </Typography>


              <Stack
                spacing={1.5}
                sx={{
                  mt: 2.5,
                }}
              >

                {analysis.plan.map(
                  (
                    point,
                    index
                  ) => (

                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,

                        background:
                          "rgba(255,255,255,.8)",

                        border:
                          "1px solid #e8e2ff",
                      }}
                    >

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >

                        <Box
                          sx={{
                            minWidth: 30,
                            height: 30,
                            borderRadius: "50%",

                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",

                            background:
                              "#7c4dff",

                            color: "white",

                            fontWeight: 900,
                          }}
                        >
                          {index + 1}
                        </Box>


                        <Typography
                          sx={{
                            lineHeight: 1.7,
                          }}
                        >
                          {point}
                        </Typography>

                      </Stack>

                    </Paper>

                  )
                )}

              </Stack>

            </CardContent>

          </Card>


          {/* =================================================
              QUESTION-BY-QUESTION RESULTS
          ================================================= */}

          <Card
            sx={{
              mb: 3,
              borderRadius: 4,
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },
              }}
            >

              <Typography
                variant="h5"
                fontWeight={950}
              >
                Question-by-Question Results
              </Typography>


              <Typography
                sx={{
                  mt: 1,
                  color: "#667085",
                }}
              >
                Review every answer and the feedback received
                during this interview.
              </Typography>


              <Stack
                spacing={2}
                sx={{
                  mt: 3,
                }}
              >

                {results.map(
                  (
                    item,
                    index
                  ) => (

                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,

                        border:
                          "1px solid #e5e7eb",
                      }}
                    >

                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}

                        justifyContent="space-between"

                        alignItems={{
                          xs: "flex-start",
                          sm: "center",
                        }}

                        spacing={1.5}
                      >

                        <Typography
                          fontWeight={900}
                        >
                          Question {index + 1}
                        </Typography>


                        <Chip
                          label={`${Number(
                            item?.evaluation?.score ||
                            0
                          ).toFixed(0)}/100`}

                          color={
                            Number(
                              item?.evaluation?.score ||
                              0
                            ) >= 70
                              ? "success"
                              : "warning"
                          }

                          sx={{
                            fontWeight: 900,
                          }}
                        />

                      </Stack>


                      <Typography
                        sx={{
                          mt: 2,
                          fontWeight: 750,
                          lineHeight: 1.7,
                        }}
                      >
                        {typeof item.question ===
                        "string"
                          ? item.question
                          : item.question?.question ||
                            item.question?.text ||
                            ""}
                      </Typography>


                      <Divider
                        sx={{
                          my: 2,
                        }}
                      />


                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                        }}
                      >
                        <strong>Your answer:</strong>{" "}
                        {item.answer ||
                          "No answer recorded."}
                      </Typography>


                      {item.evaluation?.feedback && (

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 2,
                            lineHeight: 1.7,
                          }}
                        >
                          <strong>AI feedback:</strong>{" "}
                          {item.evaluation.feedback}
                        </Typography>

                      )}

                    </Paper>

                  )
                )}

              </Stack>

            </CardContent>

          </Card>


          {/* =================================================
              RESULT ACTIONS
          ================================================= */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}

            spacing={2}

            justifyContent="center"
          >

            <Button
              variant="contained"
              size="large"

              startIcon={
                <Refresh />
              }

              onClick={() =>
                startInterview(
                  interviewType
                )
              }

              disabled={
                loading ||
                savingInterview
              }

              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 900,
              }}
            >
              Practice Again
            </Button>


            <Button
              variant="outlined"
              size="large"

              startIcon={
                <ArrowBack />
              }

              onClick={
                resetInterview
              }

              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 900,
              }}
            >
              Back to Interview Center
            </Button>

          </Stack>


          {savingInterview && (

            <Typography
              align="center"
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
              }}
            >
              Saving your interview performance...
            </Typography>

          )}

        </Container>

      </Box>

    );

  }


  // =====================================================
  // ACTIVE INTERVIEW
  // =====================================================

  if (
    interviewStarted &&
    questions.length > 0
  ) {

    const currentQuestionData =
      questions[
        currentQuestion
      ];


    // ---------------------------------------------------
    // SUPPORT STRING OR OBJECT QUESTION
    // ---------------------------------------------------

    const questionText =
      typeof currentQuestionData ===
      "string"
        ? currentQuestionData
        : currentQuestionData?.question ||
          currentQuestionData?.text ||
          "";


    const progress =
      (
        (currentQuestion + 1) /
        questions.length
      ) *
      100;


    // ---------------------------------------------------
    // CAMERA STATUS
    // ---------------------------------------------------

    const currentStream =
      streamRef.current;


    const cameraConnected =
      !!currentStream &&
      currentStream
        .getVideoTracks()
        .some(
          (track) =>
            track.readyState ===
            "live"
        );


    const microphoneConnected =
      !!currentStream &&
      currentStream
        .getAudioTracks()
        .some(
          (track) =>
            track.readyState ===
            "live"
        );


    return (

      <Box
        sx={{
          minHeight: "100vh",
          py: 4,

          background:
            "linear-gradient(135deg,#eef2ff,#f7f8ff)",
        }}
      >

        <Container
          maxWidth="lg"
        >

          <Card
            sx={{
              borderRadius: 5,

              boxShadow:
                "0 25px 60px rgba(0,0,0,.12)",
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 2,
                  md: 4,
                },
              }}
            >

              {/* =================================================
                  INTERVIEW HEADER
              ================================================= */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}

                justifyContent="space-between"

                alignItems={{
                  xs: "stretch",
                  sm: "center",
                }}

                spacing={2}

                sx={{
                  mb: 2,
                }}
              >

                <Button
                  startIcon={
                    <ArrowBack />
                  }

                  onClick={
                    resetInterview
                  }
                >
                  Exit
                </Button>


                <Chip
                  icon={
                    <SmartToy />
                  }

                  label={
                    getInterviewTypeLabel(
                      interviewType
                    )
                  }

                  color="primary"
                />

              </Stack>


              {/* =================================================
                  DEVICE STATUS
              ================================================= */}

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  mb: 2,
                }}
              >

                <Chip
                  label={
                    cameraConnected
                      ? "Camera Connected"
                      : "Camera Disconnected"
                  }

                  color={
                    cameraConnected
                      ? "success"
                      : "error"
                  }

                  icon={
                    <CheckCircle />
                  }
                />


                <Chip
                  label={
                    microphoneConnected
                      ? "Microphone Connected"
                      : "Microphone Disconnected"
                  }

                  color={
                    microphoneConnected
                      ? "success"
                      : "error"
                  }

                  icon={
                    <RecordVoiceOver />
                  }
                />

              </Stack>


              <LinearProgress
                variant="determinate"

                value={
                  Math.max(
                    0,
                    Math.min(
                      100,
                      progress
                    )
                  )
                }

                sx={{
                  height: 8,
                  borderRadius: 10,
                  mb: 1,
                }}
              />


              <Typography
                align="center"
                color="text.secondary"
                mb={3}
              >
                Question{" "}
                {currentQuestion + 1}{" "}
                of{" "}
                {questions.length}
              </Typography>


              {/* =================================================
                  CAMERA + QUESTION
              ================================================= */}

              <Grid
                container
                spacing={3}
              >

                {/* =================================================
                    CAMERA
                ================================================= */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Card
                    sx={{
                      background:
                        "#101828",

                      borderRadius: 4,

                      overflow:
                        "hidden",
                    }}
                  >

                    {cameraActive ? (

                      <video
                        ref={
                          attachCamera
                        }

                        autoPlay
                        muted
                        playsInline

                        style={{
                          width: "100%",
                          height: "380px",

                          objectFit:
                            "cover",

                          transform:
                            "scaleX(-1)",
                        }}
                      />

                    ) : (

                      <Box
                        sx={{
                          height: 380,

                          display:
                            "flex",

                          flexDirection:
                            "column",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          color: "white",

                          px: 3,

                          textAlign:
                            "center",
                        }}
                      >

                        <Typography
                          variant="h6"
                          fontWeight={800}
                        >
                          Camera unavailable
                        </Typography>


                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,

                            color:
                              "rgba(255,255,255,.65)",
                          }}
                        >
                          Camera and microphone access
                          are required for the interview.
                        </Typography>

                      </Box>

                    )}

                  </Card>

                </Grid>


                {/* =================================================
                    QUESTION
                ================================================= */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      minHeight: 380,

                      p: 4,

                      borderRadius: 4,

                      background:
                        "linear-gradient(135deg,#eef4ff,#f3edff)",

                      display:
                        "flex",

                      flexDirection:
                        "column",

                      justifyContent:
                        "center",
                    }}
                  >

                    <Typography
                      color="primary"
                      fontWeight={900}
                    >
                      AI INTERVIEWER
                    </Typography>


                    <Typography
                      variant="h4"
                      fontWeight={900}

                      sx={{
                        mt: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      {questionText}
                    </Typography>


                    <Button
                      variant="outlined"

                      startIcon={
                        <RecordVoiceOver />
                      }

                      onClick={() =>
                        speakQuestion(
                          questionText
                        )
                      }

                      disabled={
                        !questionText.trim()
                      }

                      sx={{
                        mt: 3,
                      }}
                    >
                      Repeat Question
                    </Button>

                  </Paper>

                </Grid>

              </Grid>


              {/* =================================================
                  ANSWER
              ================================================= */}

              <Card
                variant="outlined"
                sx={{
                  mt: 3,
                  borderRadius: 4,
                }}
              >

                <CardContent>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Your Answer
                  </Typography>


                  <textarea
                    value={answer}

                    onChange={(event) =>
                      setAnswer(
                        event.target.value
                      )
                    }

                    placeholder="Speak or type your answer..."

                    style={{
                      width: "100%",
                      minHeight: 160,

                      marginTop: 16,

                      padding: 16,

                      borderRadius: 12,

                      border:
                        "1px solid #d0d5dd",

                      fontSize: 16,

                      fontFamily:
                        "inherit",

                      resize:
                        "vertical",

                      boxSizing:
                        "border-box",
                    }}
                  />


                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}

                    spacing={2}

                    sx={{
                      mt: 2,
                    }}
                  >

                    {/* =================================================
                        SPEAK ANSWER
                    ================================================= */}

                    <Button
                      fullWidth

                      variant={
                        listening
                          ? "contained"
                          : "outlined"
                      }

                      color={
                        listening
                          ? "error"
                          : "primary"
                      }

                      onClick={
                        listening
                          ? stopListening
                          : startListening
                      }

                      disabled={
                        !microphoneConnected
                      }
                    >

                      {listening
                        ? "Stop Speaking"
                        : "Start Speaking"}

                    </Button>


                    {/* =================================================
                        EVALUATE
                    ================================================= */}

                    <Button
                      fullWidth
                      variant="contained"

                      onClick={
                        submitAnswer
                      }

                      disabled={
                        evaluationLoading ||
                        !cameraConnected ||
                        !microphoneConnected
                      }
                    >

                      {evaluationLoading ? (

                        <CircularProgress
                          size={22}
                          color="inherit"
                        />

                      ) : (

                        "Evaluate Answer"

                      )}

                    </Button>

                  </Stack>

                </CardContent>

              </Card>


              {/* =================================================
                  FEEDBACK
              ================================================= */}

              {feedback && (

                <Card
                  sx={{
                    mt: 3,
                    borderRadius: 4,

                    background:
                      "#f8fff9",
                  }}
                >

                  <CardContent>

                    <Typography
                      variant="h5"
                      fontWeight={950}
                    >
                      🧠 AI Feedback
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: 32,
                        fontWeight: 950,

                        color:
                          "#1976d2",

                        mt: 2,
                      }}
                    >
                      {feedback.score}
                      /100
                    </Typography>


                    {feedback.feedback && (

                      <Typography
                        sx={{
                          mt: 2,
                          lineHeight: 1.7,
                        }}
                      >
                        {feedback.feedback}
                      </Typography>

                    )}


                    {/* =================================================
                        FEEDBACK CARDS
                    ================================================= */}

                    <Grid
                      container
                      spacing={2}
                      sx={{
                        mt: 1,
                      }}
                    >

                      {[
                        [
                          "Strengths",
                          feedback.strengths,
                          "#e8f5e9",
                        ],

                        [
                          "Weaknesses",
                          feedback.weaknesses,
                          "#fff3e0",
                        ],

                        [
                          "Improvements",
                          feedback.improvements,
                          "#eef4ff",
                        ],

                      ].map(
                        (item) => (

                          <Grid
                            item
                            xs={12}
                            md={4}
                            key={item[0]}
                          >

                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                height: "100%",
                                borderRadius: 3,

                                background:
                                  item[2],
                              }}
                            >

                              <Typography
                                fontWeight={900}
                              >
                                {item[0]}
                              </Typography>


                              {Array.isArray(
                                item[1]
                              ) ? (

                                item[1].map(
                                  (
                                    point,
                                    index
                                  ) => (

                                    <Typography
                                      key={index}
                                      variant="body2"

                                      sx={{
                                        mt: 1,
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      • {point}
                                    </Typography>

                                  )
                                )

                              ) : (

                                <Typography
                                  variant="body2"

                                  sx={{
                                    mt: 1,
                                  }}
                                >
                                  {item[1] ||
                                    "No specific points provided."}
                                </Typography>

                              )}

                            </Paper>

                          </Grid>

                        )
                      )}

                    </Grid>


                    {/* =================================================
                        BETTER ANSWER
                    ================================================= */}

                    {Array.isArray(
                      feedback.better_answer_guidance
                    ) &&
                      feedback
                        .better_answer_guidance
                        .length > 0 && (

                        <Paper
                          elevation={0}

                          sx={{
                            mt: 2,
                            p: 2.5,
                            borderRadius: 3,

                            background:
                              "#f3efff",
                          }}
                        >

                          <Typography
                            fontWeight={900}
                            color="#6a3fc7"
                          >
                            ✨ How to Give a Better Answer
                          </Typography>


                          {feedback
                            .better_answer_guidance
                            .map(
                              (
                                point,
                                index
                              ) => (

                                <Typography
                                  key={index}
                                  variant="body2"

                                  sx={{
                                    mt: 1,
                                    lineHeight: 1.7,
                                  }}
                                >
                                  {index + 1}.{" "}
                                  {point}
                                </Typography>

                              )
                            )}

                        </Paper>

                      )}


                    {/* =================================================
                        NEXT QUESTION / FINISH
                    ================================================= */}

                    <Button
                      fullWidth
                      variant="contained"

                      endIcon={
                        <ArrowForward />
                      }

                      onClick={
                        nextQuestion
                      }

                      disabled={
                        !cameraConnected ||
                        !microphoneConnected ||
                        savingInterview
                      }

                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 900,
                      }}
                    >

                      {currentQuestion <
                      questions.length - 1
                        ? "Next Question"
                        : "Finish Interview"}

                    </Button>

                  </CardContent>

                </Card>

              )}

            </CardContent>

          </Card>

        </Container>

      </Box>

    );

  }


  // =====================================================
  // FALLBACK
  // =====================================================

  return null;

}


// =====================================================
// EXPORT
// =====================================================

export default AIInterview;