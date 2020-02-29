const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
// model
const User = require("../../models/User");

module.exports = () => {
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
      return res.json(newUser);
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
    if (!username.trim() || !password.trim())
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
            process.env.JWT_SECRET || "",
            { expiresIn: 7200 },
            (err, token) => {
              if (err) throw err;
              // response token
              return res.json({ token });
            }
          );
        } else
          return res.status(400).json({ msg: "Username / Password salah" });
      } else return res.status(400).json({ msg: "Username / Password salah" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Error" });
    }
  });

  return router;
};
