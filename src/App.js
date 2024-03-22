import BingoBoard from "./components/bingo-board";

const App = () => {
    return (
        <div className="h-screen w-screen overflow-auto overflow-x-hidden flex justify-center items-center">
            <BingoBoard />
        </div>
    );
};

export default App;
