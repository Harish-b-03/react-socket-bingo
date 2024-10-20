import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../../contexts/game-context";
import { UserType, useUserContext } from "../../contexts/user-context";
import { toast } from "react-toastify";
import { socket } from "../../socket";

export function useBoardLogic() {
	const { user, updateUser } = useUserContext();
	const {
		gameStarted,
		lastChecked,
		myTurn,
		resetGame,
		shuffledData,
		updateGameOver,
		updateGameStarted,
		updateLastChecked,
		updateMyTurn,
		updateStatusMessage,
	} = useGameContext();

	const [matrixDim] = useState<number>(5);
	const [marked, setMarked] = useState<number[]>(Array(25).fill(0));
	const gameResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>();
	const shuffledDataRef = useRef<number[][]>(shuffledData);
	const gameStartedRef = useRef(gameStarted);
	const userRef = useRef(user);

	useEffect(() => {
		// Track state changes and update the refs, since refs persist while state variables do not update inside useEffect
		gameStartedRef.current = gameStarted;
		userRef.current = user;
		shuffledDataRef.current = shuffledData;
	}, [gameStarted, user, shuffledData]);

	const resetUserReadyState = (status = false) => {
		if (!userRef.current) return;

		const newUserDetails: UserType = { ...userRef.current, readyToStart: status };
		updateUser(newUserDetails);
		toast("Reseting game");
	};

	const sendWonMessage = () => {
		if (!socket.connected) return;

		socket.emit("iWonMessage", marked); // check the correctness in backend and get the won board to show in the win message
	};

	const checkIfWon = (index: number) => {
		let sum;
		let rowNo = Math.floor(index / matrixDim);
		let colNo = index % matrixDim;

		// col sum
		sum = 0;
		for (let i = 0; i < matrixDim; i++) {
			sum += marked.at(i * matrixDim + colNo) ?? 0;
		}
		if (sum === matrixDim) {
			sendWonMessage();
			return true;
		}

		// row sum
		sum = 0;
		for (let i = rowNo * matrixDim; i < (rowNo + 1) * matrixDim; i++) {
			sum += marked.at(i) ?? 0;
		}
		if (sum === matrixDim) {
			sendWonMessage();
			return true;
		}

		// main diagonal sum
		if (colNo === rowNo) {
			sum = 0;
			for (let i = 0; i < matrixDim; i++) {
				sum += marked.at(i * matrixDim + i) ?? 0;
			}
			if (sum === matrixDim) {
				sendWonMessage();
				return true;
			}
		}

		// 2nd diagonal sum
		if (rowNo + colNo === matrixDim - 1) {
			sum = 0;
			for (let i = 1; i <= matrixDim; i++) {
				sum += marked.at(i * (matrixDim - 1)) ?? 0;
			}
			if (sum === matrixDim) {
				sendWonMessage();
				return true;
			}
		}
	};

	const onReflectMark = (data: { markedNumber: number; userName: string }) => {
		let markedNumber = data.markedNumber;
		// let userName = data.userName;
		let markedNumberIndex = -1;
		for (let i = 0; i < matrixDim * matrixDim; i++) {
			if (shuffledDataRef.current[Math.floor(i / matrixDim)][i % matrixDim] === markedNumber) {
				markedNumberIndex = i;
				break;
			}
		}
		if (markedNumberIndex === -1) {
			// just extra check
			toast(`Marked number (${markedNumber}) is not present in your bingo board`);
		} else {
			updateLastChecked(markedNumberIndex);
			mark(markedNumberIndex, true);
			//  TODO : change this to logs - toast(`${userName} marked ${markedNumber}`);
		}
	};

	const onResetGame = () => {
		resetGame();
		resetUserReadyState();
		setMarked(Array(25).fill(0));
	};

	useEffect(() => {
		socket.on("reflectMark", onReflectMark);

		socket.on("readyConfirmed", (result) => {
			if (result.success) {
				updateUser(result.data.user);
				toast.success("Ready for the game");
			} else {
				toast.error(result.errorMessage);
			}
		});

		socket.on("gameStarted", (result) => {
			if (!userRef.current) return;

			if (result.success) {
				updateGameStarted(true);
				toast.success(result.startedBy === userRef.current.userId ? "Game Started" : result.notify);
			} else {
				toast.error(result.errorMessage);
			}
		});

		socket.on("updateTurn", (result) => {
			if (!userRef.current) return;

			if (result.success) {
				if (result.turn === userRef.current.userId) {
					updateMyTurn(true);
					updateStatusMessage("Your Turn");
				} else {
					updateMyTurn(false);
					updateStatusMessage(`${result.userName}'s turn`);
				}
			}
		});

		socket.on("win", (message) => {
			// game is over
			updateGameStarted(false);
			updateGameOver(true);
			if (message === "You Win!") {
				toast.success(message, { autoClose: 5000 });
				updateStatusMessage(message);
			} else {
				updateStatusMessage("You Lost!");
				toast.error("You Lost!", { autoClose: 5000 });
			}
		});

		socket.on("resetGame", () => {
			gameResetTimeoutRef.current = setTimeout(onResetGame, 5000);
		});

		return () => {
			socket.off("reflectMark", onReflectMark);
			socket.off("readyConfirmed");
			socket.off("gameStarted");
			socket.off("updateTurn");
			socket.off("win");
			socket.off("resetGame");
			gameResetTimeoutRef.current && clearTimeout(gameResetTimeoutRef.current);
			gameResetTimeoutRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (lastChecked === null || !socket.connected) return;

		checkIfWon(lastChecked);
	}, [marked, lastChecked]);

	const mark = (index: number, markRequestFromServer = false) => {
		if (!socket.connected) return;
		if ((!markRequestFromServer && !myTurn) || (!markRequestFromServer && marked[index]) || !gameStartedRef.current)
			return;
		if (!markRequestFromServer) {
			// if player marks a number then send it to other players.
			// if other player is marking a number then don't send the same to other players again
			socket.emit("mark", shuffledData[Math.floor(index / matrixDim)][index % matrixDim]);
		}

		// array is not updating correctly, if we are not using setter callback function.
		setMarked((prev) => {
			if (index === 0) {
				return [1, ...prev.slice(1)];
			}
			if (index === prev.length - 1) {
				return [...prev.slice(0, index), 1];
			}
			return [...prev.slice(0, index), 1, ...prev.slice(index + 1, prev.length)];
		});
	};

	return { matrixDim, marked, mark };
}
