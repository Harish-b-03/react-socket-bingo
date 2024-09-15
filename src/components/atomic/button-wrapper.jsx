const ButtonWrapper = ({ onClick = () => {}, children }) => {
	return (
		<button
			className="w-[36px] h-[36px] p-1.5 text-themed-textColor hover:text-themed-textColorHover"
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default ButtonWrapper;
