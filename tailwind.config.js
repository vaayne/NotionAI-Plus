/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./src/**/*.{tsx,html}"],
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@headlessui/tailwindcss"),
	],
	theme: {
		extend: {
			colors: {
				primary: {
					100: "#007BFF", // 亮蓝色：用于主要按钮和链接，吸引注意力
					200: "#0056b3", // 深蓝色：适用于重要元素，增加对比度
					300: "#87CEEB", // 天蓝色：用于次要按钮和轻微高亮
				},
				complementary: {
					100: "#FFA500", // 橙色：与蓝色形成鲜明对比，用于特殊强调
					200: "#FFDAB9", // 淡桃色：较柔和，用于温和突出显示
				},
				neutral: {
					100: "#A9A9A9", // 中灰色：适用于文本和背景，提供平衡
					200: "#F8F8FF", // 接近白色：适用于背景，清新干净
				},
				accent: {
					100: "#008080", // 深绿宝石色：用于重要的次级元素
					200: "#98FF98", // 薄荷绿：用于生动突出的小元素
					300: "#E6E6FA", // 淡紫色：用于轻微强调和装饰
				},
				text: {
					100: "#FFFFFF", // 白色：用于深色背景上的文字
					200: "#333333", // 深灰色：用于浅色背景上的文字，提高可读性
				},
				background: {
					100: "#2B2B2B", // 深石板色：适用于深色背景
					200: "#F8F9FA", // 淡灰色：适用于浅色背景
					300: "#191970", // 深蓝色：用于丰富的深色背景选项
				},
				metallic: {
					100: "#C0C0C0", // 银色：增添现代感，适用于高级元素
				},
				earthy: {
					100: "#B2AC88", // 鼠尾草绿：自然柔和，与蓝色搭配良好
					200: "#C2B280", // 沙色：温暖的中性色，补充蓝色
				},
			},
		},
	},
}
