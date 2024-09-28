import { useEffect, useRef, useState } from "react";
import BingoBoard from "./components/bingo-board";
import { socket } from "./socket";
import { toast } from "react-toastify";
import InputModal from "./components/input-modal";
import Topbar from "./components/topbar";
import { UserType, useUserContext } from "./contexts/user-context";
import { useThemeContext } from "./contexts/theme-context";

const Home: React.FC = () => {
	const [connected, setConnected] = useState(false);
	const { user, updateUser } = useUserContext();
	const { theme, themeVariables } = useThemeContext();
	const userRef = useRef<UserType | null>();
	userRef.current = user;

	// TODO: terrible solution. refactor this
	const posterThemedStyles =
		theme === "galaxyMoon"
			? {
				background: "url(https://img.freepik.com/free-vector/outer-space-game-background_107791-29708.jpg?w=1380&t=st=1726311359~exp=1726311959~hmac=47e6e3d552409d7277994c277a82e8f86762711637b4773c0618bd6d4e8fdd3f)",
				// background: "url(https://img.freepik.com/free-vector/neon-lights-background-theme_52683-44625.jpg?w=1380&t=st=1726311264~exp=1726311864~hmac=109d8d4a3caa1f43e580372b725bee07f653c669a0c2f3871cd72c6fbdab7417)",
				// background: "url(https://img.freepik.com/free-vector/pink-neon-background_53876-91656.jpg?w=1380&t=st=1726310597~exp=1726311197~hmac=5ed0dda23aad18e98ad81b2f62ee62bc50230c1e2dfaffe655a19c62a6315e8a)",
				"background-size": "cover",
				"background-repeat": "no-repeat",
			  }
			: {};
	const themedStyles =
		theme !== "light"
			? {
					boxShadow: "var(--box-shadow)",
					"backdrop-filter": "blur(var(--backdrop-blur))",
					"border-radius": "10px",
					border: "1px solid var(--border-color)",
					padding: "60px 40px 40px 40px",
			  }
			: {};

	const onConnect = () => {
		setConnected(true);
	};

	const onMessage = (message: string) => {
		toast(message);
	};

	const onUpdateRoomMates = (value: string[]) => {
		if(!userRef.current) return; 
		
		// we must use ref to get the current user value inside useEffect

		updateUser({...userRef.current, roomMates: value});
	}

	useEffect(() => {
		socket.on("connect", onConnect);
		socket.on("message", onMessage);
		socket.on("updateRoommates", onUpdateRoomMates);

		return () => {
			socket.off("connect");
			socket.off("message");
			socket.off("updateRoommates");
		};
	}, []);

	if (connected) {
		return (
			<div
				className={`h-svh w-screen overflow-auto overflow-x-hidden flex justify-center items-center bg-themed-poster theme-${theme}`}
				style={{...posterThemedStyles, ...themeVariables}}
			>
				{user && (
					<div
						className="flex flex-col bg-themed-boardBg justify-center items-center"
						style={themedStyles}
					>
						<Topbar />
						<BingoBoard />
					</div>
				)}
				<InputModal />
			</div>
		);
	}
	return (
		<div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
			Connecting to the server...
		</div>
	);
};

export default Home;
