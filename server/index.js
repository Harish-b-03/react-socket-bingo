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
    getNextTurn,
    resetGame,
    deleteUser,
} = require("./util");

app.use(cors());

const socketIO = require("socket.io")(http, {
    cors: {
        origin: "https://react-socket-bingo.vercel.app/",
        methods: ["GET", "POST"],
        allowedHeaders: ["cors-custom-header"],
        credentials: true
    },
});

socketIO.on("connection", (socket) => {
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
            let {userId, userName} = res.data.user;
            let resRoomId = getRoomIdBySocketId(socket.id);
            let roomId = resRoomId.data.roomId;

            socket.nsp.to(roomId).emit("gameStarted", {
                success: res.success,
                startedBy: userId,
                notify: `${userName} started the game`,
            });
            const resNextTurn = getNextTurn(roomId);
            if (resNextTurn.success) {
                socket.nsp.to(roomId).emit("updateTurn", {
                    success: true,
                    ...resNextTurn.data,
                });
            } else {
                socket.nsp
                    .to(roomId)
                    .emit("message", resNextTurn);
            }
        } else {
            socket.emit("gameStarted", res);
        }
    });

    socket.on("iWonMessage", () => {
        let resRoomId = getRoomIdBySocketId(socket.id);
        let resUser = getUserBySocketId(socket.id);
        if (!resRoomId.success || !resUser.success) {
            socket.emit("message", "Some error occured");
            return;
        }
        let roomId = resRoomId.data.roomId;
        socket.emit("win", "You Win");
        socket.broadcast
            .to(roomId)
            .emit("win", `${resUser.data.user.userName} won`);
        const response = resetGame(roomId)
        console.log("response", response)
        if(response.success){
            socket.emit("resetGame");
            socket.to(roomId).emit("resetGame");
        }
    });

    socket.on("mark", (markedNumber) => {
        let resRoomId = getRoomIdBySocketId(socket.id);
        if (!resRoomId.success) {
            socket.emit("message", "Some error occured");
            return;
        }
        // socket.emit("message", `marked ${markedNumber}`);
        let resUser = getUserBySocketId(socket.id);
        if (resUser.success) {
            let roomId = resRoomId.data.roomId;
            socket.broadcast.to(roomId).emit("reflectMark", {
                markedNumber: markedNumber,
                userName: resUser.data.user.userName,
            });
            // check if win then go to next turn
            const resNextTurn = getNextTurn(roomId);
            if (resNextTurn.success) {
                socket.nsp.to(roomId).emit("updateTurn", {
                    success: true,
                    ...resNextTurn.data,
                });
            } else {
                socket.nsp
                    .to(roomId)
                    .emit("message", resNextTurn);
                return;
            }
        }
    });

    socket.on("disconnect", () => {
        // remove user from the room
        // delete user
        deleteUser(socket.id);
        console.log("🔥: A user disconnected");
        displayRooms();
        displayUsers();
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
