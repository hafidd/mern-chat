const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // get token
  const authHeader = req.headers.authorization || "";
  if (!authHeader) return res.status(401).json({ msg: "No token" });
  const token = authHeader.split(" ")[1];
  // validate token
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || '');
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid Token" });
  }
};

module.exports = auth;
