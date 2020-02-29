const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

// init app
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`listening on port ${PORT}`));
// chat
const io = require("./socket").listen(server);

// test
app.get("/", (req, res) => {
  res.send(`
        <h1>Hello</h1>
    `);
});

// database
const db = process.env.MONGODB_URI || '';
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("mongodb connected..."))
  .catch(err => console.log("db error", err));

// routes
app.use("/api/users", require("./routes/api/users")());
app.use("/api/chat", require("./routes/api/chat")(io));
