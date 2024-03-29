const path = require("path");
const sharp = require("sharp");
//const mmm = require("mmmagic");
//const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
const fs = require("fs");

const uploadProfile = ({ file, id }) =>
  new Promise((resolve, reject) => {
    console.log(file);
    if (!file || !id)
      return reject({ statusCode: 400, msg: "Please upload file!" });
    // //cek type
    // magic.detect(file.buffer, (err, mimeType) => {
    //   if (err) return reject(err);
    //   if (["image/jpeg", "image/png"].indexOf(mimeType) === -1)
    //     return reject({ statusCode: 400, msg: "Please upload jpg/png" });
    //   // resize, convert jpeg
    //   sharp(file.buffer)
    //     .resize(150)
    //     .toFormat("jpeg")
    //     .toFile(path.join(__basedir, `/files/images/profile/${userId}.jpg`))
    //     .then(file => {
    //       resolve("success", file);
    //     })
    //     .catch(err => reject(err));
    // });
    if (["image/jpeg", "image/png"].indexOf(file.mimetype) === -1)
      return reject({ statusCode: 400, msg: "Please upload jpg/png" });
    // resize, convert jpeg
    sharp(file.buffer)
      .resize(150)
      .toFormat("jpeg")
      .toFile(path.join(__basedir, `/files/images/profile/${id}.jpg`))
      .then((file) => {
        resolve("success", file);
      })
      .catch((err) => reject(err));
  });

const downloadProfile = ({ id }) =>
  new Promise((resolve, reject) => {
    const filePath = path.join(__basedir, `/files/images/profile/${id}.jpg`);
    if (!fs.existsSync(filePath))
      return reject({ statusCode: 404, msg: "File not found" });
    const fileStream = fs.createReadStream(filePath);
    resolve(fileStream);
  });

module.exports = {
  uploadProfile,
  downloadProfile,
};
