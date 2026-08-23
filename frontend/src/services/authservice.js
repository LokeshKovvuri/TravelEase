import api from "./api";

// ============================================================
// LOGIN
// ============================================================

export const login = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  const data = response.data;

  console.log("LOGIN RESPONSE:", data);

  // ----------------------------------------------------------
  // FastAPI OAuth2 normally returns:
  //
  // {
  //   access_token: "...",
  //   token_type: "bearer"
  // }
  // ----------------------------------------------------------

  const token = data.access_token;

  if (!token) {
    console.error(
      "Login succeeded but no access_token was returned.",
      data
    );

    throw new Error(
      "Authentication token was not returned by the server."
    );
  }

  // ----------------------------------------------------------
  // SAVE JWT
  // ----------------------------------------------------------

  localStorage.setItem(
    "access_token",
    token
  );

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
  return !!localStorage.getItem(
    "access_token"
  );
};