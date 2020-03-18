const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
// middleware auth, upload
const auth = require("../../middleware/auth");
const uploadProfile = require("../../middleware/uploadProfile");

// get profile pic
router.get("/profile/:id", auth, (req, res) => {
  try {
    const filePath = path.join(
      __basedir,
      `/files/images/profile/${req.params.id}.jpeg`
    );
    if (!fs.existsSync(filePath)) throw { code: 404, msg: "File not found" };
    res.contentType("image/jpg");
    res.sendFile(filePath);
  } catch (err) {
    if (err.code) return res.status(404).json({ msg: err.msg });
    console.log(err);
    res.status(404).json({ msg: err });
  }
});

// upload profile pic
router.post("/profile", [auth, uploadProfile], (req, res) =>
  res.send({ msg: "upload success" })
);

// // test form
// router.get("/tesform", (req, res) => {
//   res.send(`
//         <form method="post" action="/files/testupload" enctype="multipart/form-data">
//             <input type="file" name="photo" />
//             <button>upload</button>
//         </form>
//     `);
// });

// router.post(
//   "/testupload",
//   [uploadProfile],
//   (req, res) => {
//     res.send(req.file);
//   }
// );

// upload profile pic

module.exports = router;
