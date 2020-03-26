// mmmagic, sharp
const mmm = require("mmmagic");
const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
const sharp = require("sharp");
// gdrive api
const { google } = require("googleapis");
const credentials = require("../credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);
const drive = google.drive({ version: "v3", auth });

const upload = (folderId, file, fileName = null) =>
  new Promise((resolve, reject) => {
    if (!folderId || !file) reject("err");
    const stream = require("stream");
    const fileMetadata = {
      name: fileName || file.originalname,
      parents: [folderId]
    };
    let bufferStream = new stream.PassThrough();
    bufferStream.end(file);
    var media = {
      mimeType: file.mimetype,
      body: bufferStream
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id, thumbnailLink, webContentLink"
      },
      async (err, file) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        try {
          // await setPublic(file.data.id);
          resolve(file.data);
        } catch (err) {
          reject(err);
        }
      }
    );
  });

const list = (folderId, name, pageToken = null) =>
  new Promise((resolve, reject) => {
    let options = {
      fields: "files(id, name, webContentLink, thumbnailLink)",
      q: `"${folderId}" in parents`
    };
    if (name) options.q = options.q + ` and name="${name}"`;
    if (pageToken) options.pageToken = pageToken;
    drive.files.list(options, (err, res) => {
      if (err) return reject(err);
      resolve({
        files: res.data.files,
        nextPageToken: res.data.nextPageToken || null
      });
    });
  });

const uploadProfile = (req, res, next) => {
  try {
    const folderId =
      process.env.GDRIVE_PROFILE_DIR || "1Gvwja5WrMSrOw7jj272-jWcDWZUmzBti";
    magic.detect(req.file.buffer, (err, mimeType) => {
      if (err) next(err);
      if (["image/jpeg", "image/png"].indexOf(mimeType) === -1)
        return res.status(400).json({ msg: "Please upload jpg/png" });
      // resize
      sharp(req.file.buffer)
        .toBuffer()
        .then(data => {
          sharp(data)
            .resize(150)
            .toFormat("jpeg")
            .toBuffer()
            .then(async buffer => {
              console.log("resize success");
              // delete old file
              const files = await list(folderId, `${req.user._id}.jpeg`);
              if (files.files.length) {
                drive.files.delete(
                  { fileId: files.files[0].id },
                  async (err, response) => {
                    if (err) return next(err);
                    // upload
                    const profilePic = await upload(
                      folderId,
                      buffer,
                      `${req.user._id}.jpeg`
                    );
                    req.profilePic = profilePic;
                    return next();
                  }
                );
              }
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    });
  } catch (err) {
    next(err);
  }
};

const downloadProfile = async (req, res, next) => {
  const folderId =
    process.env.GDRIVE_PROFILE_DIR || "1Gvwja5WrMSrOw7jj272-jWcDWZUmzBti";
  try {
    console.log(`get file list`);
    const files = await list(folderId, `${req.params.id}.jpeg`);
    console.log(files);
    // console.log(files);
    if (!files.files.length)
      return res.status(404).json({ msg: "img not found" });
    const fileId = files.files[0].id;
    drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" },
      (err, response) => {
        if (err) next(err);
        response.data
          .on("end", () => {
            // console.log("Done");
          })
          .on("error", err => {
            console.log("Error", err);
            next(err);
          })
          .pipe(res);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};

module.exports = function(action = "uploadProfile") {
  return function(req, res, next) {
    if (action === "uploadProfile") uploadProfile(req, res, next);
    if (action === "downloadProfile") downloadProfile(req, res, next);
  };
};
