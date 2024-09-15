import { useEffect, useState } from "react";
import BingoBoard from "./components/bingo-board";
import { socket } from "./socket";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputModal from "./components/input-modal";
import { isMobile } from "react-device-detect";
import Topbar from "./components/topbar";
import { useUserContext } from "./contexts/user-context";

const Home: React.FC = () => {
	const [connected, setConnected] = useState(false);
	const { user } = useUserContext();

	const onConnect = () => {
		setConnected(true);
	};

	const onMessage = (message: string) => {
		toast(message);
	};

	useEffect(() => {
		socket.on("connect", onConnect);
		socket.on("message", onMessage);

		return () => {
			socket.off("connect");
			socket.off("message");
		};
	}, []);

	if (connected) {
		return (
			<div className="h-svh w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
				{user && (
					<div className="flex flex-col justify-center items-center">
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
