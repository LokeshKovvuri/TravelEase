import api from "./api";


// ============================================================
// LOGIN
// ============================================================

export const login = async (
  email,
  password
) => {

  const formData =
    new URLSearchParams();

  formData.append(
    "username",
    email
  );

  formData.append(
    "password",
    password
  );


  const response =
    await api.post(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );


  const data =
    response.data;


  const token =
    data?.access_token;


  if (!token) {

    throw new Error(
      "Authentication token was not returned by the server."
    );

  }


  localStorage.setItem(
    "access_token",
    token
  );


  const savedToken =
    localStorage.getItem(
      "access_token"
    );


  if (!savedToken) {

    throw new Error(
      "Authentication token could not be saved."
    );

  }


  console.log(
    "JWT saved successfully."
  );


  return data;
};


// ============================================================
// LOGOUT
// ============================================================

export const logout = () => {

  localStorage.removeItem(
    "access_token"
  );

};


// ============================================================
// GET TOKEN
// ============================================================

export const getToken = () => {

  return localStorage.getItem(
    "access_token"
  );

};


// ============================================================
// CHECK AUTHENTICATION
// ============================================================

export const isAuthenticated = () => {

  return Boolean(
    localStorage.getItem(
      "access_token"
    )
  );

};