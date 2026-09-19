import axios from "axios";


const api = axios.create({

  baseURL: (
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api/v1"
  ).replace(/\/$/, ""),

  headers: {
    "Content-Type":
      "application/json",
  },

});


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );


    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    console.log(
      "API REQUEST:",
      {
        method:
          config.method?.toUpperCase(),

        url:
          config.url,

        hasToken:
          Boolean(token),
      }
    );


    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    const status =
      error.response?.status;


    if (status === 401) {

      console.error(
        "401 Unauthorized:",
        error.response?.data
      );


      // ------------------------------------------------------
      // Remove invalid token
      // ------------------------------------------------------

      localStorage.removeItem(
        "access_token"
      );


      // ------------------------------------------------------
      // Redirect to login
      // ------------------------------------------------------

      if (
        window.location.pathname !== "/"
      ) {

        window.location.href = "/";

      }

    }


    return Promise.reject(error);

  }

);


export default api;
