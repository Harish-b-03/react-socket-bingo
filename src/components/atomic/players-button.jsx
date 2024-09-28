import { useUserContext } from "../../contexts/user-context";
import UserIcon from "../icons/user-icon";
import ButtonWrapper from "./button-wrapper";

const PlayersButton = () => {
	const { user } = useUserContext();

	return (
		<ButtonWrapper>
			<div className="relative w-full h-full">
				<UserIcon />
				<span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/3 text-sm opacity-50">
					{user.roomMates.length}
				</span>
			</div>
		</ButtonWrapper>
	);
};

export default PlayersButton;
