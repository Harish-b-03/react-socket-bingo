import { useUserContext } from "../../contexts/user-context";
import UserIcon from "../icons/user-icon";
import ButtonWrapper from "./button-wrapper";

const PlayersButton = () => {
	const { user } = useUserContext();

	return (
		<ButtonWrapper
			content={
				<div className="relative w-full h-full">
					<UserIcon />
					<span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/3 text-sm opacity-50">
						{user?.roomMates.length}
					</span>
				</div>
			}
			tooltipContent={
				user ? (
					<>
						<span className="text-gray-400">Players in the room</span>
						{[...user.roomMates, "you"].map(
							(mate, idx) => mate !== user.userName && <span key={`mate-${idx}`}>{mate}</span>
						)}
					</>
				) : null
			}
			tooltipClassName="min-w-[180px]"
		/>
	);
};

export default PlayersButton;
