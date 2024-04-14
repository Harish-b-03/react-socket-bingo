import { useEffect, useState } from "react";
import BingoBoard from "./components/bingo-board";
import { socket } from "./socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const [connected, setConnected] = useState(false);

    const onConnect = () => {
        setConnected(true);
    };

    const onMessage = (message) => {
        toast(message);
    };

    useEffect(() => {
        socket.on("connect", onConnect);
        socket.on("message", onMessage);

        return () => {
            socket.off("connect");
            socket.off("message");
        };
    }, []);

    return (
        <>
            {connected ? (
                <div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
                    <BingoBoard />
                </div>
            ) : (
                <div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
                    Connecting to the server...
                </div>
            )}
            <ToastContainer />
        </>
    );
};

export default App;
