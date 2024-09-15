import Home from "./Home";
import { GameStateProvider } from "./contexts/game-context";
import UserProvider from "./contexts/user-context";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isMobile } from "react-device-detect";
const App = () => {
	return (
		<UserProvider>
			<GameStateProvider>
				<Home />
				<ToastContainer
					position={isMobile ? "bottom-center" : "top-right"}
					autoClose={2000}
					pauseOnFocusLoss={false}
					transition={Slide}
					stacked
					style={{ transform: isMobile ? "scale(0.75)" : "" }}
					draggablePercent={60}
				/>
			</GameStateProvider>
		</UserProvider>
	);
};

export default App;
