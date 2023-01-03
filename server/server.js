const express = require("express");
const { createServer } = require("http");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const { createClient } = require("redis");

(async () => {
  console.log("starting server")
  // redis adapter
  const pubClient = await createClient({ url: "redis://localhost:6379" });
  const subClient = await pubClient.duplicate();
  await pubClient.connect()
  await subClient.connect()

  // init app
  const app = express();
  app.use(express.json());
  const httpServer = createServer(app);
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, console.log(`listening on port ${PORT}`));

  //const server = app.listen(PORT, console.log(`listening on port ${PORT}`));

  // socketio
  const io = require("./socket/socket")(httpServer, pubClient, subClient);
  require("./socket/chatHandler")(io);

  // database
  const db = process.env.MONGODB_URI || "mongodb://localhost/mern-chat";
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log("mongodb connected..."))
    .catch((err) => console.log("db error", err));

  // static
  app.use(express.static(path.join(__dirname, "./../build")));

  // routes
  global.__basedir = __dirname;
  app.use("/api/users", require("./api/users"));
  app.use("/api/chat", require("./api/chat")(io));
  app.use("/files", require("./api/files"));

  //test
  const getHello = (a) =>
    new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve({ id: a, text: "hello" });
      }, 2000);
    });
  const getWorld = (a) =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve({ id: a, text: "world" }), 5000);
    });

  const { performance } = require("perf_hooks");
  app.get("/syncronus", async (req, res) => {
    const start = performance.now();
    const hello = await getHello(new Date());
    const world = await getWorld(new Date());
    const finish = performance.now();
    const time = finish - start;
    res.send(
      `
    ${hello.id}<br/>
    ${world.id}<br/>
    ${hello.text} ${world.text}<br/>
    ${(time / 1000).toPrecision(2)} detik
    `
    );
  });

  app.get("/asyncronus", async (req, res) => {
    const start = performance.now();
    const hello = getHello(new Date());
    const world = getWorld(new Date());
    const data = await Promise.all([hello, world]);
    const finish = performance.now();
    const time = finish - start;
    res.send(
      `
    ${data[0].id}<br/>
    ${data[1].id}<br/>
    ${data[0].text} ${data[1].text}<br/>
    ${(time / 1000).toPrecision(2)} detik
    `
    );
  });

})();
