/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx}"],
	theme: {
		extend: {
			keyframes: {
				boardWinKeyframe: {
					"60%": {
						transform: "scaleY(.9)",
					},
					"100%": {
						transform: "scaleY(1)",
					},
				},
				winMessageKeyframe: {
					"0%": {
						transform: "translate(-50%, -50%) scale(1)",
					},
					"50%": {
						transform: "translate(-50%, -50%) scale(1.05)",
					},
					"100%": {
						transform: "translate(-50%, -50%) scale(1)",
					},
				},
			},
			animation: {
				boardWinAnimation: "boardWinKeyframe .5s ease forwards",
				winMessageAnimation: "winMessageKeyframe .5s ease forwards",
			},
		},
	},
	plugins: [],
	future: {
		hoverOnlyWhenSupported: true,
	},
};
