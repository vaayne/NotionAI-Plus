import { ClipboardCopy, Edit, Eraser, TextCursorInputIcon } from "lucide-react"
import { useContext } from "react"

import { ToolbarContext } from "~lib/context"

export default function DividerComponent() {
	const { handleClear, handleCopy, handleInsertClick, handleReplaceClick } =
		useContext(ToolbarContext)

	const toolIcon = (
		icon: JSX.Element,
		label: string,
		onClick: () => void
	) => {
		return (
			<button
				type="button"
				onClick={onClick}
				className="relative inline-flex items-center px-2 py-1 text-sm font-medium text-gray-400 bg-indigo-200 border border-gray-300 hover:bg-indigo-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				<div className="flex flex-col items-center justify-between w-8 h-8 space-y-1">
					{icon}
					<label
						htmlFor="location"
						className="block text-xs font-medium text-gray-700"
					>
						{label}
					</label>
				</div>
			</button>
		)
	}
	return (
		<div className="relative">
			<div
				className="absolute inset-0 flex items-center"
				aria-hidden="true"
			>
				<div className="w-full border-t border-gray-300" />
			</div>
			<div className="relative flex justify-center">
				<span className="inline-flex -space-x-px rounded-md shadow-sm isolate">
					{toolIcon(<Eraser size={16} />, "Eraser", handleClear)}
					{toolIcon(<ClipboardCopy size={16} />, "Copy", handleCopy)}
					{toolIcon(
						<TextCursorInputIcon size={16} />,
						"Insert",
						handleInsertClick
					)}
					{toolIcon(
						<Edit size={16} />,
						"Replace",
						handleReplaceClick
					)}
				</span>
			</div>
		</div>
	)
}
