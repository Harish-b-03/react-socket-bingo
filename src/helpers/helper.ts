export const shuffle = () => {
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