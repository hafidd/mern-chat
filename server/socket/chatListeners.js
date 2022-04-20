const Chat = require("../models/Chat");

module.exports = chatListeners = function (io) {
  io.on("connection", async (socket) => {
    // on message
    socket.on("message", async ({ from, name, room, text }, fn) => {
      try {
        const chat = await Chat.findOne({ _id: room, members: from });
        // check if privatemsg & first message
        if (chat.type === "private" && chat.messages.length < 2) {
          const target =
            chat.members[0].toString() === socket.user._id
              ? chat.members[1]
              : chat.members[0];
          // emit room to target if online
          if (io.connectedUsers[target]) {
            io.connectedUsers[target].sockets.forEach((s) => {
              io.to(s.id).emit("added", chat);
              s.join(chat._id.toString());
            });
          }
        }
        // update chat
        chat.messages.push({ name, text, from });
        await chat.save();
        // await Chat.findOneAndUpdate(
        //   { _id: room, members: from },
        //   { $push: { messages: { name, text, from } } },
        //   { useFindAndModify: false }
        // );
        // console.log({ from, text, name, room, sid: socket.id })
        console.log(room);
        socket
          .to(room)
          .emit("message", { from, text, name, room, sid: socket.id });
      } catch (err) {
        console.log(err);
        return fn({
          err: true,
          message: {
            text: `${new Date().toLocaleString()}. pesan gagal dikirim`,
            name: "System",
            room,
          },
        });
      }
      return fn({ err: false, message: { from, text, name, room } });
    });
  });
};
