const jwt = require("jsonwebtoken");

const auth = (socket, next) => {
  // get token
  const token = socket.handshake.query.token;
  if (!token) return next(new Error("Auth Error"));
  // validate token
  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET || "");
    next();
  } catch (err) {
    //console.log(err);
    next(new Error("Auth Error"));
  }
};

module.exports = auth;
