import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
	ChevronDown,
	ChevronUp,
	Send,
	Settings,
	StopCircle,
	X,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
	contextAtom,
	engineAtom,
	isLoadingAtom,
	isShowElementAtom,
	isShowIconAtom,
	isShowToastAtom,
	notificationAtom,
	notionSpaceIdAtom,
	openAIAPIHostAtom,
	openAIAPIKeyAtom,
	processTypeAtom,
	promptAtom,
	responseMessageAtom,
	selectedPromptAtom,
} from "~/lib/state"
import { PromptTypeEnum } from "~lib/enums"
import ContextMenuComponent from "./context_menu"
import { streamPort } from "~lib/runtime"
import browser from "webextension-polyfill"

export default function ComboxComponent() {
	const notionSpaceId = useAtomValue(notionSpaceIdAtom)
	const openAIAPIKey = useAtomValue(openAIAPIKeyAtom)
	const openAIAPIHost = useAtomValue(openAIAPIHostAtom)
	const engine = useAtomValue(engineAtom)
	const selectedPrompt = useAtomValue(selectedPromptAtom)
	const [context, setContext] = useAtom(contextAtom)
	const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
	const setIsShowToast = useSetAtom(isShowToastAtom)
	const setNotification = useSetAtom(notificationAtom)
	const setPrompt = useSetAtom(promptAtom)
	const setResponseMessage = useSetAtom(responseMessageAtom)
	const processType = useAtomValue(processTypeAtom)
	const [isShowContext, setIsShowContext] = useState(false)
	const setIsShowElement = useSetAtom(isShowElementAtom)
	// const [isPinElement, setIsPinElement] = useAtom(isPinElementAtom)
	const setIsShowIcon = useSetAtom(isShowIconAtom)

	const handleToast = (message: string) => {
		setNotification(message)
		setIsShowToast(true)
	}

	useEffect(() => {
		if (selectedPrompt && context) {
			handleMessage(false)
		}
	}, [selectedPrompt])

	const handleMessage = async (fouce: boolean) => {
		if (!engine) {
			handleToast("Please select an engine")
			return
		}
		if (!context) {
			handleToast("Please input context")
			return
		}
		if (isLoading) {
			handleToast("AI is processing, please wait")
			return
		}

		if (!fouce && selectedPrompt == PromptTypeEnum.AskAI.toString()) {
			setIsShowContext(true)
			return
		}

		setIsLoading(true)
		setIsShowContext(false)

		let lprompt: string = ""
		let language: string = ""
		let tone: string = ""

		const prompts = selectedPrompt.split("-")
		let promptType = prompts[0]
		if (promptType === PromptTypeEnum.Translate) {
			language = prompts[1]
		} else if (promptType === PromptTypeEnum.ChangeTone) {
			tone = prompts[1]
		} else if (promptType === PromptTypeEnum.TopicWriting) {
			setPrompt(prompts[1])
			lprompt = prompts[1]
		} else if (promptType === PromptTypeEnum.AskAI) {
			lprompt = PromptTypeEnum.AskAI
		}

		setResponseMessage("Waitting for AI response ...")

		const body = {
			engine: engine,
			processType: processType,
			builtinPrompt: promptType,
			customPromot: lprompt,
			context: context,
			language: language,
			tone: tone,
			notionSpaceId: notionSpaceId,
			chatGPTAPIKey: openAIAPIKey,
			chatGPTAPIHost: openAIAPIHost,
		}

		console.log(body)

		streamPort.postMessage(body)
	}

	return (
		<div className="relative flex flex-col m-2">
			<div className="flex flex-row items-center justify-between gap-4">
				<ContextMenuComponent />
				<div className="flex flex-row items-center gap-1">
					<button
						className="p-1 bg-blue-200 rounded-lg"
						onClick={() => setIsShowContext(!isShowContext)}
					>
						{isShowContext ? (
							<ChevronUp size={12} />
						) : (
							<ChevronDown size={12} />
						)}
					</button>
					{isLoading ? (
						<button
							onClick={() => setIsLoading(false)}
							className="p-1 bg-blue-200 rounded-lg"
						>
							<StopCircle size={12} className="animate-spin" />
						</button>
					) : (
						<button
							onClick={() => handleMessage(true)}
							className="p-1 bg-blue-200 rounded-lg"
						>
							<Send size={12} />
						</button>
					)}
					<button
						onClick={() => {
							browser.runtime.sendMessage({
								action: "openOptionsPage",
							})
						}}
						className="p-1 bg-blue-200 rounded-lg"
					>
						<Settings size={12} />
					</button>
					<button
						onClick={() => {
							setIsShowElement(false)
							setIsShowIcon(false)
						}}
						className="p-1 bg-blue-200 rounded-lg"
					>
						<X size={12} />
					</button>
				</div>
			</div>

			{isShowContext && (
				<textarea
					id="notionai-plus-context"
					className="w-full mt-2 text-sm rounded-lg non-draggable"
					value={context}
					onChange={e => {
						setContext(e.target.value)
					}}
				></textarea>
			)}
		</div>
	)
}
