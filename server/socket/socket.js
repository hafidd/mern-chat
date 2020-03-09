const socketio = require("socket.io");
const auth = require("../middleware/authSocket");

module.exports.listen = server => {
  io = socketio.listen(server);
  // users
  io.connectedUsers = {};
  // auth
  io.use(auth);
  // user connected
  io.on("connection", async socket => {
    // users
    if (io.connectedUsers[socket.user._id]) {
      io.connectedUsers[socket.user._id].sockets.push(socket);
    } else {
      // new user
      const newUser = {
        username: socket.user.username,
        name: socket.user.name,
        sockets: [socket]
      };
      io.connectedUsers[socket.user._id] = newUser;
    }
    //_cl(socket);

    // join groups
    const groups = await Chat.find({ members: socket.user._id }).select("_id");
    groups.forEach(({ _id }) => socket.join(_id));

    // disconnect
    socket.on("disconnect", () => {
      // delete
      io.connectedUsers[socket.user._id].sockets = io.connectedUsers[
        socket.user._id
      ]["sockets"].filter(({ id }) => id !== socket.id);
      if (io.connectedUsers[socket.user._id].sockets.length === 0)
        delete io.connectedUsers[socket.user._id];
      //_cl(socket, true);
    });
  });

  function _cl(socket, dc = false) {
    console.log(
      "-----------------------------------------------------------------------"
    );
    console.log(
      `${socket.user.username} (${socket.id}) ${
        dc ? "dis" : ""
      }conected!\nconnected users:`
    );
    console.log(io.connectedUsers);
    console.log(`${Object.keys(io.connectedUsers).length} user(s) connected`);
    console.log(new Date().toLocaleString());
    console.log(
      "------------------------------------------------------------------------"
    );
  }

  return io;
};
