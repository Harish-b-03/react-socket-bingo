import ShuffleIcon from "../icons/shuffle-icon";
import ButtonWrapper from "./button-wrapper";

interface IShuffleButtonProps {
	onClick: () => void;
}

const ShuffleButton: React.FC<IShuffleButtonProps> = ({ onClick }) => {
	return (
		<ButtonWrapper
			onClick={onClick}
			content={<ShuffleIcon />}
			tooltipContent={"Shuffle"}
			showTooltipOnHover={true}
		/>
	);
};

export default ShuffleButton;
