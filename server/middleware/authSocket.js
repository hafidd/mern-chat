const jwt = require("jsonwebtoken");

const auth = (socket, next) => {
  //console.log('authenticating socket connection...', socket.handshake.headers.origin);
  // get token
  const token = socket.handshake.query.token;
  // validate token
  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET || "");
    //console.log('ok..');
    next();
  } catch (err) {
    //console.log(err);
    //console.log('authentication failed...');
    return next(new Error("authentication error"));
  }
};

module.exports = auth;
