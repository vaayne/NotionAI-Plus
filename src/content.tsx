import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import Draggable from "react-draggable"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import {
	contextAtom,
	isLoadingAtom,
	isShowElementAtom,
	isShowToastAtom,
	notificationAtom,
	responseMessageAtom,
	selectedElementAtom,
} from "~/lib/state"
import ComboxComponent from "~components/combobox"
import NotificationComponent from "~components/notification"
import { OutputComponent } from "~components/output"
import ContextMenuComponent from "~components/context_menu"
import { streamPort } from "~lib/port"

export const config: PlasmoCSConfig = {
	matches: ["<all_urls>"],
	all_frames: false,
}

export const getStyle = () => {
	const style = document.createElement("style")
	style.textContent = cssText
	return style
}

const positionAtom = atom<{ x: number; y: number } | null>(null)

const Index = () => {
	const setContext = useSetAtom(contextAtom)
	const setResponseMessage = useSetAtom(responseMessageAtom)
	const setIsLoading = useSetAtom(isLoadingAtom)
	const [isShowElement, setIsShowElement] = useAtom(isShowElementAtom)
	const notification = useAtomValue(notificationAtom)
	const setSelectedElement = useSetAtom(selectedElementAtom)
	const [isShowToast, setIsShowToast] = useAtom(isShowToastAtom)
	const [iconPosition, setIconPosition] = useAtom(positionAtom)

	// when press ESC will hidden the  window
	const handleEscape = (event: any) => {
		if (event.key === "Escape") {
			setIsShowElement(false)
			setIconPosition(null)
		}
	}

	streamPort.onMessage.addListener(function (msg) {
		if (msg === "[DONE]") {
			setIsLoading(false)
		} else {
			setResponseMessage(msg)
		}
	})

	const handleMouseUp = () => {
		const selection = window.getSelection()
		if (selection && selection.rangeCount > 0) {
			const rect = selection
				.getRangeAt(0)
				.cloneRange()
				?.getBoundingClientRect()
			if (rect?.width > 0 && rect?.height > 0) {
				setIconPosition({
					x: rect.right + 5,
					y: rect.bottom + 5,
				})
				setSelectedElement(selection)
				setContext(selection.toString())
			} // setIconPosition(null)
		}
	}

	// init on page load
	useEffect(() => {
		document.addEventListener("keydown", handleEscape)
		document.addEventListener("mouseup", handleMouseUp)
		return () => {
			document.removeEventListener("keydown", handleEscape)
			document.removeEventListener("mouseup", handleMouseUp)
		}
	}, [])

	return (
		<>
			{isShowElement && (
				<Draggable handle="#dragable">
					<div
						id="notionai-plus"
						className={`flex flex-col rounded-lg w-96 bg-slate-200 justify-between`}
						style={{
							position: "fixed",
							top: iconPosition?.y || "33.33%",
							left: iconPosition?.x || "33.33",
						}}
					>
						<ComboxComponent />
						<OutputComponent />
					</div>
				</Draggable>
			)}
			{iconPosition && !isShowElement && (
				<div
					className="fixed p-1 bg-gray-200 rounded-md top-16 w-72"
					style={{
						position: "fixed",
						top: iconPosition.y,
						left: iconPosition.x,
					}}
				>
					<ContextMenuComponent />
				</div>
			)}
			<NotificationComponent
				isShow={isShowToast}
				setIsShow={setIsShowToast}
				title={notification}
			/>
		</>
	)
}

export default Index
