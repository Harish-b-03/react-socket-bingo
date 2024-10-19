import { socket } from "../socket";
import ShuffleButton from "./atomic/shuffle-button";
import ShareButton from "./atomic/share-button";
import PlayersButton from "./atomic/players-button";
import SettingsButton from "./atomic/settings-button";
import { useGameContext } from "../contexts/game-context";
import { useUserContext } from "../contexts/user-context";
import { RWebShare } from "react-web-share";

const StatusBar = () => {
	const { gameStarted, gameOver, myTurn, statusMessage, updateShuffledData } = useGameContext();
	const { user } = useUserContext();

	const isUserReady = user?.readyToStart;
	const showInviteFriendButton = isUserReady && user?.roomMates.length < 2;

	const getStatusMessage = () => {
		if (gameStarted) {
			if (myTurn) {
				return "Your Turn";
			} else {
				return statusMessage;
			}
		} else if (showInviteFriendButton) {
			return "Invite friend!";
		} else if (isUserReady) {
			return "Start";
		} else {
			return "Ready";
		}
	};

	const getStyles = () => {
		let styles =
			" my-3 text-center transition-all duration-300 ease-in-out rounded-full h-[32px] flex justify-center items-center";

		if (gameStarted) {
			styles += " w-[300px]  py-1";
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

	if (!user) return;

	return (
		<div
			className={`w-[380px] mt-8 flex items-center ${gameOver && "hidden"} ${
				isUserReady ? "justify-center" : "justify-between"
			}`}
		>
			{!gameStarted && !isUserReady && <ShuffleButton onClick={updateShuffledData} />}
			{!gameStarted && !isUserReady && <PlayersButton />}
			{showInviteFriendButton ? (
				<RWebShare
					data={{
						text: "Hey! Join me to play Bingo. Here's the room link:",
						url: `https://react-socket-bingo.vercel.app/?roomId=${user?.roomId}`,
						title: "Share room link",
					}}
					onClick={() => {}}
				>
					<button className={getStyles()} onClick={() => {}}>
						{getStatusMessage()}
					</button>
				</RWebShare>
			) : (
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
			)}
			{!gameStarted && !isUserReady && <ShareButton />}
			{!gameStarted && !isUserReady && <SettingsButton />}
		</div>
	);
};

export default StatusBar;
