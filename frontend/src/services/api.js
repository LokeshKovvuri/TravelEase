import axios from "axios";


const api = axios.create({
  baseURL:
    "http://127.0.0.1:8000/api/v1",

  headers: {
    "Content-Type":
      "application/json",
  },
});


// ============================================================
// REQUEST INTERCEPTOR
// Automatically attach JWT
// ============================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }


    console.log(
      "API REQUEST:",
      {
        url: config.url,

        method: config.method,

        hasToken: !!token,
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

    if (
      error.response?.status === 401
    ) {

      console.error(
        "Authentication failed. JWT token may be missing or expired."
      );
    }


    return Promise.reject(error);
  }
);


export default api;