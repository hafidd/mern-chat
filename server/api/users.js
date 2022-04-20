const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// model
const User = require("../models/User");

const auth = require("../middleware/auth");

// POST api/users
// register user
router.post("/", async (req, res) => {
  const { username, email, name, password } = req.body;
  try {
    // new user, validate
    const newUser = new User({ username, email, name, password });
    await newUser.validate();
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;
    await newUser.save();
    // response token
    jwt.sign(
      {
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: 7200 },
      (err, token) => {
        if (err) throw err;
        // response token
        return res.json({ token });
      }
    );
  } catch (err) {
    // validation err
    if (err.name && err.name === "ValidationError") {
      let errors = [];
      for (const p in err.errors) {
        errors.push(err.errors[p]["message"]);
      }
      return res.status(400).json({ msg: "Validation Error", errors });
    }
    // err
    console.log(err);
    return res.status(500).json({ msg: "Error", errors: [] });
  }
});

// POST /api/users/auth
// Login user
router.post("/auth", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ msg: "Masukkan username dan password", errors: [] });
  try {
    const user = await User.findOne({ username });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const { _id, username, name, email } = user;
        // jwt
        jwt.sign(
          { _id, username, name, email },
          process.env.JWT_SECRET || "secret",
          { expiresIn: 7200 },
          (err, token) => {
            if (err) throw err;
            // response token
            return res.json({ token });
          }
        );
      } else return res.status(400).json({ msg: "Username / Password salah" });
    } else return res.status(400).json({ msg: "Username / Password salah" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error" });
  }
});

// get /api/users/contacts
// get contacts
router.get("/contacts", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("contacts")
      .populate("contacts", "name username email");
    return res.json(user.contacts);
  } catch (err) {
    return res.status(500).json({ msg: "Error" });
  }
});

// POST /api/users/contact
// new contact
router.post("/contact", auth, async (req, res) => {
  try {
    const { username } = req.body;
    // cek
    if (username === req.user.username)
      throw { code: 400, msg: "Tidak dapat menambahkan ke kontak" };
    // get user
    const user = await User.findOne({ username }).select("username name email");
    if (!user) throw { code: 404, msg: "User tidak ditemukan" };
    // cek exist
    if (await User.findOne({ _id: req.user._id, contacts: user._id }))
      throw { code: 400, msg: "Kontak sudah ada" };
    // update contacts
    await User.findByIdAndUpdate(req.user._id, {
      $push: { contacts: user._id }
    });
    return res.json(user);
  } catch (err) {
    if (err.code) return res.status(err.code).json({ msg: err.msg });
    console.log(err);
    return res.status(500).json({ msg: "Error" });
  }
});

module.exports = router;

(async () => {
  // User.find().then(data => console.log(data));
  // User.find((err, data) => {
  //   console.log(data);
  // });
  // console.log(await User.find());
})();
