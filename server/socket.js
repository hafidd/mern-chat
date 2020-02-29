const socketio = require("socket.io");
const auth = require("./middleware/authSocket");

module.exports.listen = server => {
  io = socketio.listen(server);
  // users
  io.connectedUsers = [];
  // auth
  io.use(auth);
  // user connected
  io.on("connection", socket => {
    // add new user
    const newUser = {
      id: socket.id,
      userId: socket.user._id,
      username: socket.user.name,
      email: socket.user.email
    };
    io.connectedUsers.push(newUser);
    //console.log(io.connectedUsers, io.connectedUsers.length);
    // disconnect
    socket.on("disconnect", () => {
      // remove user
      io.connectedUsers = io.connectedUsers.filter(cu => cu.id !== socket.id);
      //console.log(io.connectedUsers, io.connectedUsers.length);
    });
  });

  return io;
};
