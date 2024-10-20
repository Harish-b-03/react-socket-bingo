import { useGameContext } from "../contexts/game-context";
import { aboutContent } from "../helpers/about-content";

interface IStyledContent {
	content: string;
}
const StyledContent: React.FC<IStyledContent> = ({ content }) => {
	if (!content.includes("**")) {
		return <span>{content}</span>;
	}
	return (
		<span>
			{content.split("**").map((text, key) => (
				<span key={key} className={`${key % 2 && "font-bold"}`}>
					{text}
				</span>
			))}
		</span>
	);
};

const About = () => {
	const { showAboutContent, updateShowAboutContent } = useGameContext();

	return (
		<div
			className={`${
				showAboutContent ? "opacity-100" : "opacity-0 pointer-events-none"
			} overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 flex justify-center items-center w-full text-black md:inset-0 h-full`}
		>
			<div
				className="w-[500px] h-[500px] max-w-full max-h-full flex flex-col justify-start items-center gap-3 text-justify py-8 overflow-hidden rounded-md"
				style={{
					boxShadow: "var(--box-shadow)",
					backdropFilter: "blur(40px)",
					borderRadius: "20px",
				}}
			>
				<span className="text-2xl font-bold">Welcome to School Bingo!</span>
				<div className="w-full h-full px-8 flex flex-col justify-start items-center gap-3 overflow-y-auto ">
					{aboutContent.map((content, idx) => (
						<StyledContent key={idx} content={content} />
					))}
				</div>
				<button
					className="px-3 py-2 bg-violet-500 text-white rounded-lg outline-none hover:bg-violet-700"
					onClick={() => {
						updateShowAboutContent(false);
					}}
				>
					Back to game
				</button>
			</div>
		</div>
	);
};

export default About;
