const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// init app
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`listening on port ${PORT}`));
// socketio
const io = require("./socket/socket").listen(server);

// database
const db = process.env.MONGODB_URI || "mongodb://localhost/mern-chat";
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("mongodb connected..."))
  .catch(err => console.log("db error", err));

// routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/chat", require("./routes/api/chat")(io));

// socket listeners
require("./socket/chatListeners")(io);
