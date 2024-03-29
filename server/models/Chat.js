const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./User");

// message (sub)
const MessageSchema = new Schema({
  name: { type: String, required: true },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: function() {
      return this.name !== "System";
    }
  },
  text: String,
  date: { type: Date, default: Date.now }
});

// name(string), type(string[group/private]), owner(userid), members(arr), messages(arr)
const ChatSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["group", "private"] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: User },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User
    }
  ],
  messages: [MessageSchema]
});

module.exports = Chat = mongoose.model("chat", ChatSchema);
