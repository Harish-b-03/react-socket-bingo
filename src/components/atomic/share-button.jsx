import { RWebShare } from "react-web-share";
import ShareIcon from "../icons/share-icon";

const ShareButton = () => {
	return (
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
	);
};

export default ShareButton;
