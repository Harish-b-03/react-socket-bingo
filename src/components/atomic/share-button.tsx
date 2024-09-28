import { RWebShare } from "react-web-share";
import ShareIcon from "../icons/share-icon";
import ButtonWrapper from "./button-wrapper";
import { useUserContext } from "../../contexts/user-context";

const ShareButton = () => {
	const { user } = useUserContext();
	if (!user || !user.roomId) return;

	return (
		<RWebShare
			data={{
				text: "Hey! Join me to play Bingo. Here's the room link:",
				url: `https://react-socket-bingo.vercel.app/?roomId=${user?.roomId}`,
				title: "Share room link",
			}}
			onClick={() => {}}
		>
			<ButtonWrapper
				content={<ShareIcon />}
				tooltipContent={"Share"}
				showTooltipOnHover={true}
			/>
		</RWebShare>
	);
};

export default ShareButton;
