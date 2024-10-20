import { useGameContext } from "../../contexts/game-context";
import AboutIcon from "../icons/about-icon";
import ButtonWrapper from "./button-wrapper";

const AboutButton = () => {
	const { updateShowAboutContent } = useGameContext();

	return (
		<ButtonWrapper
			content={<AboutIcon />}
			tooltipContent={"About"}
			showTooltipOnHover={true}
			onClick={() => {
				updateShowAboutContent(true);
			}}
		/>
	);
};

export default AboutButton;
