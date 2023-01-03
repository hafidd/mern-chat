//const socketio = require("socket.io");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const auth = require("../middleware/authSocket");

module.exports = (server, pubClient, subClient) => {
  //io = socketio.listen(server); < - socketio v2
  const io = new Server(server, { allowEIO3: true, transports: ["websocket"] });
  // users
  io.connectedUsers = {};
  // adapter
  io.adapter(createAdapter(pubClient, subClient));
  // auth
  io.use(auth);
  // user connected
  io.on("connection", async (socket) => {
    // users
    if (io.connectedUsers[socket.user._id]) {
      io.connectedUsers[socket.user._id].sockets.push(socket);
    } else {
      // new user
      const newUser = {
        username: socket.user.username,
        name: socket.user.name,
        sockets: [socket],
      };
      io.connectedUsers[socket.user._id] = newUser;
    }
    //_cl(socket);

    // join groups
    const groups = await Chat.find({ members: socket.user._id }).select("_id");
    groups.forEach(({ _id }) => {
      const roomId = _id.toString();
      socket.join(roomId);
      // emit online to group
      io.to(roomId).emit("member_online", socket.user._id);
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
          io.to(_id.toString()).emit("member_offline", socket.user._id)
        );
      }

      //_cl(socket, true);
    });
  });

  // io.of("/").adapter.on("create-room", (room) => {
  //   console.log(`room ${room} was created`);
  // });
  // io.of("/").adapter.on("join-room", (room, id) => {
  //   console.log(`socket ${id} has joined room ${room}`);
  // });

  function _cl(socket, dc = false) {
    console.log(
      "-----------------------------------------------------------------------"
    );
    console.log(
      `${socket.user.username} (${socket.id}) ${dc ? "dis" : ""
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
