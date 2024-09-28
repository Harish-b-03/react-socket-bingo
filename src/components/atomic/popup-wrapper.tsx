import { useEffect, useRef, useState } from "react";

interface PopupWrapperPropsType {
	show: boolean;
	children: any;
	className?: string;
	autoCloseOnClick?: boolean;
	onHidePopup?: () => void;
}

const PopupWrapper: React.FC<PopupWrapperPropsType> = ({
	show,
	children,
	className = "",
	autoCloseOnClick = false,
	onHidePopup = () => {},
}) => {
	const [showPopup, setShowPopup] = useState(show);
	const timeout = useRef<number | null>(null);

	const hidePopup = () => {
		setShowPopup(false);
		onHidePopup();
	};

	useEffect(() => {
		setShowPopup(show);
		if (autoCloseOnClick) {
			timeout.current && clearTimeout(timeout.current);
			timeout.current = window.setTimeout(() => hidePopup(), 2000);
		}

		return () => {
			clearTimeout(timeout.current ?? '');
		};
	}, [autoCloseOnClick, show]);

	return (
		<div
			className={` 
                ${showPopup && "opacity-100"}
                opacity-0 absolute top-full left-1/2 -translate-x-1/2 w-fit h-fit pt-1.5 pb-2 px-4 mt-1 text-center bg-[rgba(0,0,0,0.4)] rounded-lg flex flex-col text-white transition-opacity duration-300 ease-in-out
				${className}
            `}
		>
			{children}
		</div>
	);
};

export default PopupWrapper;
