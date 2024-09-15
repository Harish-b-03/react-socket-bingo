import ShuffleIcon from "../icons/shuffle-icon";

const ShuffleButton = ({onClick}) => {
	return (
		<button
			onClick={onClick}
			className="w-[36px] h-[36px] p-1 hover:text-violet-700"
		>
			<ShuffleIcon />
		</button>
	);
};

export default ShuffleButton;
