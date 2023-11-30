import cssText from "data-text:~style.css"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import Draggable from "react-draggable"
import { useMessage } from "@plasmohq/messaging/hook"
import {
	contextAtom,
	isShowElementAtom,
	isShowIconAtom,
	isShowToastAtom,
	notificationAtom,
	selectedElementAtom,
} from "~/lib/state"
import ComboxComponent from "~components/combobox"
import DropdownMenuComponent from "~components/dropdown"
import NotificationComponent from "~components/notification"
import { OutputComponent } from "~components/output"
import { ToolsComponent } from "~components/tools"
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
	const [screenWidth, setScreenWidth] = useState(window.innerWidth)
	const setContext = useSetAtom(contextAtom)
	const [isShowElement, setIsShowElement] = useAtom(isShowElementAtom)
	const [isShowIcon, setIsShowIcon] = useAtom(isShowIconAtom)
	const notification = useAtomValue(notificationAtom)
	const setSelectedElement = useSetAtom(selectedElementAtom)
	const [isShowToast, setIsShowToast] = useAtom(isShowToastAtom)
	const [iconPosition, setIconPosition] = useAtom(positionAtom)

	// when press ESC will hidden the  window
	const handleEscape = (event: any) => {
		if (event.key === "Escape") {
			setIsShowElement(false)
			setIconPosition(null)
			setIsShowIcon(false)
		}
		// const shadowRoot = document.querySelector("plasmo-csui")?.shadowRoot;
		// if (shadowRoot?.activeElement?.id == "notionai-plus-context") {
		// 	if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
		// 		event.preventDefault();
		// 	}
		// }
	}

	const handleMouseUp = event => {
		// do not update on shadowRoot
		const shadowRoot = document.querySelector("plasmo-csui")?.shadowRoot
		if (shadowRoot?.activeElement != null) {
			return
		}
		const selection = window.getSelection()
		if (selection && selection.rangeCount > 0) {
			const rect = selection
				.getRangeAt(0)
				.cloneRange()
				?.getBoundingClientRect()
			// console.log(
			// 	`x: ${rect.x}, y: ${rect.y}, w: ${rect.width}, h: ${rect.height}`
			// )
			if (rect?.width > 10 && rect?.height > 10) {
				// console.log("set icon position")
				setIconPosition({
					x: rect.right,
					y: rect.bottom + 5,
				})
				setSelectedElement(selection)
				setContext(selection.toString())
				setIsShowIcon(true)
				setIsShowElement(false)
			} else {
				// console.log("hidden icon")
				setIsShowIcon(false)
			}
		}
	}

	// init on page load
	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth)
		}

		window.addEventListener("resize", handleResize)

		document.addEventListener("keydown", handleEscape)
		document.addEventListener("mouseup", handleMouseUp)
		return () => {
			document.removeEventListener("keydown", handleEscape)
			document.removeEventListener("mouseup", handleMouseUp)
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	useMessage<string, string>(async (req, res) => {
		console.log(`plasmo message: ${JSON.stringify(req)}`)
		if (req.name === "activate") {
			setIsShowElement(true)
		}
	})

	return (
		<>
			{isShowElement && (
				<Draggable handle=".draggable" cancel=".non-draggable">
					<div
						id="notionai-plus"
						className="flex flex-col justify-between rounded-lg draggable min-w-48 bg-slate-200"
						style={{
							position: "fixed",
							top: iconPosition?.y || "50%",
							left: Math.max(
								(iconPosition?.x || screenWidth) - 210,
								10
							),
						}}
					>
						<ComboxComponent />
						<OutputComponent />
						<ToolsComponent />
					</div>
				</Draggable>
			)}
			{iconPosition && isShowIcon && !isShowElement && (
				<Draggable handle="#notionai-plus-dropdown-menu">
					<div
						id="notionai-plus-dropdown-menu"
						className="fixed p-1 rounded-md bg-slate-200 top-16"
						style={{
							position: "fixed",
							top: iconPosition.y,
							left: Math.max(
								(iconPosition?.x || screenWidth) - 128,
								10
							),
						}}
					>
						<DropdownMenuComponent />
					</div>
				</Draggable>
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
