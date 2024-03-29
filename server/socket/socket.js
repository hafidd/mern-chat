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
    groups.forEach(({ _id }) => {
      socket.join(_id);
      // emit online to group
      io.to(_id).emit("member_online", socket.user._id);
    });

    // disconnect
    socket.on("disconnect", () => {
      // delete
      io.connectedUsers[socket.user._id].sockets = io.connectedUsers[
        socket.user._id
      ]["sockets"].filter(({ id }) => id !== socket.id);
      if (io.connectedUsers[socket.user._id].sockets.length === 0) {
        delete io.connectedUsers[socket.user._id];
        // emit offline to groups
        groups.forEach(({ _id }) =>
          io.to(_id).emit("member_offline", socket.user._id)
        );
      }

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
    //console.log(io.connectedUsers);
    let cu = [];
    for (let key in io.connectedUsers)
      cu.push(
        `${io.connectedUsers[key]["username"]} (${io.connectedUsers[key]["sockets"].length})`
      );
    console.log(cu);
    console.log(`${Object.keys(io.connectedUsers).length} users connected`);
    console.log(new Date().toLocaleString());
    console.log(
      "------------------------------------------------------------------------"
    );
  }

  return io;
};
