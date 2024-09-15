import { RWebShare } from "react-web-share";
import ShareIcon from "../icons/share-icon";
import ButtonWrapper from "./button-wrapper";

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
			<ButtonWrapper>
				<ShareIcon />
			</ButtonWrapper>
		</RWebShare>
	);
};

export default ShareButton;
