import { useEffect, useState } from "react";
import { socket } from "../socket";
import { toast } from "react-toastify";

const InputModal = ({ setUser }) => {
	const [showModal, setShowModal] = useState(true);
	const [name, setName] = useState("");
	const [roomId, setRoomId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [prefetchedUrl, setPrefetchedUrl] = useState(false);

	useEffect(() => {
		const url = new URL(window.location);
		const roomId = url.searchParams.get("roomId");
		let urlState = { urlPath: "/" };

		if (
			!(
				!roomId ||
				roomId === "null" ||
				roomId === "undefined" ||
				roomId?.replace(/[^A-Za-z0-9]/g, "").length === 0
			)
		) {
			setRoomId(roomId);
			setPrefetchedUrl(true);
		}

		window.history.pushState(urlState, "", url.toString().split("/?")[0]); // format: window.history.pushState(state, unused, url)
	}, []);

	useEffect(() => {
		socket.on("joinRoomError", (errorMessage) => {
			setErrorMessage(errorMessage);
		});

		socket.on("joinedRoom", (user) => {
			setUser(user);
			toast(`Joined room (#${user.roomId})`);
			setShowModal(false);
		});

		return () => {
			socket.off("joinRoomError");
			socket.off("joinedRoom");
		};
	}, []);

	const onSubmit = () => {
		if (name.trim === "" || roomId.trim() === "") return;

		socket.emit("joinRoom", name.trim(), roomId.trim());
	};

	return (
		<div
			className={`${
				showModal ? "opacity-100" : "opacity-0 pointer-events-none"
			} overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-[rgba(0,0,0,0.5)] transition-all duration-300`}
		>
			<div
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				className="relative p-4 w-full max-w-md max-h-full"
			>
				<div className="relative bg-white rounded-lg shadow ">
					<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
						<h3 className="text-xl font-semibold text-gray-900">
							Welcome to Bingo
						</h3>
					</div>
					<div className="p-4 md:p-5">
						<form className="space-y-4" action="#">
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">
									Your name
									<input
										onChange={(e) =>
											setName(e.target.value)
										}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
										placeholder="Enter your name"
										required
									/>
								</label>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">
									{prefetchedUrl
										? "Joining room"
										: "Create or join a room"}
									<input
										value={roomId}
										onChange={(e) =>
											setRoomId(e.target.value)
										}
										placeholder="Enter room name to create/join the room"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 disabled:opacity-50"
										required
										disabled={prefetchedUrl}
									/>
									{errorMessage && (
										<div className="mt-1 text-xs text-red-500 font-semibold">
											{errorMessage}
										</div>
									)}
								</label>
							</div>
							<button
								disabled={
									!(
										name.trim() !== "" &&
										roomId.trim() !== ""
									)
								}
								onClick={() => onSubmit()}
								className="w-full text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-violet-300"
							>
								Play
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InputModal;
