const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// model
const Chat = require("../../models/Chat");
const User = require("../../models/User");

module.exports = io => {
  // GET /api/chat/test
  // test
  router.get("/test", (req, res) => {
    res.send(io.connectedUsers);
  });

  // GET /api/chat
  // user chats
  router.get("/", auth, async (req, res) => {
    try {
      const chats = await Chat.aggregate([
        { $match: { members: ObjectId(req.user._id) } },
        { $sort: { "messages.date": -1 } },
        {
          $project: {
            name: 1,
            type: 1,
            messages: { $slice: ["$messages", -1] }
          }
        }
      ]).then(chat =>
        chat.map(chat => {
          return { ...chat, message: chat.messages ? chat.messages[0] : null };
        })
      );
      return res.json(chats);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Error" });
    }
  });

  // GET /api/chat/id
  // detail chat
  router.get("/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
      const chat = await Chat.findOne({ _id, members: req.user._id }).populate(
        "members",
        "username name"
      );
      return res.json(chat);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Error" });
    }
  });

  // POST /api/chat
  // new group/private chat
  router.post("/", auth, async (req, res) => {
    const { name, type, userId } = req.body;
    // save group/private
    if (type === "group") {
      try {
        const newGroup = new Chat({
          name,
          type,
          owner: req.user._id,
          members: [req.user._id],
          messages: [{ name: "System", text: `Group "${name}" telah dibuat` }]
        });
        // save
        await newGroup.save();
        return res.json(newGroup);
      } catch (err) {
        return handleError(err, res);
      }
    } else {
      try {
        // cek
        if (userId === req.user._id)
          return res.status(400).json({ msg: "Error" });
        // get user
        const userTarget = await User.findById(userId);
        if (!userTarget) return res.status(400).json({ msg: "Error" });
        // return room if exist
        const chat = await Chat.findOne({
          type: "private",
          members: [req.user._id, userTarget._id]
        });
        if (chat) return res.json({ chat, new: false });
        // create new room
        const newGroup = new Chat({
          name: `${req.user.name}__${userTarget.name}`,
          type: "private",
          members: [req.user._id, userTarget._id],
          messages: [
            {
              name: "System",
              text: `Percakapan pribadi: ${req.user.name}, ${userTarget.name}`
            }
          ]
        });
        await newGroup.save();
        return res.json({ chat: newGroup, new: true });
      } catch (err) {
        return handleError(err, res);
      }
    }
  });

  // POST /api/chat/invite
  // invite user
  router.post("/invite", auth, async (req, res) => {
    const { groupId, username } = req.body;
    try {
      // get user
      const user = await User.findOne({ username }).select("name username");
      if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
      // get group
      let group = await Chat.findOne({
        _id: groupId,
        owner: req.user._id,
        members: { $ne: user._id }
      });
      if (!group)
        return res
          .status(400)
          .json({ msg: "Group tidak ditemukan / user sudah bergabung" });
      // add member
      group.members.push(user._id);
      await group.save();
      // emit to invited user if online
      if (io.connectedUsers[user._id]) {
        io.connectedUsers[user._id].sockets.forEach(socket => {
          io.to(socket.id).emit("added", group);
          socket.join(group._id);
        });
      }
      // to group
      io.to(group._id).emit("new_member", user);
      // return success
      // return res.json({
      //   msg: `"${user.name}" ditambahkan ke group "${group.name}"`
      // });
      return res.json(user);
    } catch (err) {
      handleError(err, res);
    }
  });

  const handleError = (err, res) => {
    // validation err
    if (err.name && err.name === "ValidationError") {
      let errors = [];
      for (const p in err.errors) {
        errors.push(err.errors[p]["message"]);
      }
      return res.status(400).json({ msg: "Validation Error", errors });
    }
    console.log(err);
    return res.status(500).json({ msg: "Error" });
  };

  return router;
};
