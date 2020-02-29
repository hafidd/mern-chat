const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username harus diisi"],
    trim: true,
    lowercase: true,
    validate: {
      validator: async v => !(await User.findOne({ username: v })),
      message: props => `Username: ${props.value} sudah terdaftar!`
    }
  },
  name: {
    type: String,
    minlength: [3, "Username minimal 3 karakter"],
    trim: true,
    required: [true, "Nama harus diisi"]
    
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email harus diisi"],
    trim: true,
    validate: [
      {
        validator: v => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
        message: () => `Email tidak valid`
      },
      {
        validator: async v => !(await User.findOne({ email: v })),
        message: props => `Email: ${props.value} sudah terdaftar!`
      }
    ]
  },
  password: {
    type: String,
    trim: true,
    minlength: [8, "Password minimal 6 karakter"],
    required: [true, "Password harus diisi"]
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: this.Schema
    }
  ]
});

module.exports = User = mongoose.model("user", UserSchema);
