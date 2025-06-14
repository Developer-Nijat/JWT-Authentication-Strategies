// utils/authHelpers.js
const jwt = require("jsonwebtoken");

const ACCESS_SECRET = "d9T10tDvCiDKlVgx42q7mcqR5TXdvmyW";
const REFRESH_SECRET = "ZoD09WPHCEN1vfzkRtC31upDnwax4cim";
const ACCESS_EXPIRATION = "15m"; // 15 minutes
const REFRESH_EXPIRATION = "7d"; // 7 days

const refreshTokenDB = new Set();

function generateTokens(user) {
  const accessToken = jwt.sign(user, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRATION,
  });
  const refreshToken = jwt.sign(user, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRATION,
  });
  return { accessToken, refreshToken };
}

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token
  if (!token)
    return res.status(401).json({ message: "Access token not found" });

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid access token" });
    req.user = user;
    next();
  });
}

function verifyRefreshToken(token) {
  const user = jwt.verify(token, REFRESH_SECRET);
  const newAccessToken = jwt.sign({ username: user.username }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRATION,
  });
  return { accessToken: newAccessToken };
}

function clearTokens(refreshToken) {
  if (refreshToken) refreshTokenDB.delete(refreshToken);
}

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  clearTokens,
  refreshTokenDB,
};
