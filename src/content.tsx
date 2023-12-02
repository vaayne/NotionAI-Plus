import cssText from "data-text:~style.css"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import Draggable from "react-draggable"
import { useMessage } from "@plasmohq/messaging/hook"
import {
	InitAtomComponent,
	contextAtom,
	isShowElementAtom,
	isShowIconAtom,
	isShowToastAtom,
	notificationAtom,
	iconPositionAtom,
	selectedElementAtom,
	iconPositionDirectionAtom,
	elePositionAtom,
	selectedPromptAtom,
	isEnableContextMenuAtom,
} from "~lib/atoms"
import ComboxComponent from "~components/combobox"
import DropdownMenuComponent from "~components/dropdown"
import NotificationComponent from "~components/notification"
import { OutputComponent } from "~components/output"
import { ToolsComponent } from "~components/tools"
import { PromptTypeEnum } from "~lib/enums"
export const config: PlasmoCSConfig = {
	matches: ["<all_urls>"],
	all_frames: false,
}

export const getStyle = () => {
	const style = document.createElement("style")
	style.textContent = cssText
	return style
}

const Index = () => {
	const setContext = useSetAtom(contextAtom)
	const [isShowElement, setIsShowElement] = useAtom(isShowElementAtom)
	const [isShowIcon, setIsShowIcon] = useAtom(isShowIconAtom)
	const notification = useAtomValue(notificationAtom)
	const setSelectedElement = useSetAtom(selectedElementAtom)
	const setSelectedPrompt = useSetAtom(selectedPromptAtom)
	const [isShowToast, setIsShowToast] = useAtom(isShowToastAtom)
	const [iconPosition, setIconPosition] = useAtom(iconPositionAtom)
	const [elePosition, setElePosition] = useAtom(elePositionAtom)
	const setIconPositionDirection = useSetAtom(iconPositionDirectionAtom)
	const isEnableContextMenu = useAtomValue(isEnableContextMenuAtom)
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
	// Define a function to handle mouse up events
	const handleMouseUp = event => {
		// Do not update if the event is triggered from a shadowRoot
		const shadowRoot = document.querySelector("plasmo-csui")?.shadowRoot
		if (shadowRoot?.activeElement != null) {
			return
		}
		// Get the current selection
		const selection = window.getSelection()
		// If there is a selection and it has at least one range
		if (selection && selection.rangeCount > 0) {
			// Get the bounding rectangle of the first range in the selection
			const rect = selection
				.getRangeAt(0)
				.cloneRange()
				?.getBoundingClientRect()
			// If the rectangle has a width and height greater than 10
			if (rect?.width > 10 && rect?.height > 10) {
				// Get the right and bottom coordinates of the rectangle
				let x = rect.right
				let y = rect.bottom

				// If the x coordinate is too close to the right edge of the window, adjust it and set the icon position direction
				if (x > window.innerWidth - 128) {
					x = window.innerWidth - 128
					setIconPositionDirection("right-full")
				}
				// If the x coordinate is too close to the left edge of the window, adjust it and set the icon position direction
				else if (x < 128) {
					setIconPositionDirection("left-full")
				}

				// If the y coordinate is too close to the bottom edge of the window, adjust it and set the icon position direction
				if (y > window.innerHeight - 128) {
					y = Math.min(y, window.innerHeight - 64)
					setIconPositionDirection("bottom-full")
				}
				// If the y coordinate is too close to the top edge of the window, adjust it and set the icon position direction
				else if (y < 128) {
					setIconPositionDirection("top-full")
				}
				// Set the icon position
				setIconPosition({
					x: x,
					y: y,
				})
				// Set the element position
				setElePosition({
					x: Math.min(x, window.innerWidth - 384),
					y: Math.min(y, window.innerHeight - 412),
				})
				// Set the selected element
				setSelectedElement(selection)
				// Set the context to the selected text
				setContext(selection.toString())
				// Show the icon
				setIsShowIcon(true)
				// Hide the element
				setIsShowElement(false)
			} else {
				// If the rectangle is too small, hide the icon
				setIsShowIcon(false)
			}
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

	useMessage<string, string>(async (req, res) => {
		if (req.name === "activate") {
			setIsShowElement(true)
		}
		if (req.name === "activate-with-selection") {
			const body = JSON.parse(req.body?.toString() || "{}")
			setContext(body.text)
			setIsShowElement(true)
			if (body.prompt == "notionai-plus") {
				setSelectedPrompt(PromptTypeEnum.AskAI.toString())
			} else {
				setSelectedPrompt(body.prompt)
			}
		}
	})

	return (
		<>
			<InitAtomComponent />
			{isShowElement && (
				<Draggable handle=".draggable" cancel=".non-draggable">
					<div
						id="notionai-plus"
						className="flex-col justify-between rounded-lg draggable min-w-48 bg-slate-200"
						style={{
							position: "fixed",
							top: elePosition.y,
							left: elePosition.x,
						}}
					>
						<ComboxComponent />
						<OutputComponent />
						<ToolsComponent />
					</div>
				</Draggable>
			)}
			{isEnableContextMenu &&
				iconPosition &&
				isShowIcon &&
				!isShowElement && (
					<Draggable handle="#notionai-plus-dropdown-menu">
						<div
							id="notionai-plus-dropdown-menu"
							className={`p-1 rounded-md bg-slate-200`}
							style={{
								position: "fixed",
								top: iconPosition.y,
								left: iconPosition.x,
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
