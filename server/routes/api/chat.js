const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
// model
const Chat = require("../../models/Chat");
const User = require("../../models/User");

module.exports = io => {
  // GET /api/chat/test
  // test
  router.get("/test", (req, res) => {
    res.send(io.connectedUsers);
  });

  // POST /api/chat
  // new room/private chat
  router.post("/", auth, async (req, res) => {
    const { name, type, userId } = req.body;
    // save group/private
    if (type === "group") {
      try {
        const newGroup = new Chat({
          name,
          type,
          owner: req.user._id,
          members: [req.user._id]
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
        if (chat) return res.json(chat);
        // create new room
        const newGroup = new Chat({
          name: `${req.user.name}__${userTarget.name}`,
          type: "private",
          members: [req.user._id, userTarget._id]
        });
        await newGroup.save();
        return res.json(newGroup);
      } catch (err) {
        return handleError(err, res);
      }
    }
  });

  // POST /api/chat/invite
  // invite user
  router.post("/invite", auth, async (req, res) => {
    const { groupId, userId } = req.body;
    try {
      // get group, user
      const group = await Chat.findOne({
        _id: groupId,
        owner: req.user._id,
        members: { $ne: userId }
      });
      if (!group)
        return res
          .status(400)
          .json({ msg: "Group tidak ditemukan / user sudah bergabung" });
      const user = await User.findById(userId).select("-contacts");
      if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
      // add member
      group.members.push(user._id);
      group.save();
      // emit added if user online
      const userOnline = io.connectedUsers.filter(cu =>
        user._id.equals(cu.userId)
      )[0];
      if (userOnline) io.to(userOnline.id).emit("added", { group });
      return res.json({
        msg: `"${user.name}" berhasil ditambahkan ke group "${group.name}"`
      });
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
