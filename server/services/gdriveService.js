// mmmagic, sharp
const mmm = require("mmmagic");
const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
const sharp = require("sharp");
// gdrive api
const { google } = require("googleapis");
// const credentials = require("../credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.JWT(
  process.env.GDRIVE_API_CLIENT_EMAIL,
  null,
  process.env.GDRIVE_API_PRIVATE_KEY,
  scopes
);
const drive = google.drive({ version: "v3", auth });

const upload = (folderId, file, fileName = null) =>
  new Promise((resolve, reject) => {
    if (!folderId || !file)
      return reject({ statusCode: 400, msg: "please upload file" });
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
      (err, file) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(file.data);
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

const uploadProfile = (file, userId) =>
  new Promise(async (resolve, reject) => {
    const folderId =
      process.env.GDRIVE_API_PROFILE_DIR;
    //cek type
    magic.detect(file.buffer, (err, mimeType) => {
      if (err) return reject(err);
      if (["image/jpeg", "image/png"].indexOf(mimeType) === -1)
        return reject({ statusCode: 400, msg: "Please upload jpg/png" });
      // resize, convert jpeg
      sharp(file.buffer)
        .toBuffer()
        .then(data => {
          sharp(data)
            .resize(150)
            .toFormat("jpeg")
            .toBuffer()
            .then(async buffer => {
              try {
                // delete old file
                const files = await list(folderId, `${userId}.jpeg`);
                if (files.files.length) {
                  drive.files.delete(
                    { fileId: files.files[0].id },
                    async (err, response) => {
                      // err delete
                      if (err) return reject(err);
                      try {
                        // upload
                        const profilePic = await upload(
                          folderId,
                          buffer,
                          `${userId}.jpeg`
                        );
                        return resolve(profilePic);
                      } catch (err) {
                        // upload err
                        return reject(err);
                      }
                    }
                  );
                } else {
                  try {
                    // upload
                    const profilePic = await upload(
                      folderId,
                      buffer,
                      `${userId}.jpeg`
                    );
                    return resolve(profilePic);
                  } catch (err) {
                    // upload err
                    return reject(err);
                  }
                }
              } catch (err) {
                // upload err
                return reject(err);
              }
            });
        });
    });
  });

const downloadProfile = userId =>
  new Promise(async (resolve, reject) => {
    const folderId =
      process.env.GDRIVE_API_PROFILE_DIR;
    try {
      const files = await list(folderId, `${userId}.jpeg`);
      // console.log(files);
      if (!files.files.length)
        return reject({ statusCode: 404, msg: "img not found" });
      const fileId = files.files[0].id;
      drive.files.get(
        { fileId: fileId, alt: "media" },
        { responseType: "stream" },
        (err, fileStream) => {
          if (err) return reject(err);
          resolve(fileStream.data);
        }
      );
    } catch (err) {
      reject(err);
    }
  });

module.exports = {
  uploadProfile,
  downloadProfile
};
