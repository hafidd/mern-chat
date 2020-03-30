const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// multer
const multer = require("multer");
const upload = multer();
// service
const { uploadProfile, downloadProfile } =
  process.env.USE_GDRIVE == 1
    ? require("../services/gdriveService")
    : require("../services/localFileService");

// upload photo
router.post("/profile", [auth, upload.single("photo")], async (req, res) => {
  try {
    await uploadProfile({ file: req.file, id: req.user._id });
    res.send({ msg: "upload success" });
  } catch (err) {
    if (err.statusCode)
      return res.status(err.statusCode).json({ msg: err.msg || "" });
    console.log(err);
    res.status(500).send({ msg: "upload error" });
  }
});

// get photo
router.get("/profile/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await downloadProfile({ id });
    response.pipe(res);
  } catch (err) {
    if (err.statusCode)
      return res.status(err.statusCode).json({ msg: err.msg || "" });
    console.log(err);
    res.status(500).json("Error");
  }
});

// upload group photo
router.post("/group/:id", [auth, upload.single("photo")], async (req, res) => {
  try {
    await uploadProfile({ file: req.file, id: req.params.id, group: true });
    res.send({ msg: "upload success" });
  } catch (err) {
    if (err.statusCode)
      return res.status(err.statusCode).json({ msg: err.msg || "" });
    console.log(err);
    res.status(500).send({ msg: "upload error" });
  }
});

// get group photo
router.get("/group/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await downloadProfile({ id, group: true });
    response.pipe(res);
  } catch (err) {
    if (err.statusCode)
      return res.status(err.statusCode).json({ msg: err.msg || "" });
    console.log(err);
    res.status(500).json("Error");
  }
});

module.exports = router;
