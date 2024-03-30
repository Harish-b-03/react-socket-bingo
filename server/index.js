const express = require("express");
const app = express();
const PORT = 4000;

const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

let shuffledData = null;

const getShuffledData = () => {
  const array = [...Array(26).keys()].slice(1);

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return [
        array.slice(0, 5),
        array.slice(5, 10),
        array.slice(10, 15),
        array.slice(15, 20),
        array.slice(20, 25),
    ];
};

const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
    },
});

socketIO.on("connection", (socket) => {
    // console.log(`⚡: ${socket.id} user just connected!`);

    socket.join("room1");
    if(shuffledData == null){
      shuffledData = getShuffledData();
    }
    socket.emit("shuffleData", shuffledData);
    socket.broadcast.to("room1").emit("message", `${socket.id} joined`);

    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
