import { useGameContext } from "../contexts/game-context";

const WinMessage = () => {
	const { gameOver, statusMessage } = useGameContext();

	return (
		<div
			className={`${gameOver ? "animate-winMessageAnimation" : "hidden"} ${
				statusMessage === "You Win!" ? "bg-violet-500" : "bg-red-500"
			} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-[60px] w-[310px] h-[60px] mt-[30px] flex justify-center items-center`}
		>
			<span className="text-2xl text-white font-semibold uppercase tracking-widest">{statusMessage}</span>
		</div>
	);
};

export default WinMessage;
