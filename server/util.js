const rooms = [
    {
        // room object template
        roomId: "dummyRoom",
        players: [
            // user objects
        ],
        gameStarted: false,
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
    },
];

const getRoomIndex = (roomId = null) => {
    if (roomId === null) return;

    return rooms.findIndex((room) => room.roomId === roomId);
};

const getUserIndex = (userId = null) => {
    if (userId === null) return;

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
            errorCode: "userNotFound",
            errorMessage: "No user found.",
        };

    const roomIndex = getRoomIndex(roomId);
    if (roomIndex === -1) {
        // creating a room
        console.log("creating a room");

        rooms.push({
            roomId: roomId,
            players: [users[userIndex]],
            gameStarted: false,
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

const getRoomIdBySocketId = ({ socketId = null }) => {
    if (socketId === null) return;

    const index = users.findIndex((user) => user.socketId === socketId);

    if (index === -1) {
        return {
            status: 404,
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
};
