// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  clearTokens,
  refreshTokenDB,
} = require("./utils/authHelpers");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

// Login route
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Username is required");

  const { accessToken, refreshToken } = generateTokens({ username });
  refreshTokenDB.add(refreshToken);
  res.json({ accessToken, refreshToken });
});

// Protected route
app.get("/profile", verifyAccessToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}` });
});

// Refresh token route
app.post("/refresh", (req, res) => {
  const refreshToken =
    req.body?.refreshToken || req.headers?.["x-refresh-token"];
  if (!refreshToken || !refreshTokenDB.has(refreshToken)) {
    return res.status(403).send("Invalid or missing refresh token");
  }

  try {
    const { accessToken } = verifyRefreshToken(refreshToken);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(403).send("Token verification failed");
  }
});

// Logout
app.post("/logout", (req, res) => {
  const refreshToken =
    req.body?.refreshToken || req.headers?.["x-refresh-token"];
  clearTokens(refreshToken);
  res.json({ message: "Logged out" });
});

app.listen(3001, () => console.log("Server running on port 3001"));
