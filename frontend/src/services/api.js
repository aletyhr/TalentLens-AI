import axios from "axios";


const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});


// =====================================================
// GET CURRENT USER EMAIL FROM JWT
// =====================================================

const getCurrentUserEmail = () => {

  try {

    const token =
      localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const parts =
      token.split(".");

    if (parts.length !== 3) {
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

    if (
      typeof payload.sub !==
      "string"
    ) {
      return null;
    }

    return payload.sub.toLowerCase();

  } catch (error) {

    console.error(
      "Unable to identify current user:",
      error
    );

    return null;
  }

};


// =====================================================
// GET ACCOUNT-SPECIFIC STORAGE KEY
// =====================================================

const getAccountStorageKey = (
  baseKey,
  email
) => {

  if (!email) {
    return baseKey;
  }

  return (
    `${baseKey}_${encodeURIComponent(
      email.toLowerCase()
    )}`
  );

};


// =====================================================
// CLEAR SESSION DATA
// =====================================================

export const clearSessionData = () => {

  const email =
    getCurrentUserEmail();


  // ===================================================
  // ACCOUNT-SPECIFIC DATA
  // ===================================================

  const accountSpecificKeys = [

    "talentlens_resume_analysis",

    "talentlens_interview_data",

    "talentlens_target_job",

    "talentlens_job_description",

    "talentlens_job_match_result",

  ];


  accountSpecificKeys.forEach(
    (baseKey) => {

      if (email) {

        localStorage.removeItem(
          getAccountStorageKey(
            baseKey,
            email
          )
        );

      }

      // Remove old global key too.
      // This cleans data created by
      // older versions of the application.

      localStorage.removeItem(
        baseKey
      );

    }
  );


  // ===================================================
  // AUTHENTICATION
  // ===================================================

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "name"
  );

};


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) =>
    Promise.reject(error)

);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

API.interceptors.response.use(

  (response) =>
    response,

  (error) => {

    const status =
      error.response?.status;

    const requestUrl =
      error.config?.url || "";


    // =================================================
    // TOKEN EXPIRED / UNAUTHORIZED
    // =================================================

    if (
      status === 401 &&
      !requestUrl.includes(
        "/login"
      ) &&
      !requestUrl.includes(
        "/register"
      )
    ) {

      clearSessionData();


      if (
        window.location.pathname !==
        "/login"
      ) {

        window.location.href =
          "/login";

      }

    }

    return Promise.reject(
      error
    );

  }

);


export default API;