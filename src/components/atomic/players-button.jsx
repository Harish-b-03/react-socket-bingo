import UserIcon from "../icons/user-icon";
import ButtonWrapper from "./button-wrapper";

const PlayersButton = () => {
	return (
		<ButtonWrapper>
			<div className="relative w-full h-full">
				<UserIcon />
				<span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/3 text-sm opacity-50">3</span>
			</div>
		</ButtonWrapper>
	);
};

export default PlayersButton;
