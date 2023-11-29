import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
	isShowToastAtom,
	notificationAtom,
	responseMessageAtom,
	selectedElementAtom,
} from "~lib/state"
import { ClipboardCopy, Eraser } from "lucide-react"

export function ToolsComponent() {
	const [responseMessage, setResponseMessage] = useAtom(responseMessageAtom)
	const selection = useAtomValue(selectedElementAtom)
	const setIsShowToast = useSetAtom(isShowToastAtom)
	const setNotification = useSetAtom(notificationAtom)

	const handleToast = (message: string) => {
		setNotification(message)
		setIsShowToast(true)
	}

	const handleCopy = async () => {
		await navigator.clipboard.writeText(responseMessage)
		handleToast("Copied to clipboard")
	}

	const handleClear = () => {
		setResponseMessage("")
		handleToast("Cleared")
	}

	const handleInsertClick = () => {
		if (selection) {
			// selection.modify()
			//   selection.value = `${selection.value}\n\n${responseMessage}`
		}
	}

	const handleReplaceClick = () => {
		if (selection) {
			// selection.value = responseMessage
		}
	}

	const iconButton = (func: () => void, icon: JSX.Element, label: string) => {
		return (
			<button
				onClick={e => {
					e.preventDefault()
					func()
				}}
				className="flex flex-row items-center justify-between gap-1 p-1 bg-blue-200 rounded-lg"
			>
				<label className="text-sm">{label}</label>
				{icon}
			</button>
		)
	}
	if (responseMessage) {
		return (
			<div className="flex flex-row items-center justify-end w-full gap-2 pr-2 mb-1">
				{iconButton(handleCopy, <ClipboardCopy size={12} />, "Copy")}
				{iconButton(handleClear, <Eraser size={12} />, "Clear")}
				{/* {iconButton(
					handleInsertClick,
					<TextCursorInputIcon size={12} />
				)}
				{iconButton(handleReplaceClick, <Edit size={12} />)} */}
			</div>
		)
	}
	return <></>
}
