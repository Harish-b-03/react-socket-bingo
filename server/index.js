const express = require("express");
const app = express();
const PORT = 4000;

const http = require("http").Server(app);
const cors = require("cors");
const {
    addUser,
    addUserToRoom,
    displayRooms,
    displayUsers,
} = require("./util");

app.use(cors());

const socketIO = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
    },
});

socketIO.on("connection", (socket) => {
    // console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("joinRoom", (userName, roomId) => {
        const user = addUser({
            socketId: socket.id,
            userName: userName,
            roomId: roomId,
            bingoBoard: [],
        });
        socket.join(roomId);
        const res = addUserToRoom({ userId: user.userId, roomId: user.roomId });
        if (!res.success) {
            socket.emit(
                "message",
                "Error while joining the room. Please try again"
            );
            return;
        }
        socket.emit("joinedRoom", user);
        socket.broadcast.to(roomId).emit("message", `${user.userName} joined`);
    });

    socket.on("iWonMessage", () => {
        socket.emit("message", "You Win");
        socket.broadcast.to("room1").emit("message", `${socket.id} won`);
    });

    socket.on("mark", (markedNumber) => {
        socket.emit("message", `marked ${markedNumber}`);
        socket.broadcast.to("room1").emit("reflectMark", {
            markedNumber: markedNumber,
            userName: socket.id,
        });
    });

    socket.on("disconnect", () => {
        // remove user from the room
        // delete user
        console.log("🔥: A user disconnected");
    });
});

app.get("/api", (req, res) => {
    res.json({
        message: "Hello! Server is working",
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
