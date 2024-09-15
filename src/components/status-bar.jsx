import { socket } from "../socket";
import ShuffleButton from "./atomic/shuffle-button";
import ShareButton from "./atomic/share-button";
import PlayersButton from "./atomic/players-button";
import SettingsButton from "./atomic/settings-button";

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
			className={`w-[380px] mt-8 flex items-center ${
				!showStatusBar && "hidden"
			} ${isUserReady ? "justify-center" : "justify-between"}`}
		>
			{!gameStarted && !isUserReady && (
				<ShuffleButton onClick={shuffleData} />
			)}
			{!gameStarted && !isUserReady && <PlayersButton />}
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
			{!gameStarted && !isUserReady && <ShareButton />}
			{!gameStarted && !isUserReady && <SettingsButton />}
		</div>
	);
};

export default StatusBar;
