import SettingsIcon from "../icons/settings-icon";
import ButtonWrapper from "./button-wrapper";

const SettingsButton = () => {
	return <ButtonWrapper content={<SettingsIcon />} tooltipContent={"Settings"} />;
};

export default SettingsButton;
