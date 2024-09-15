import UserIcon from "../icons/user-icon";

const PlayersButton = () => {
	return (
		<button className="relative w-[36px] h-[36px] p-1.5 hover:text-violet-700">
			<UserIcon />
            <span className="absolute top-0 right-0 text-sm opacity-50">3</span>
		</button>
	);
};

export default PlayersButton;
