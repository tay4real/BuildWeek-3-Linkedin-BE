const express = require("express");
const cors = require("cors");
const endpoints = require("express-list-endpoints");
const port = process.env.PORT || 3001;
const server = express();
const services = require("./services");
const mongoose = require("mongoose");

server.use(express.json());
server.use(cors());
server.use("/api", services);

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("✅  Server is running on port " + port);
    })
  )
  .catch((err) => console.log("❌ Error : " + err));
