const socketio = require("socket.io");
const auth = require("./middleware/authSocket");
const Chat = require("./models/Chat");

module.exports.listen = server => {
  io = socketio.listen(server);
  // users
  io.connectedUsers = [];
  // auth
  io.use(auth);
  // user connected
  io.on("connection", async socket => {
    // add new user
    const newUser = {
      id: socket.id,
      userId: socket.user._id,
      username: socket.user.name,
      email: socket.user.email
    };
    io.connectedUsers.push(newUser);
    console.log(io.connectedUsers, io.connectedUsers.length);
    // join groups
    const groups = await Chat.find({ members: socket.user._id }).select("_id");
    groups.forEach(({ _id }) => socket.join(_id));

    // message
    socket.on("message", async ({ from, name, room, text }, fn) => {
      try {
        await Chat.findOneAndUpdate(
          { _id: room, members: from },
          { $push: { messages: { name, text, from } } },
          { useFindAndModify: false }
        );
        io.to(room).emit("message", { from, text, name, room });
      } catch (err) {
        console.log(err);
        return fn({ err: true });
      }
      return fn({ err: false });
    });

    // disconnect
    socket.on("disconnect", () => {
      // remove user
      io.connectedUsers = io.connectedUsers.filter(cu => cu.id !== socket.id);
      //console.log(io.connectedUsers, io.connectedUsers.length);
    });
  });

  return io;
};
