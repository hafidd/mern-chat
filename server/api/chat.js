const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// model
const Chat = require("../models/Chat");
const User = require("../models/User");

module.exports = io => {
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
            members: 1,
            messages: { $slice: ["$messages", -1] }
          }
        }
      ]).then(chat =>
        chat
          .filter(
            chat =>
              chat.type === "group" ||
              (chat.type === "private" && chat.messages[0].name !== "System")
          )
          .map(chat => {
            return {
              ...chat,
              uId:
                chat.type === "private"
                  ? chat.members[0].toString() === req.user._id
                    ? chat.members[1]
                    : chat.members[0]
                  : null,
              message: chat.messages ? chat.messages[0] : null
            };
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
    try {
      const _id = req.params.id;
      let chat = await Chat.findOne({ _id, members: req.user._id }).populate(
        "members",
        "username name"
      );
      if (!chat) throw { code: 404, msg: "Group tidak ditemukan" };
      const data = {
        ...chat.toObject(),
        members: chat.toObject().members.map(member => ({
          ...member,
          online: io.connectedUsers[member._id] !== undefined
        })),
        uId:
          chat.type === "private"
            ? chat.members[0]._id.toString() === req.user._id
              ? chat.members[1]._id
              : chat.members[0]._id
            : null
      };
      return res.json(data);
    } catch (err) {
      if (err.code) return res.status(err.code).json({ msg: err.msg });
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
        // join group
        io.connectedUsers[req.user._id].sockets.forEach(socket =>
          socket.join(newGroup._id)
        );
        // return group data
        return res.json({
          ...newGroup.toObject(),
          members: [{ ...req.user, online: true }]
        });
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
          $or: [
            { members: [userTarget._id, req.user._id] },
            { members: [req.user._id, userTarget._id] }
          ]
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
              text: `Percakapan : ${req.user.name}, ${userTarget.name}`
            }
          ]
        });
        await newGroup.save();
        // join group
        io.connectedUsers[req.user._id].sockets.forEach(socket =>
          socket.join(newGroup._id)
        );
        return res.json({
          chat: { ...newGroup.toObject(), uId: userTarget._id },
          new: true
        });
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

  // DELETE /api/chat
  // delete group
  router.delete("/:id", auth, async (req, res) => {
    try {
      const _id = req.params.id;
      await Chat.findOneAndDelete({ _id, owner: req.user._id });
      // emit
      io.to(_id).emit("group_deleted", _id);
      return res.status(204).send({});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: "Error" });
    }
  });

  // POST /api/chat/leave
  // leave group
  router.post("/leave", auth, async (req, res) => {
    try {
      const { _id } = req.body;
      let group = await Chat.findOne({ _id, members: req.user._id }).select(
        "-messages"
      );
      if (!group) throw { code: 404, msg: "Group tidak ditemukan" };
      // update members
      console.log(group.members);
      group.members = group.members.filter(
        member => member.toString() !== req.user._id
      );
      group.save();
      // emit to group
      io.to(group._id).emit("member_left", req.user);
      return res.json(group._id);
    } catch (err) {
      if (err.code) return res.status(err.code).json({ msg: err.msg });
      console.log(err);
      return res.status(500).json({ msg: "Error" });
    }
  });

  // POST /api/chat/remove
  // remove member
  router.post("/remove", auth, async (req, res) => {
    try {
      const { gId, uId } = req.body;
      if (uId === req.user._id) throw { code: 400, msg: "Gagal" };
      // group
      let group = await Chat.findOne({ _id: gId, owner: req.user._id }).select(
        "-messages"
      );
      if (!group) throw { code: 404, msg: "Group tidak ditemukan" };
      // member
      const removedMember = await User.findById(uId).select("name username");
      // update members
      group.members = group.members.filter(member => member.toString() !== uId);
      group.save();
      // emit to group
      io.to(group._id).emit("member_removed", { member: removedMember, gId });
      return res.json(group._id);
    } catch (err) {
      console.log(err);
      if (err.code) return res.status(err.code).json({ msg: err.msg });
      return res.status(500).json({ msg: "Error" });
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
