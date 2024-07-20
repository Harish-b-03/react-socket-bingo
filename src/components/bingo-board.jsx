import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { toast } from "react-toastify";

const shuffle = () => {
    const array = [...Array(26).keys()].slice(1);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return [
        array.slice(0, 5),
        array.slice(5, 10),
        array.slice(10, 15),
        array.slice(15, 20),
        array.slice(20, 25),
    ];
};

const BingoBoard = ({ user, setUser, resetUserReadyState }) => {
    const [marked, setMarked] = useState([...Array(25).keys()].fill(0));
    const [lastChecked, setLastChecked] = useState(null);
    const [shuffledData, setShuffledData] = useState(shuffle());
    const [gameStarted, setGameStarted] = useState(false);
    const [myTurn, setMyTurn] = useState(false);
    const [turnMessage, setTurnMessage] = useState("");
    const [matrixDim, setMatrixDim] = useState(5);
    const shuffledDataRef = useRef();
    shuffledDataRef.current = shuffledData;

    const sendWonMessage = () => {
        if (!socket.connected) return;

        socket.emit("iWonMessage", marked); // check the correctness in backend and get the won board to show in the win message
    };

    const checkIfWon = (index) => {
        index += 1; // converting 0-based index to 1-based index
        let mod = index % matrixDim;
        let sum;

        // col sum
        sum = 0;
        for (let i = 0; i < matrixDim; i++) {
            sum += marked.at(i * matrixDim + mod - 1); // index - 1
        }
        if (sum === matrixDim) {
            toast("won - col");
            sendWonMessage();
            return true;
        }

        // row sum
        let div = Math.floor((index - 1) / matrixDim);
        sum = 0;
        for (let i = div * matrixDim; i < (div + 1) * matrixDim; i++) {
            sum += marked.at(i);
        }
        if (sum === matrixDim) {
            sendWonMessage();
            toast("won - row");
            return true;
        }

        // main diagonal sum
        if((index-1) % matrixDim === Math.trunc((index-1) / matrixDim)){
            sum = 0;
            for (let i = 0; i < matrixDim; i++) {
                sum += marked.at(i * matrixDim + i);
            }
            if (sum === matrixDim) {
                toast("won - main diagonal");
                sendWonMessage();
                return true;
            }
        }

        // 2nd diagonal sum
        if((index-1) % matrixDim + (index-1) / matrixDim === (matrixDim-1)){
            sum = 0;
            for (let i = 1; i <= matrixDim; i++) {
                sum += marked.at(i * 4);
            }
            if (sum === matrixDim) {
                toast("won - 2nd diagonal");
                sendWonMessage();
                return true;
            }
        }
    };

    const onReflectMark = (data) => {
        let markedNumber = data.markedNumber;
        // let userName = data.userName;
        let markedNumberIndex = -1;
        for (let i = 0; i < matrixDim * matrixDim; i++) {
            if (shuffledDataRef.current[Math.floor(i / matrixDim)][i % matrixDim] === markedNumber) {
                markedNumberIndex = i;
                break;
            }
        }

        if (markedNumberIndex === -1) { // just extra check
            toast(
                `Marked number (${markedNumber}) is not present in your bingo board`
            );
        } else {
            setLastChecked(markedNumberIndex);
            mark(markedNumberIndex, true);
            // toast(`${userName} marked ${markedNumber}`);
        }
    };

    const resetMarked = () => {
        setMarked([...Array(25).keys()].fill(0));
    }

    const onResetGame = () => {
        setGameStarted(false);
        setLastChecked(false);
        resetMarked();
        resetUserReadyState();
    } 
    

    useEffect(() => {
        socket.on("reflectMark", onReflectMark);

        socket.on("readyConfirmed", (result) => {
            if (result.success) {
                setUser(result.data.user);
                toast.success("Ready for the game");
            } else {
                toast.error(result.errorMessage);
            }
        });

        socket.on("gameStarted", (result) => {
            if (result.success) {
                setGameStarted(true);
                toast.success(
                    result.startedBy === user.userId
                        ? "Game Started"
                        : result.notify
                );
            } else {
                toast.error(result.errorMessage);
            }
        });

        socket.on("updateTurn", (result) => {
            if (result.success) {
                if (result.turn === user.userId) {
                    setMyTurn(true);
                    setTurnMessage("Your Turn");
                } else {
                    setMyTurn(false);
                    setTurnMessage(`${result.userName}'s turn`);
                }
            }
        });

        socket.on("win", (message) => {
            toast(message);
        });

        socket.on("resetGame", onResetGame);

        return () => {
            socket.off("reflectMark", onReflectMark);
            socket.off("readyConfirmed");
            socket.off("gameStarted");
            socket.off("updateTurn");
            socket.off("win");
            socket.off("resetGame");
        };
    }, []);

    useEffect(() => {
        if (lastChecked === null || !socket.connected) return;

        checkIfWon(lastChecked);
    }, [marked]);

    const mark = (index, markRequestFromServer = false) => {
        if (!socket.connected) return;

        if (!markRequestFromServer) {
            // if player marks a number then send it to other players.
            // if other player is marking a number then don't send the same to other players again
            socket.emit("mark", shuffledData[Math.floor(index / matrixDim)][index % matrixDim]);
        }

        setMarked((prev) => {
            if (index === 0) {
                return [1, ...prev.slice(1)];
            }
            if (index === prev.length - 1) {
                return [...prev.slice(0, index), 1];
            }
            return [
                ...prev.slice(0, index),
                1,
                ...prev.slice(index + 1, prev.length),
            ];
        });
    };

    return (
        <div className="flex flex-col">
            <div className="w-[300px] flex border border-gray-200 rounded-t-3xl box-border">
                {["B", "i", "n", "g", "o"].map((letter, index) => (
                    <div
                        key={`letter-${index}`}
                        className="w-[60px] h-[60px] flex items-center justify-center font-bold"
                    >
                        {letter.toUpperCase()}
                    </div>
                ))}
            </div>
            <div className="h-[300px] w-[300px] max-h-full max-w-full grid relative" style={{gridTemplateColumns: `repeat(${matrixDim || 5}, minmax(0, 1fr))`}}>
                {[...Array(matrixDim * matrixDim).keys()].map((_, index) => (
                    <div
                        key={`data-${index}`}
                        className={`relative cursor-pointer flex items-center justify-center border border-gray-200 select-none ${
                            marked[index] || !myTurn
                                ? "z-0"
                                : "hover:bg-slate-100"
                        }`}
                        onClick={() => {
                            if(!myTurn || marked[index]) return;

                            setLastChecked(index);
                            mark(index);
                        }}
                    >
                        {shuffledData?.at(Math.floor(index / matrixDim)).at(index % matrixDim)}
                        <div
                            className={`absolute left-0 top-0 h-[60px] w-[60px] flex justify-center text-5xl select-none z-20 transition-all duration-300 ease-in-out ${
                                marked[index] ? "opacity-100 hover:opacity-10" : " opacity-0"
                            }`}
                        >
                            x
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-[300px] mt-3 flex justify-evenly items-center">
                {gameStarted ? (
                    myTurn ? (
                        <span>Your Turn</span>
                    ) : (
                        <span>{turnMessage}</span>
                    )
                ) : !gameStarted && user.readyToStart ? (
                    <button
                        onClick={() => {
                            socket.emit("startGame");
                        }}
                        className="m-3 px-14 py-2 min-w-[120px] text-center text-white bg-violet-500 border border-violet-600 rounded-full active:text-violet-500 hover:bg-violet-600 focus:outline-none focus:ring"
                    >
                        Start
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() =>
                                resetMarked()
                            }
                            className="m-3"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => {
                                socket.emit("playerReadyToStart");
                            }}
                            className="m-3 px-6 py-2 min-w-[120px] text-center text-white bg-violet-500 border border-violet-600 rounded-full active:text-violet-500 hover:bg-violet-600 focus:outline-none focus:ring"
                        >
                            Ready
                        </button>
                        <button
                            onClick={() => setShuffledData(() => shuffle())}
                            className="m-3"
                        >
                            Shuffle
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BingoBoard;
