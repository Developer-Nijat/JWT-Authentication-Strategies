import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import axiosInstance from "./utils/axiosInstance";

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { username }
      );
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      setMessage("Login success!");
    } catch (error) {
      console.error(error);
      setMessage("Login failed");
    }
  };

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get("/profile");
      setMessage(res.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Invalid or expired token");
    }
  };

  const logout = async () => {
    await axiosInstance.post("/logout");
    setMessage("Logged out successfully");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <hr />
        <br />
        <button onClick={login}>Login</button>
        <button onClick={getProfile}>Get Profile Info</button>
        <button onClick={logout}>Logout</button>
        <p>{message}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
