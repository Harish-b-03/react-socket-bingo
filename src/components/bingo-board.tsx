import StatusBar from "./status-bar";
import BingoBoardHeader from "./bingo-board-header";
import WinMessage from "./win-message";
import { useGameContext } from "../contexts/game-context";
import { useThemeContext } from "../contexts/theme-context";
import { useBoardLogic } from "./hooks/useBoardLogic";

const BingoBoard = () => {
	const { gameOver, gameStarted, myTurn, shuffledData, updateLastChecked } = useGameContext();

	const { theme } = useThemeContext();
	const { matrixDim, marked, mark } = useBoardLogic();

	return (
		<>
			<div
				className={`flex flex-col justify-center items-center relative rounded-t-3xl ${
					gameOver && "animate-boardWinAnimation"
				} theme-${theme}`}
			>
				<BingoBoardHeader />
				<div
					className="h-[300px] w-[300px] max-h-full max-w-full grid relative"
					style={{
						gridTemplateColumns: `repeat(${matrixDim || 5}, minmax(0, 1fr))`,
					}}
				>
					{[...Array(matrixDim * matrixDim).keys()].map((_, index) => (
						<button
							key={`data-${index}`}
							className={`relative flex items-center justify-center border border-themed-borderColor text-themed-textColor select-none transition-all duration-150 ${
								marked[index] || !myTurn ? "z-0" : "hover:bg-[rgba(255,255,255,0.15)]"
							} ${myTurn && "cursor-pointer"}`}
							onClick={() => {
								if (!myTurn || marked[index] || !gameStarted) return;

								updateLastChecked(index);
								mark(index);
							}}
						>
							{shuffledData[Math.floor(index / matrixDim)][index % matrixDim]}
							<div
								className={`absolute left-0 top-0 h-[60px] w-[60px] flex justify-center text-5xl select-none z-20 transition-all duration-300 ease-in-out ${
									marked[index] ? "opacity-100 hover:opacity-10" : " opacity-0"
								}`}
							>
								x
							</div>
						</button>
					))}
				</div>
				<StatusBar />
			</div>
			<WinMessage />
		</>
	);
};

export default BingoBoard;
