import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { toast } from "react-toastify";
import StatusBar from "./status-bar";
import BingoBoardHeader from "./bingo-board-header";
import WinMessage from "./win-message";
import { UserType, useUserContext } from "../contexts/user-context";
import { useGameContext } from "../contexts/game-context";

const BingoBoard = () => {
	const [matrixDim] = useState<number>(5);
	const gameResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>();
	const { user, updateUser } = useUserContext();
	const {
		gameOver,
		gameStarted,
		lastChecked,
		marked,
		myTurn,
		resetGame,
		shuffledData,
		updateGameOver,
		updateGameStarted,
		updateLastChecked,
		updateMarked,
		updateMyTurn,
		updateStatusMessage,
	} = useGameContext();

	const shuffledDataRef = useRef<number[][]>(shuffledData);

	const resetUserReadyState = (status = false) => {
		if (!user) return;

		const newUserDetails: UserType = { ...user, readyToStart: status };
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

	const onReflectMark = (data: {
		markedNumber: number;
		userName: string;
	}) => {
		let markedNumber = data.markedNumber;
		// let userName = data.userName;
		let markedNumberIndex = -1;
		for (let i = 0; i < matrixDim * matrixDim; i++) {
			if (
				shuffledDataRef.current[Math.floor(i / matrixDim)][
					i % matrixDim
				] === markedNumber
			) {
				markedNumberIndex = i;
				break;
			}
		}

		if (markedNumberIndex === -1) {
			// just extra check
			toast(
				`Marked number (${markedNumber}) is not present in your bingo board`
			);
		} else {
			updateLastChecked(markedNumberIndex);
			mark(markedNumberIndex, true);
			//  TODO : change this to logs - toast(`${userName} marked ${markedNumber}`);
		}
	};

	const onResetGame = () => {
		resetGame();
		resetUserReadyState();
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
			if (!user) return;

			if (result.success) {
				updateGameStarted(true);
				toast.success(
					result.startedBy === user.userId
						? "Game Started"
						: result.notify
				);
			} else {
				toast.error(result.errorMessage);
			}
		});

		socket.on("updateTurn", (result) => {
			if (!user) return;

			if (result.success) {
				if (result.turn === user.userId) {
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
			gameResetTimeoutRef.current &&
				clearTimeout(gameResetTimeoutRef.current);
			gameResetTimeoutRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (lastChecked === null || !socket.connected) return;

		checkIfWon(lastChecked);
	}, [marked]);

	const mark = (index: number, markRequestFromServer = false) => {
		if (!socket.connected) return;
		if (
			(!markRequestFromServer && !myTurn) ||
			(!markRequestFromServer && marked[index]) ||
			!gameStarted
		)
			return;

		if (!markRequestFromServer) {
			// if player marks a number then send it to other players.
			// if other player is marking a number then don't send the same to other players again
			socket.emit(
				"mark",
				shuffledData[Math.floor(index / matrixDim)][index % matrixDim]
			);
		}

		switch (index) {
			case 0:
				updateMarked([1, ...marked.slice(1)]);
				break;
			case marked.length - 1:
				updateMarked([...marked.slice(0, index), 1]);
				break;
			default:
				updateMarked([
					...marked.slice(0, index),
					1,
					...marked.slice(index + 1, marked.length),
				]);
				break;
		}
	};

	return (
		<>
			<div
				className={`flex flex-col justify-center items-center relative rounded-t-3xl ${
					gameOver && "animate-boardWinAnimation"
				}`}
			>
				<BingoBoardHeader />
				<div
					className="h-[300px] w-[300px] max-h-full max-w-full grid relative"
					style={{
						gridTemplateColumns: `repeat(${
							matrixDim || 5
						}, minmax(0, 1fr))`,
					}}
				>
					{[...Array(matrixDim * matrixDim).keys()].map(
						(_, index) => (
							<button
								key={`data-${index}`}
								className={`relative cursor-pointer flex items-center justify-center border border-gray-200 select-none ${
									marked[index] || !myTurn
										? "z-0"
										: "hover:bg-slate-100"
								}`}
								onClick={() => {
									if (
										!myTurn ||
										marked[index] ||
										!gameStarted
									)
										return;

									updateLastChecked(index);
									mark(index);
								}}
							>
								{
									shuffledData[Math.floor(index / matrixDim)][
										index % matrixDim
									]
								}
								<div
									className={`absolute left-0 top-0 h-[60px] w-[60px] flex justify-center text-5xl select-none z-20 transition-all duration-300 ease-in-out ${
										marked[index]
											? "opacity-100 hover:opacity-10"
											: " opacity-0"
									}`}
								>
									x
								</div>
							</button>
						)
					)}
				</div>
				<StatusBar />
			</div>
			<WinMessage />
		</>
	);
};

export default BingoBoard;
