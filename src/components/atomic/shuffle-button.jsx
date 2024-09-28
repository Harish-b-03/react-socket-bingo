import ShuffleIcon from "../icons/shuffle-icon";
import ButtonWrapper from "./button-wrapper";

const ShuffleButton = ({ onClick }) => {
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
