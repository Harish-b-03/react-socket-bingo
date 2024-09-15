
const BingoBoardHeader = () => {
	return (
		<div className="w-[300px] flex border border-themed-borderColor text-themed-textColor rounded-t-3xl box-border">
			{["B", "i", "n", "g", "o"].map((letter, index) => (
				<div
					key={`letter-${index}`}
					className="w-[60px] h-[60px] flex items-center justify-center font-bold"
				>
					{letter.toUpperCase()}
				</div>
			))}
		</div>
	);
};

export default BingoBoardHeader;
