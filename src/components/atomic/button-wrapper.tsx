import { useState } from "react";
import PopupWrapper from "./popup-wrapper";

interface ButtonWrapperProps {
	content: any;
	onClick?: any;
	tooltipContent?: any;
	buttonClassName?: string;
	tooltipClassName?: string;
	autoCloseOnClick?: boolean;
	showTooltipOnHover?: boolean;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
	onClick = () => {},
	content,
	tooltipContent = null,
	buttonClassName = "",
	tooltipClassName = "",
	autoCloseOnClick = true,
	showTooltipOnHover = false,
}) => {
	const [showPopup, setshowPopup] = useState(false);

	return (
		<div className="relative">
			<button
				className={`w-[36px] h-[36px] p-1.5 text-themed-textColor hover:text-themed-textColorHover ${buttonClassName}`}
				onClick={() => {
					onClick();
					setshowPopup((prev) => !prev);
				}}
				onMouseOver={() => {
					showTooltipOnHover && setshowPopup(true);
				}}
				onMouseOut={() => {
					showTooltipOnHover && setshowPopup(false);
				}}
			>
				{content}
			</button>
			{tooltipContent && (
				<PopupWrapper
					show={showPopup}
					className={tooltipClassName}
					autoCloseOnClick={autoCloseOnClick}
					onHidePopup={() => setshowPopup(false)}
				>
					{tooltipContent}
				</PopupWrapper>
			)}
		</div>
	);
};

export default ButtonWrapper;
