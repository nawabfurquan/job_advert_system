import axios from "axios";

const API_URL = "http://localhost:5000";
let refreshAttemptCount = 0;

// Create new instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attaching authorization token header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (error.response.status === 401 && !request._retry) {
      request._retry = true;

      // Maximum attempts reached
      if (refreshAttemptCount >= 3) {
        console.error("Maximum refresh attempts reached");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      refreshAttemptCount += 1;

      // Refresh the tokens and update it in localStorage
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axiosInstance.post(
          "/auth/refresh-token",
          {
            token: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.authToken}`;
        return axiosInstance(request);
      } catch (err) {
        // Error Handling
        console.error("Refresh token expired or invalid", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
