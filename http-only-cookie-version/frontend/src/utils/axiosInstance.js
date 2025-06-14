import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
  withCredentials: true, // Enable sending cookies with requests
});

// Retry for refresh token
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;
    if (
      (error.response?.status === 401) &&
      !originalReq._retry
    ) {
      originalReq._retry = true;
      await instance.post("/refresh");
      return instance(originalReq);
    }
    return Promise.reject(error);
  }
);

export default instance;
