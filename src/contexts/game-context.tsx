import React, {
	ReactElement,
	createContext,
	useContext,
	useState,
} from "react";
import { shuffle } from "../helpers/helper";

interface GameContextType {
	shuffledData: number[][];
	marked: number[];
	gameStarted: boolean;
	myTurn: boolean;
	statusMessage: string; // this state variable is used to store turn message, like "Your turn", "Player1's turn", and win message like "You win" and "You Lost"
	lastChecked: number | null;
	gameOver: boolean; // we can't use gameStarted variable to check whether the game is over or not, as we have many game status like "player not ready and game not started". "player ready", "game started". So, using this variable.
	updateShuffledData: () => void;
	updateMarked: (val: number[]) => void;
	updateGameStarted: (val: boolean) => void;
	updateMyTurn: (val: boolean) => void;
	updateStatusMessage: (val: string) => void;
	updateLastChecked: (val: number) => void;
	updateGameOver: (val: boolean) => void;
	resetGame: () => void;
}

const initialGameState: GameContextType = {
	shuffledData: shuffle(),
	marked: Array(25).fill(0),
	gameStarted: false,
	myTurn: false,
	statusMessage: "",
	lastChecked: null,
	gameOver: false,
	updateShuffledData: () => {},
	updateMarked: () => {},
	updateGameOver: () => {},
	updateGameStarted: () => {},
	updateMyTurn: () => {},
	updateStatusMessage: () => {},
	updateLastChecked: () => {},
	resetGame: () => {},
};

const GameStateContext = createContext<GameContextType>(initialGameState);

export const GameStateProvider: React.FC<{ children: ReactElement }> = ({
	children,
}) => {
	const [lastChecked, setLastChecked] = useState<number | null>(null);
	const [shuffledData, setShuffledData] = useState<number[][]>(shuffle());
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [myTurn, setMyTurn] = useState<boolean>(false);
	const [statusMessage, setStatusMessage] = useState<string>(""); // this state variable is used to store turn message, like "Your turn", "Player1's turn", and win message like "You win" and "You Lost"
	const [gameOver, setGameOver] = useState<boolean>(false); // we can't use gameStarted variable to check whether the game is over or not, as we have many game status like "player not ready and game not started". "player ready", "game started". So, using this variable.
	const [marked, setMarked] = useState<number[]>(Array(25).fill(0));

	const updateLastChecked = (value: number) => setLastChecked(value);
	const updateShuffledData = () => setShuffledData(shuffle());
	const updateGameStarted = (value: boolean) => setGameStarted(value);
	const updateMyTurn = (value: boolean) => setMyTurn(value);
	const updateStatusMessage = (value: string) => setStatusMessage(value);
	const updateGameOver = (value: boolean) => setGameOver(value);
	const updateMarked = (value: number[]) => setMarked(value);

	const resetMarked = () => {
		updateMarked(Array(25).fill(0));
	};
	const resetGame = () => {
		setGameStarted(false);
		setLastChecked(null);
		setMyTurn(false);
		setStatusMessage("");
		setGameOver(false);
		resetMarked();
	};

	return (
		<GameStateContext.Provider
			value={{
				lastChecked,
				shuffledData,
				gameStarted,
				myTurn,
				statusMessage,
				gameOver,
				marked,
				updateLastChecked,
				updateShuffledData,
				updateGameStarted,
				updateMyTurn,
				updateStatusMessage,
				updateGameOver,
				updateMarked,
				resetGame,
			}}
		>
			{children}
		</GameStateContext.Provider>
	);
};

export const useGameContext = () => useContext(GameStateContext);
