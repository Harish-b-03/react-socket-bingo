import { socket } from "../socket";
import ShareIcon from "./icons/share-icon";
import { RWebShare } from "react-web-share";
import ShuffleIcon from "./icons/shuffle-icon";

const StatusBar = ({
	gameStarted,
	myTurn,
	turnMessage,
	isUserReady,
	shuffleData,
	showStatusBar,
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
			styles += " w-[300px]  py-1";
			if (myTurn) {
				styles +=
					" py-1 text-white bg-violet-500 font-semibold capitalize tracking-widest ";
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
		<div
			className={`w-[300px] mt-3 px-4 flex items-center ${
				!showStatusBar && "hidden"
			} ${isUserReady ? "justify-center" : "justify-between"}`}
		>
			{!gameStarted && !isUserReady && (
				<button
					onClick={shuffleData}
					className="w-[36px] h-[36px] p-1 hover:text-violet-700"
				>
					<ShuffleIcon />
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
				<RWebShare
					data={{
						text: "Hey! Join me to play Bingo. Here's the room link:",
						url: "https://react-socket-bingo.vercel.app/",
						title: "Share room link",
					}}
					onClick={() => {}}
				>
					<button className="w-[36px] h-[36px] p-1.5 hover:text-violet-700">
						<ShareIcon />
					</button>
				</RWebShare>
			)}
		</div>
	);
};

export default StatusBar;
