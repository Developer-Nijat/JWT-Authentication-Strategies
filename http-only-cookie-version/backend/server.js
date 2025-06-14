// server.js
const express = require("express");
const cookieParser = require("cookie-parser");
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

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Login route
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Username is required");

  const { accessToken, refreshToken } = generateTokens({ username });
  refreshTokenDB.add(refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful" });
});

// Protected route
app.get("/profile", verifyAccessToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}` });
});

// Refresh token route
app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !refreshTokenDB.has(refreshToken)) {
    return res.status(403).send("Invalid or missing refresh token");
  }

  try {
    const { accessToken } = verifyRefreshToken(refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(403).send("Token verification failed");
  }
});

// Logout
app.post("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  clearTokens(refreshToken);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

app.listen(3001, () => console.log("Server running on port 3001"));
