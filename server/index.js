const express = require("express");
const app = express();
const PORT = 4000;

const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const socketIO = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
    },
});

socketIO.on("connection", (socket) => {
    // console.log(`⚡: ${socket.id} user just connected!`);

    socket.join("room1");
    socket.broadcast.to("room1").emit("message", `${socket.id} joined`);

    socket.on("iWonMessage", () => {
      socket.emit("message", "You Win");
      socket.broadcast.to("room1").emit("message", `${socket.id} won`);
    });

    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
