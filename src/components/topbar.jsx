import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import ClipboardIcon from "./icons/clipboard-icon";

const Topbar = ({ user }) => {
	return (
		<div>
			<CopyToClipboard
				text={`RoomID: ${user.roomId}`}
				onCopy={() => {
					toast("RoomID copied");
				}}
			>
				<div className="py-1 text-sm flex items-center float-right text-gray-600 font-light cursor-pointer">
					{/* <span className="-mb-1">{user.userName}</span> */}
					<span>roomId: {user.roomId}</span>
					<div className="w-[14px] h-[14px]">
						<ClipboardIcon />
					</div>
				</div>
			</CopyToClipboard>
		</div>
	);
};

export default Topbar;
