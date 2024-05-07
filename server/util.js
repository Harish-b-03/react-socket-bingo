const rooms = [
    {
        // room object template
        roomId: "dummyRoom",
        players: [
            // user objects
        ],
        gameStarted: false,
        currentTurn: -1,
    },
];

const users = [
    {
        // user object template
        socketId: "bot",
        userId: "-1",
        userName: "bot",
        roomId: "",
        bingoBoard: [],
        readyToStart: false,
    },
];

const getRoomIndex = (roomId = null) => {
    if (roomId === null) return -1;

    return rooms.findIndex((room) => room.roomId === roomId);
};

const getUserIndex = (userId = null) => {
    if (userId === null) return -1;

    return users.findIndex((user) => user.userId === userId);
};

const addUser = ({
    socketId = null,
    userName = "user",
    roomId = null,
    bingoBoard = [],
}) => {
    if (socketId === null) return;

    const newUser = {
        userId:
            Date.now().toString(36) + Math.random().toString(36).substring(2),
        socketId,
        userName,
        roomId,
        bingoBoard,
        readyToStart: false,
    };

    users.push(newUser);

    return newUser;
};

const updateUserName = ({ userId = null, newName = "" }) => {
    if (userId === null || newName === "") return;

    const index = getUserIndex(userId);

    if (index === -1)
        return {
            status: 404,
            success: false,
            errorCode: "userNotFound",
            errorMessage: "No user found.",
        };

    users[index].userName = newName;

    return { status: 200, success: true, data: users[index] };
};

const addUserToRoom = ({ userId = null, roomId = null }) => {
    if (userId === null || roomId === null) return;

    const userIndex = getUserIndex(userId);

    if (userIndex === -1)
        return {
            status: 404,
            success: false,
            errorCode: "userNotFound",
            errorMessage: "No user found.",
        };

    const roomIndex = getRoomIndex(roomId);
    if (roomIndex === -1) {
        // creating a room
        console.log("creating a room");

        rooms.push({
            roomId: roomId,
            players: [],
            gameStarted: false,
            currentTurn: -1
        });
        users[userIndex].roomId = roomId;
        rooms[rooms.length - 1].players.push(userId);

        return {
            status: 200,
            success: true,
            data: {
                message: `Created room (#${roomId})`,
                room: rooms[roomIndex],
                user: users[userIndex],
            },
        };
    }

    users[userIndex].roomId = roomId;
    rooms[roomIndex].players.push(userId);

    return {
        status: 200,
        success: true,
        data: {
            message: `Joined room (#${roomId})`,
            room: rooms[roomIndex],
            user: users[userIndex],
        },
    };
};

const updateGameStatus = ({ roomId = null, gameStarted = true }) => {
    if (roomId === null) return;

    const roomIndex = getRoomIndex(roomId);

    if (roomIndex === -1) {
        return {
            status: 404,
            success: false,
            errorCode: "roomNotFound",
            errorMessage: "No room found.",
        };
    }

    rooms[roomIndex].gameStarted = gameStarted;

    return {
        status: 200,
        success: true,
        data: {
            message: `${
                gameStarted ? "Game Started." : "Game not yet started."
            }`,
            room: rooms[roomIndex],
        },
    };
};

const updateBoardUser = ({ userId = null, boardData = [] }) => {
    const userIndex = getUserIndex(userId);

    if (userIndex === -1)
        return {
            status: 404,
            success: false,
            errorCode: "userNotFound",
            errorMessage: "No user found.",
        };

    users[userIndex].bingoBoard = boardData;

    return {
        status: 200,
        success: true,
        data: {
            message: "Board data updated",
        },
    };
};

const getRoomIdBySocketId = (socketId = null) => {
    if (socketId === null) return;

    const index = users.findIndex((user) => user.socketId === socketId);

    if (index === -1) {
        return {
            status: 404,
            success: false,
            errorCode: "userNotFound",
            errorMessage: "No user found.",
        };
    }

    return {
        status: 200,
        success: true,
        data: {
            roomId: users[index].roomId,
        },
    };
};

const playerReadyToStart = (socketId = null) => {
    if (socketId === null) return;

    const userIndex = users.findIndex((user) => user.socketId === socketId);

    if (userIndex === -1)
        return {
            status: 404,
            success: false,
            errorCode: "userNotFound",
            errorMessage: "No user found.",
        };

    users[userIndex].readyToStart = true;

    return {
        status: 200,
        success: true,
        data: {
            user: users[userIndex],
        },
    };
};

const startGame = (socketId = null) => {
    let res = getRoomIdBySocketId(socketId);
    
    if(!res.success){
        return res;
    }

    let currentRoomIndex = getRoomIndex(res.data.roomId);

    if (currentRoomIndex !== -1) {
        if (rooms[currentRoomIndex].players.length < 2) {
            return {
                status: 404,
                success: false,
                errorCode: "playerCountIs1",
                errorMessage: "Number of players should be >= 2",
            };
        }

        for(let i=0; i<rooms[currentRoomIndex].players.length; i++){
            let userIndex = getUserIndex(rooms[currentRoomIndex].players[i]);
            if (!users[userIndex].readyToStart) {
                return {
                    status: 404,
                    success: false,
                    errorCode: "AllPlayersNotReady",
                    errorMessage: "All players are not ready",
                };
            }
        }
        
        rooms[currentRoomIndex].gameStarted = true;
        return {
            status: 200,
            success: true,
            data: {
                user: users.filter((user)=>user.socketId === socketId)[0]
            }
        };
    }
};

const getUserBySocketId = (socketId = null) => {
    if(socketId === null) return;

    const userIndex = users.findIndex((user) => user.socketId === socketId);

    if (userIndex === -1)
        return {
            status: 404,
            success: false,
            errorCode: "userNotFound",
            errorMessage: "No user found.",
        };

    return {
        status: 200,
        success: true,
        data: {
            user: users[userIndex],
        },
    };


}

const getNextTurn = (roomId = null) => {
    if (roomId === null) return;

    const roomIndex = getRoomIndex(roomId);

    if (roomIndex === -1) {
        return {
            status: 404,
            success: false,
            errorCode: "roomNotFound",
            errorMessage: "No room found.",
        };
    }

    rooms[roomIndex].currentTurn = (rooms[roomIndex].currentTurn + 1) % (rooms[roomIndex].players.length - 1);
    let userIdTurn = rooms[roomIndex].players[rooms[roomIndex].currentTurn];
    let userIndexTurn = getUserIndex(userIdTurn);

    if(userIndexTurn === -1)
            return {
                status: 404,
                success: false,
                errorCode: "userNotFound",
                errorMessage: "No user found.",
            };

    return {
        status: 200,
        success: true,
        data: {
            turn: userIdTurn,
            userName: users[userIndexTurn].userName
        },
    }

}

const displayRooms = () => {
    console.log(rooms);
};

const displayUsers = () => {
    console.log(users);
};

module.exports = {
    addUser,
    addUserToRoom,
    getRoomIdBySocketId,
    updateBoardUser,
    updateGameStatus,
    updateUserName,
    displayRooms,
    displayUsers,
    playerReadyToStart,
    startGame,
    getUserBySocketId,
    getNextTurn
};
