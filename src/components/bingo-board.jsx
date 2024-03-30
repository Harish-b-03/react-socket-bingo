import { useEffect, useState } from "react";

const BingoBoard = () => {
    const data = [...Array(26).keys()].slice(1);
    const shuffle = (array) => {
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
    const [shuffledData, setShuffledData] = useState(shuffle(data));
    const [marked, setMarked] = useState([...Array(25).keys()].fill(0));
    const [lastChecked, setLastChecked] = useState(null);

    const checkIfWon = (index) => {
        let mod = index % 5;
        let sum;

        // col sum
        sum = 0;
        for (let i = 0; i < 5; i++) {
            sum += marked.at(i * 5 + mod - 1); // index - 1
        }
        if (sum === 5) {
            alert("won - col");
            return true;
        }

        // row sum
        let div = Math.floor((index - 1) / 5);
        sum = 0;
        for (let i = div * 5; i < (div + 1) * 5; i++) {
            sum += marked.at(i);
        }
        if (sum === 5) {
            alert("won - row");
            return true;
        }

        // main diagonal sum
        sum = 0;
        for(let i=0; i<5;i++){
            sum += marked.at(i*5+i);
        }
        if (sum === 5) {
            alert("won - main diagonal");
            return true;
        }

        // 2nd diagonal sum
        sum = 0;
        for(let i=1; i<=5;i++){
            sum += marked.at(i*4);
        }
        if (sum === 5) {
            alert("won - 2nd diagonal");
            return true;
        }
    };

    useEffect(() => {
        if(lastChecked === null) return;
        
        checkIfWon(lastChecked);
    }, [marked]);

    const mark = (index) => {
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
            <div className="h-[300px] w-[300px] max-h-full max-w-full grid grid-cols-5 relative">
                {[...Array(25).keys()].map((_, index) => (
                    <div
                        key={`data-${index}`}
                        className={`relative cursor-pointer flex items-center justify-center border border-gray-200 ${
                            marked[index]
                                ? "z-0 pointer-events-none"
                                : "hover:bg-slate-100"
                        }`}
                        onClick={() => {
                            setLastChecked(index + 1);
                            mark(index);
                        }}
                    >
                        {shuffledData?.at(Math.floor(index / 5)).at(index % 5)}
                        <div
                            className={`absolute left-0 top-0 h-[60px] w-[60px] flex justify-center text-5xl pointer-events-none z-20 transition-all duration-300 ease-in-out ${
                                marked[index] ? "opacity-100" : " opacity-0"
                            }`}
                        >
                            x
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => setMarked([...Array(25).keys()].fill(0))}
                className="m-3"
            >
                Reset
            </button>
        </div>
    );
};

export default BingoBoard;
