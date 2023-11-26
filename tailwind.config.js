/** @type {import('tailwindcss').Config} */

const colorScale = 12
const radixColors = [
	"tomato",
	"red",
	"ruby",
	"crimson",
	"pink",
	"plum",
	"purple",
	"violet",
	"iris",
	"indigo",
	"blue",
	"cyan",
	"teal",
	"jade",
	"green",
	"grass",
	"bronze",
	"gold",
	"brown",
	"orange",
	"amber",
	"yellow",
	"lime",
	"mint",
	"sky",
]

const radixGrayColors = ["gray", "mauve", "slate", "sage", "olive", "sand"]

const getColor = (color, scale, alpha) => {
	const colors = Array.from(Array(scale).keys()).reduce((acc, _, i) => {
		acc[i + 1] = `var(--${color}-${alpha ? "a" : ""}${i + 1})`
		return acc
	}, {})
	if (!alpha) {
		colors[`9-contrast`] = `var(--${color}-9-contrast)`
		colors["surface"] = `var(--${color}-surface)`
	}

	return colors
}

const getGrayColor = (color, scale, alpha) => {
	const colors = Array.from(Array(scale).keys()).reduce((acc, _, i) => {
		acc[i + 1] = `var(--${color}-${alpha ? "a" : ""}${i + 1})`
		return acc
	}, {})
	if (!alpha) colors[`2-translucent`] = `var(--${color}-2-translucent)`

	return colors
}

const getColors = (arr, isGray) => {
	const colors = arr.reduce((acc, color) => {
		acc[color] = isGray
			? getGrayColor(color, colorScale, false)
			: getColor(color, colorScale, false)
		return acc
	}, {})

	const alphaColors = arr.reduce((acc, color) => {
		acc[color + "A"] = isGray
			? getGrayColor(color, colorScale, true)
			: getColor(color, colorScale, true)
		return acc
	}, {})
	return { ...colors, ...alphaColors }
}

module.exports = {
	content: ["./src/**/*.{tsx,html}"],
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@headlessui/tailwindcss"),
	],
	theme: {
		colors: {
			accent: getColor("accent", colorScale),
			...getColors(radixGrayColors, true),
			gray: getGrayColor("gray", colorScale),
			...getColors(radixColors),
			overlay: "var(--color-overlay)",
			"panel-solid": "var(--color-panel-solid)",
			"panel-translucent": "var(--color-panel-translucent)",
			surface: "var(--color-surface)",
			panel: "var(--color-panel)",
			transparent: "transparent",
		},
		borderRadius: {
			1: "var(--radius-1)",
			2: "var(--radius-2)",
			3: "var(--radius-3)",
			4: "var(--radius-4)",
			5: "var(--radius-5)",
			6: "var(--radius-6)",
			item: "max(var(--radius-2),var(--radius-full))",
		},
		boxShadow: {
			1: "var(--shadow-1)",
			2: "var(--shadow-2)",
			3: "var(--shadow-3)",
			4: "var(--shadow-4)",
			5: "var(--shadow-5)",
			6: "var(--shadow-6)",
		},
		screens: {
			xs: "520px",
			sm: "768px",
			md: "1024px",
			lg: "1280px",
			xl: "1640px",
		},

		fontSize: {
			1: "var(--font-size-1)",
			2: "var(--font-size-2)",
			3: "var(--font-size-3)",
			4: "var(--font-size-4)",
			5: "var(--font-size-5)",
			6: "var(--font-size-6)",
			7: "var(--font-size-7)",
			8: "var(--font-size-8)",
			9: "var(--font-size-9)",
		},
		fontWeight: {
			light: "300",
			regular: "400",
			medium: "500",
			bold: "700",
			DEFAULT: "400",
		},
		lineHeight: {
			1: "var(--line-height-1)",
			2: "var(--line-height-2)",
			3: "var(--line-height-3)",
			4: "var(--line-height-4)",
			5: "var(--line-height-5)",
			6: "var(--line-height-6)",
			7: "var(--line-height-7)",
			8: "var(--line-height-8)",
			9: "var(--line-height-9)",
		},
		letterSpacing: {
			1: "var(--letter-spacing-1)",
			2: "var(--letter-spacing-2)",
			3: "var(--letter-spacing-3)",
			4: "var(--letter-spacing-4)",
			5: "var(--letter-spacing-5)",
			6: "var(--letter-spacing-6)",
			7: "var(--letter-spacing-7)",
			8: "var(--letter-spacing-8)",
			9: "var(--letter-spacing-9)",
		},
		extend: {
			spacing: {
				"rx-1": "var(--space-1)",
				"rx-2": "var(--space-2)",
				"rx-3": "var(--space-3)",
				"rx-4": "var(--space-4)",
				"rx-5": "var(--space-5)",
				"rx-6": "var(--space-6)",
				"rx-7": "var(--space-7)",
				"rx-8": "var(--space-8)",
				"rx-9": "var(--space-9)",
			},
		},
	},
}
