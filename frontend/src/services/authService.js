import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const loginUser = async (username, password) => {
  if (!username || !username.trim()) {
    throw new Error("Username is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  const formData = new URLSearchParams();

  formData.append("username", username.trim());
  formData.append("password", password);

  try {
    const response = await axios.post(
      `${API_URL}/users/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, token_type } = response.data;

    if (!access_token) {
      throw new Error(
        "Login succeeded but no access token was returned."
      );
    }

    localStorage.setItem(
      "sentinelx_access_token",
      access_token
    );

    localStorage.setItem(
      "sentinelx_token_type",
      token_type || "bearer"
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX Login Error:",
      error
    );

    const detail =
      error?.response?.data?.detail;

    throw new Error(
      detail ||
        error?.message ||
        "Login failed. Please check your credentials."
    );
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(
    "sentinelx_access_token"
  );
};

export const getCurrentUser = async () => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(
      `${API_URL}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX Current User Error:",
      error
    );

    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      logoutUser();
    }

    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(
    "sentinelx_access_token"
  );

  localStorage.removeItem(
    "sentinelx_token_type"
  );
};

export const isAuthenticated = () => {
  return Boolean(getAccessToken());
};