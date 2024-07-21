import { useEffect, useState } from "react";
import BingoBoard from "./components/bingo-board";
import { socket } from "./socket";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputModal from "./components/input-modal";
import { isMobile } from "react-device-detect";

const App = () => {
	const [connected, setConnected] = useState(false);
	const [user, setUser] = useState(null);

	const onConnect = () => {
		setConnected(true);
	};

	const onMessage = (message) => {
		toast(message);
	};

	const resetUserReadyState = (status) => {
		setUser((prev) => ({
			...prev,
			readyToStart: status,
		}));
		toast("Reseting game");
	};

	useEffect(() => {
		socket.on("connect", onConnect);
		socket.on("message", onMessage);

		return () => {
			socket.off("connect");
			socket.off("message");
		};
	}, []);

	useEffect(() => {
		console.log(user);
	}, [user]);

	return (
		<>
			{connected ? (
				<div className="h-svh w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
					{user !== null && (
						<BingoBoard
							user={user}
							setUser={setUser}
							resetUserReadyState={resetUserReadyState}
						/>
					)}
					<InputModal setUser={setUser} />
				</div>
			) : (
				<div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
					Connecting to the server...
				</div>
			)}
			<ToastContainer position={isMobile? "bottom-center" : "top-right"} autoClose={2000} pauseOnFocusLoss={false} transition={Slide} stacked style={{transform: isMobile && "scale(0.75)"}}/>
		</>
	);
};

export default App;
