import { useEffect, useState } from "react";
import BingoBoard from "./components/bingo-board";
import { socket } from "./socket";

const App = () => {
    const [connected, setConnected] = useState(false);

    const onConnect = () => {
        setConnected(true);
    };

    const onMessage = (message) => {
        alert(message);
    };

    useEffect(() => {
        socket.on("connect", onConnect);
        socket.on("message", onMessage);
    }, []);

    return connected? (
        <div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
            <BingoBoard/>
        </div>
    ) : (
        <div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
            Connecting to the server...
        </div>
    );
};

export default App;
