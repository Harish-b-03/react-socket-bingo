import ShuffleIcon from "../icons/shuffle-icon";
import ButtonWrapper from "./button-wrapper";

const ShuffleButton = ({ onClick }) => {
	return (
		<ButtonWrapper onClick={onClick}>
			<ShuffleIcon />
		</ButtonWrapper>
	);
};

export default ShuffleButton;
