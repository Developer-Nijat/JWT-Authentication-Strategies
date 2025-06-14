import { useState } from "react";
import axios from "axios";
import axiosInstance from "./utils/axiosInstance";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { username },
        { withCredentials: true }
      );
      setMsg(res.data.message);
    } catch (err) {
      console.error(err);
      setMsg("Login failed");
    }
  };

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get("/profile");
      setMsg(res.data.message);
    } catch (err) {
      console.error(err);
      setMsg("Error: " + err.response?.status);
    }
  };

  const logout = async () => {
    await axiosInstance.post("/logout");
    setMsg("Logged out successfully");
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
      <h2>JWT + httpOnly cookie + Refresh Token Demo</h2>
      <div className="card">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
        <hr />
        <br />
        <button onClick={login}>Login</button>
        <button onClick={getProfile}>Profile</button>
        <button onClick={logout}>Logout</button>
      </div>
      <p className="read-the-docs">{msg}</p>
    </>
  );
}

export default App;
