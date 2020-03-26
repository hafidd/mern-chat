const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
// middleware auth, upload
const auth = require("../../middleware/auth");
const uploadProfile = require("../../middleware/uploadProfile");
const gdrive = require("../../middleware/gdrive");
// multer
const multer = require("multer");
const upload = multer();

// get profile pic
// router.get("/profile/:id", auth, (req, res) => {
//   try {
//     const filePath = path.join(
//       __basedir,
//       `/files/images/profile/${req.params.id}.jpeg`
//     );
//     if (!fs.existsSync(filePath)) throw { code: 404, msg: "File not found" };
//     res.contentType("image/jpg");
//     res.sendFile(filePath);
//   } catch (err) {
//     if (err.code) return res.status(404).json({ msg: err.msg });
//     console.log(err);
//     res.status(404).json({ msg: err });
//   }
// });

// upload profile pic
router.post(
  "/profile",
  [auth, upload.single("photo"), gdrive("uploadProfile")],
  (req, res) => {
    try {
      console.log(req.profilePic);
      res.send({ msg: "upload success" });
    } catch (err) {
      console.log("error log: ", err);
      if (err.code) return res.status(err.code).json({ msg: err.msg });
      res.status(500).send({ err, msg: "upload error" });
    }
  }
);

router.get("/profile/:id", [auth, gdrive("downloadProfile")], () => {});

router.get("/tee", (req, res) => {
  res.send(`<img src="http://localhost:5001/files/teees" />`);
});

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
