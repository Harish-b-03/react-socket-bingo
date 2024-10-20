import { useEffect, useRef, useState } from "react";
import BingoBoard from "./components/bingo-board";
import { socket } from "./socket";
import { toast } from "react-toastify";
import InputModal from "./components/input-modal";
import Topbar from "./components/topbar";
import { UserType, useUserContext } from "./contexts/user-context";
import { useThemeContext } from "./contexts/theme-context";
import { useGameContext } from "./contexts/game-context";
import About from "./components/about";

const Home: React.FC = () => {
	const [connected, setConnected] = useState(false);
	const { user, updateUser } = useUserContext();
	const { gameOver, showAboutContent } = useGameContext();
	const { theme, themeVariables } = useThemeContext();
	const userRef = useRef<UserType | null>();
	userRef.current = user;

	// TODO: terrible solution. refactor this
	const posterThemedStyles =
		theme === "galaxyMoon"
			? {
					background: "url('/assets/background-poster.jpg')",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
			  }
			: {};
	const themedStyles =
		theme !== "light"
			? {
					boxShadow: "var(--box-shadow)",
					backdropFilter: "blur(var(--backdrop-blur))",
					borderRadius: "10px",
					border: "1px solid var(--border-color)",
					padding: gameOver ? "40px" : "60px 40px 40px 40px",
			  }
			: {};

	const onConnect = () => {
		setConnected(true);
	};

	const onMessage = (message: string) => {
		toast(message);
	};

	const onUpdateRoomMates = (value: string[]) => {
		if (!userRef.current) return;

		// we must use ref to get the current user value inside useEffect

		updateUser({ ...userRef.current, roomMates: value });
	};

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
				style={{ ...posterThemedStyles, ...themeVariables }}
			>
				<div
					className={`${
						user && !showAboutContent ? "opacity-100" : "opacity-0 pointer-events-none"
					} flex flex-col bg-themed-boardBg justify-center items-center`}
					style={themedStyles}
				>
					<Topbar />
					<BingoBoard />
				</div>

				<InputModal />
				<About />
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
