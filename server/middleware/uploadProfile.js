const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, path.join(__basedir, "/files/images/profile"));
  },
  filename: function(req, file, callback) {
    callback(null, req.user._id + ".jpeg");
  }
});
const upload = multer({
  storage: storage
}).single("photo");

const uploadProfile = (req, res, next) => {
  //console.log(req.files);
  if (!req.user) return res.status(401).end();
  upload(req, res, err => {
    if (err) {
      console.log(err);
      return res.status(400).end();
    }
    //console.log(req.file);
    if (!req.file) return res.status(400).end();
    sharp(req.file.path)
      .toBuffer()
      .then(data => {
        sharp(data)
          .resize(150)
          .toFile(req.file.path)
          .then(() => next())
          .catch(err => next(new Error()));
      });
  });
};

module.exports = uploadProfile;
