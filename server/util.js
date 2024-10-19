const rooms = new Map();
const users = new Map();

/*
Room Map:
{
    roomId: {
        players: [
            // user objects
        ],
        gameStarted: false,
        currentTurn: -1,
    }
}

User Map:
{
    userId: {
        socketId: "bot",
        userId: "-1",
        userName: "bot",
        roomId: "",
        bingoBoard: [],
        readyToStart: false,
    }
}
*/

const maxCapacityOfRoom = 4;

const addUser = ({ socketId = null, userName = "user", roomId = null, bingoBoard = [] }) => {
	if (socketId === null) return;

	let userId = Date.now().toString(36) + Math.random().toString(36).substring(2);

	const newUser = {
		socketId,
		userId,
		userName,
		roomId,
		bingoBoard,
		readyToStart: false,
	};

	users.set(userId, newUser);

	return {
		...newUser,
	}; // sending the user object as response, so that client can save this info for further communication
};

// TODO: Feature to update/edit the username

const addUserToRoom = ({ userId = null, roomId = null }) => {
	if (userId === null || roomId === null) return;

	if (!users.has(userId)) {
		return {
			status: 404,
			success: false,
			errorCode: "userNotFound",
			errorMessage: "No user found.",
		};
	}

	if (!rooms.has(roomId)) {
		// creating a room
		console.log("creating a room");

		rooms.set(roomId, {
			players: [userId],
			gameStarted: false,
			currentTurn: -1,
		});
		// displayUsers();
		// displayRooms();
		users.set(userId, { ...users.get(userId), roomId: roomId });

		const userDetailWithRoomMates = getUserDetailsWithRoomMates(userId);

		return {
			status: 200,
			success: true,
			data: {
				message: `Created room (#${roomId})`,
				user: userDetailWithRoomMates,
			},
		};
	}

	let roomDetails = rooms.get(roomId);

	if (roomDetails.players.length >= maxCapacityOfRoom) {
		return {
			status: 403, // Forbidden status
			success: false,
			errorCode: "roomFull",
			errorMessage: `#${roomId} is full (A room can host upto ${maxCapacityOfRoom} users).`,
		};
	}

	if (roomDetails.gameStarted) {
		return {
			status: 403, // Forbidden status
			success: false,
			errorCode: "gameRunning",
			errorMessage: `Game has already started. Could not join #${roomId}. Please wait till the game ends.`,
		};
	}

	users.set(userId, { ...users.get(userId), roomId: roomId });

	rooms.set(roomId, {
		...roomDetails,
		players: [...roomDetails.players, userId],
	});

	const userDetailWithRoomMates = getUserDetailsWithRoomMates(userId);

	return {
		status: 200,
		success: true,
		data: {
			message: `Joined room (#${roomId})`,
			user: userDetailWithRoomMates,
		},
	};
};

const updateGameStatus = ({ roomId = null, gameStarted = true }) => {
	if (roomId === null) return;

	if (!rooms.has(roomId)) {
		return {
			status: 404,
			success: false,
			errorCode: "roomNotFound",
			errorMessage: "No room found.",
		};
	}

	rooms.set(roomId, { ...rooms.get(roomId), gameStarted: gameStarted });

	return {
		status: 200,
		success: true,
		data: {
			message: `${gameStarted ? "Game Started." : "Game not yet started."}`,
			room: rooms.get(roomId),
		},
	};
};

const updateBoardUser = ({ userId = null, boardData = [] }) => {
	if (!users.has(userId))
		return {
			status: 404,
			success: false,
			errorCode: "userNotFound",
			errorMessage: "No user found.",
		};

	users.set(userId, { ...users.get(userId), bingoBoard: boardData });

	return {
		status: 200,
		success: true,
	};
};

const getUserIdBySocketId = (socketId = null) => {
	if (!socketId) return;

	for (let [key, value] of users) {
		if (value.socketId === socketId) {
			return key;
		}
	}

	return 0;
};

const getRoomIdBySocketId = (socketId = null) => {
	if (!socketId) return;

	let userId = getUserIdBySocketId(socketId);

	if (userId) {
		return {
			status: 200,
			success: true,
			data: {
				roomId: users.get(userId).roomId,
			},
		};
	}

	return {
		status: 404,
		success: false,
		errorCode: "noSocketFound",
		errorMessage: "No such socket found.",
	};
};

const playerReadyToStart = (socketId = null) => {
	if (socketId === null) return;

	const userId = getUserIdBySocketId(socketId);

	if (userId) {
		users.set(userId, { ...users.get(userId), readyToStart: true });

		const userDetailWithRoomMates = getUserDetailsWithRoomMates(userId);

		return {
			status: 200,
			success: true,
			data: {
				user: userDetailWithRoomMates,
			},
		};
	}

	return {
		status: 404,
		success: false,
		errorCode: "userNotFound",
		errorMessage: "No user found.",
	};
};

const startGame = (socketId = null) => {
	let res = getRoomIdBySocketId(socketId);

	if (!res.success) {
		return res;
	}

	let roomId = res.data.roomId;

	if (rooms.has(roomId)) {
		let roomDetails = rooms.get(roomId);
		if (roomDetails.players.length < 2) {
			return {
				status: 404,
				success: false,
				errorCode: "playerCountIs1",
				errorMessage: "Number of players should be >= 2",
			};
		}

		roomDetails.players.forEach((player) => {
			let userId = player;

			if (!users.get(userId).readyToStart) {
				return {
					status: 404,
					success: false,
					errorCode: "AllPlayersNotReady",
					errorMessage: "All players are not ready",
				};
			}
		});

		rooms.set(roomId, { ...roomDetails, gameStarted: true });

		let userId = getUserIdBySocketId(socketId);
		const userDetailWithRoomMates = getUserDetailsWithRoomMates(userId);

		if (userId) {
			return {
				status: 200,
				success: true,
				data: {
					user: userDetailWithRoomMates,
				},
			};
		}
		return {
			status: 404,
			success: false,
			errorCode: "userNotFound",
			errorMessage: "No user found.",
		};
	}
};

const getUserBySocketId = (socketId = null) => {
	if (socketId === null) return;

	const userId = getUserIdBySocketId(socketId);
	const userDetailWithRoomMates = getUserDetailsWithRoomMates(userId);

	if (userId) {
		return {
			status: 200,
			success: true,
			data: {
				user: userDetailWithRoomMates,
			},
		};
	}
	return {
		status: 404,
		success: false,
		errorCode: "userNotFound",
		errorMessage: "No user found.",
	};
};

const getNextTurn = (roomId = null) => {
	if (roomId === null) return;

	if (!rooms.has(roomId)) {
		return {
			status: 404,
			success: false,
			errorCode: "roomNotFound",
			errorMessage: "No room found.",
		};
	}

	let roomDetails = rooms.get(roomId);
	let currentTurn = (roomDetails.currentTurn + 1) % roomDetails.players.length;

	rooms.set(roomId, { ...roomDetails, currentTurn: currentTurn });

	roomDetails = rooms.get(roomId);
	let userIdTurn = roomDetails.players[roomDetails.currentTurn];

	if (!users.has(userIdTurn))
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
			userName: users.get(userIdTurn).userName,
		},
	};
};

const resetGame = (roomId = null) => {
	if (roomId === null) return;

	if (!rooms.has(roomId)) {
		return {
			status: 404,
			success: false,
			errorCode: "roomNotFound",
			errorMessage: "No room found.",
		};
	}

	let roomDetails = rooms.get(roomId);
	let players = [];

	roomDetails.players.forEach((player) => {
		let user = users.get(player);
		if (user) {
			users.set(user.userId, {
				...user,
				bingoBoard: [],
				readyToStart: false,
			});
			players.push(user.userId);
		}
	});

	rooms.set(roomId, {
		players: players,
		gameStarted: false,
		currentTurn: -1,
	});

	return {
		status: 200,
		success: true,
	};
};

const deleteUser = (socketId = null) => {
	if (socketId === null) return;

	const resUser = getUserBySocketId(socketId);

	if (!resUser.success) return { success: false, status: 404, data: { errorMessage: "User not found" } };

	let user = resUser.data.user;

	if (user) {
		let roomId = user.roomId;
		users.delete(user.userId);
		removeUserFromRoom(user.userId, user.roomId);
		const playerNames = getPlayersByRoomId(roomId);
		return {
			status: 200,
			success: true,
			data: {
				message: `${user.userName} left the room`,
				playerNames: playerNames,
			},
		};
	}

	return {
		status: 404,
		success: false,
		errorCode: "userNotFound",
		errorMessage: "No user found.",
	};
};

const removeUserFromRoom = (userId, roomId) => {
	if (!roomId) return;

	const roomDetails = rooms.get(roomId);

	if (!roomDetails) return;

	let newPlayerList = [];
	if (roomDetails.players.includes(userId)) {
		newPlayerList = roomDetails.players.filter((i) => i !== userId);

		if (newPlayerList.length > 0) {
			rooms.set(roomId, {
				...roomDetails,
				players: newPlayerList,
			});
		} else {
			rooms.delete(roomId);
		}
	}
};

const getPlayersByRoomId = (roomId) => {
	if (!roomId) return [];

	const roomDetails = rooms.get(roomId);

	if (!roomDetails) return [];

	const playerNames = [];

	roomDetails.players.forEach((playerId) => {
		let playerDetails = users.get(playerId);

		if (playerDetails) playerNames.push(playerDetails.userName);
	});

	return playerNames;
};

const getUserDetailsWithRoomMates = (userId) => {
	if (!userId) return;

	let userDetails = users.get(userId);

	if (!userDetails)
		return {
			status: 404,
			success: false,
			errorCode: "userNotFound",
			errorMessage: "No user found.",
		};

	const playerNames = getPlayersByRoomId(userDetails.roomId);

	return { ...userDetails, roomMates: playerNames };
};

const displayRooms = () => {
	console.log("Rooms: ", rooms);
};

const displayUsers = () => {
	console.log("Users: ", users);
};

module.exports = {
	addUser,
	addUserToRoom,
	getRoomIdBySocketId,
	updateBoardUser,
	updateGameStatus,
	displayRooms,
	displayUsers,
	playerReadyToStart,
	startGame,
	getUserIdBySocketId,
	getUserBySocketId,
	getNextTurn,
	resetGame,
	deleteUser,
};
