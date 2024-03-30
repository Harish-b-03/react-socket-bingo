import { useEffect, useState } from "react";
import BingoBoard from "./components/bingo-board";
import { socket } from "./socket";

const App = () => {
    const [connected, setConnected] = useState(false);
    const [shuffledData, setShuffledData] = useState(null);

    const onConnect = () => {
        setConnected(true);
    }

    const onMessage = (message) => {
        alert(message)
    }
    
    useEffect(() => {
      socket.on("connect", onConnect)
      socket.on("shuffleData", (data) => setShuffledData(data))
      socket.on("message", onMessage)
    }, [])
    

    return (connected && shuffledData?
        <div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
            <BingoBoard shuffledData={shuffledData}/>
        </div>
        :
        <div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
            Connecting to the server...
        </div>
    );
};

export default App;
