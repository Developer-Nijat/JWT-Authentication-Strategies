import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      config.headers["X-Refresh-Token"] = refreshToken;
    }
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Retry for refresh token
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      if (!refreshToken) {
        // If no refresh token, clear tokens and reject
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(error);
      }

      const response = await instance.post(
        "/refresh",
        {
          refreshToken,
        },
        {
          headers: {
            "X-Refresh-Token": refreshToken,
          },
        }
      );
      if (response.status === 200) {
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        originalReq.headers["Authorization"] = `Bearer ${accessToken}`;
        originalReq.headers["X-Refresh-Token"] = newRefreshToken;
      } else {
        // If refresh fails, clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      return instance(originalReq);
    }
    return Promise.reject(error);
  }
);

export default instance;
