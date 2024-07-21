import { socket } from "../socket";

const StatusBar = ({
	gameStarted,
	myTurn,
	turnMessage,
	isUserReady,
	shuffleData,
	resetMarked,
}) => {
	const getStatusMessage = () => {
		if (gameStarted) {
			if (myTurn) {
				return "Your Turn";
			} else {
				return turnMessage;
			}
		} else if (isUserReady) {
			return "Start";
		} else {
			return "Ready";
		}
	};

	const getStyles = () => {
		let styles =
			" my-3 text-center transition-all duration-300 ease-in-out rounded-full ";

		if (gameStarted) {
			styles += " w-[300px] ";
			if (myTurn) {
				styles += " py-1 text-white bg-violet-500 font-semibold capitalize tracking-widest ";
			}
		} else if (isUserReady) {
			styles +=
				" w-[150px] py-2 text-white bg-violet-500 border border-violet-600 active:text-violet-500 hover:bg-violet-600 focus:outline-none focus:ring ";
		} else {
			styles +=
				" w-[125px] py-2 text-white bg-violet-500 border border-violet-600 active:text-violet-500 hover:bg-violet-600 focus:outline-none focus:ring ";
		}

		return styles;
	};

	return (
		<div className="w-[300px] mt-3 flex justify-evenly items-center">
			{!gameStarted && !isUserReady && (
				<button onClick={() => resetMarked()} className="m-3">
					Reset
				</button>
			)}
			<button
				onClick={() => {
					if (gameStarted) return;

					if (isUserReady) {
						socket.emit("startGame");
					} else {
						socket.emit("playerReadyToStart");
					}
				}}
				className={getStyles()}
			>
				{getStatusMessage()}
			</button>
			{!gameStarted && !isUserReady && (
				<button onClick={shuffleData} className="m-3">
					Shuffle
				</button>
			)}

			{/* {gameStarted ? (
				myTurn ? (
					<span>Your Turn</span>
				) : (
					<span>{turnMessage}</span>
				)
			) : isUserReady ? (
				<button
					onClick={() => {
						socket.emit("startGame");
					}}
					className="m-3 px-14 py-2 min-w-[120px] text-center text-white bg-violet-500 border border-violet-600 rounded-full active:text-violet-500 hover:bg-violet-600 focus:outline-none focus:ring"
				>
					Start
				</button>
			) : (
				<>
					<button onClick={() => resetMarked()} className="m-3">
						Reset
					</button>
					<button
						onClick={() => {
							socket.emit("playerReadyToStart");
						}}
						className="m-3 px-6 py-2 min-w-[120px] text-center text-white bg-violet-500 border border-violet-600 rounded-full active:text-violet-500 hover:bg-violet-600 focus:outline-none focus:ring"
					>
						Ready
					</button>
					<button onClick={shuffleData} className="m-3">
						Shuffle
					</button>
				</>
			)} */}
		</div>
	);
};

export default StatusBar;
