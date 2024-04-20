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
    playerReadyToStart,
    getRoomIdBySocketId,
    startGame,
    getUserBySocketId,
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

    socket.on("playerReadyToStart", () => {
        let res = playerReadyToStart(socket.id);
        if (res.success) {
            socket.emit("readyConfirmed", res);
            let resRoomId = getRoomIdBySocketId(socket.id);
            socket.broadcast
                .to(resRoomId.data.roomId)
                .emit("message", `${res.data.user.userName} is ready`);
        } else {
            socket.emit("readyConfirmed", res);
        }
    });

    socket.on("startGame", () => {
        let res = startGame(socket.id);
        if (res.success) {
            let resRoomId = getRoomIdBySocketId(socket.id);
            socket.nsp.to(resRoomId.data.roomId).emit("gameStarted", {
                success: res.success,
                startedBy: res.data.user.userId,
                notify: `${res.data.user.userName} started the game`,
            });
        } else {
            socket.emit("gameStarted", res);
        }
    });

    socket.on("iWonMessage", () => {
        let resRoomId = getRoomIdBySocketId(socket.id);
        if (!resRoomId.success) {
            socket.emit("message", "Some error occured");
        }
        socket.emit("message", "You Win");
        socket.broadcast
            .to(resRoomId.data.roomId)
            .emit("message", `${socket.id} won`);
    });

    socket.on("mark", (markedNumber) => {
        let resRoomId = getRoomIdBySocketId(socket.id);
        if (!resRoomId.success) {
            socket.emit("message", "Some error occured");
        }
        socket.emit("message", `marked ${markedNumber}`);
        let resUser = getUserBySocketId(socket.id);
        if (resUser.success) {
            socket.broadcast.to(resRoomId.data.roomId).emit("reflectMark", {
                markedNumber: markedNumber,
                userName: resUser.data.user.userName,
            });
        }
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
