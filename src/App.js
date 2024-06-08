import { useEffect, useState } from "react";
import BingoBoard from "./components/bingo-board";
import { socket } from "./socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputModal from "./components/input-modal";

const App = () => {
    const [connected, setConnected] = useState(false);
    const [user, setUser] = useState(null);

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

    useEffect(() => {
      console.log(user)
    }, [user])
    

    return (
        <>
            {connected ? (
                <div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
                    {user !== null && <BingoBoard user={user} setUser={setUser}/>}
                    <InputModal setUser={setUser}/>
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
