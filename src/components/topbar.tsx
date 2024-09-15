import { toast } from "react-toastify";
import ClipboardIcon from "./icons/clipboard-icon";
import { useUserContext } from "../contexts/user-context";

const Topbar: React.FC = () => {
	const { user } = useUserContext();
	if (!user) return;

	const copyRoomIDText = `RoomID: ${user.roomId}`;

	const copyToClipboard = async () => {
		try {
			await window.navigator.clipboard.writeText(copyRoomIDText);
			toast.success("Room ID copied");
		} catch (err) {
			console.error("Unable to copy to clipboard.", err);
			toast.error("Copy to clipboard failed.");
		}
	};

	return (
		<div className="w-[300px]">
			<button
				className="py-1 text-sm flex items-center float-right text-gray-600 font-light cursor-pointer"
				onClick={copyToClipboard}
			>
				{/* <span className="-mb-1">{user.userName}</span> */}
				<span>roomId: {user.roomId}</span>
				<div className="w-[14px] h-[14px]">
					<ClipboardIcon />
				</div>
			</button>
		</div>
	);
};

export default Topbar;
