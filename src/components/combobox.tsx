import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { ChevronDown, ChevronUp, Send, StopCircle } from "lucide-react"
import { useEffect, useState } from "react"
import {
	contextAtom,
	engineAtom,
	isLoadingAtom,
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
import {
	LanguageOptions,
	PromptType,
	PromptTypeEnum,
	PromptTypeOptions,
	ToneOptions,
	TopicOptions,
} from "~lib/enums"
import ContextMenuComponent from "./context_menu"
import { streamPort } from "~lib/port"

export const Options: PromptType[] = [
	...PromptTypeOptions.filter(option => {
		return (
			option.value !== PromptTypeEnum.ChangeTone &&
			option.value !== PromptTypeEnum.Translate &&
			option.value !== PromptTypeEnum.TopicWriting
		)
	}),
	...ToneOptions.map(option => {
		option.label = `🎭 Change Tone - ${option.label}`
		return option
	}),
	...TopicOptions.map(option => {
		option.label = `📝 Topic - ${option.label}`
		return option
	}),
	...LanguageOptions.map(option => {
		option.label = `🌐 Translate - ${option.label}`
		return option
	}),
]

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

	const handleToast = (message: string) => {
		setNotification(message)
		setIsShowToast(true)
	}

	useEffect(() => {
		if (selectedPrompt && context) {
			handleMessage()
		}
	}, [selectedPrompt])

	const handleMessage = async () => {
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
		setIsLoading(true)

		let lprompt: string = ""
		let language: string = ""
		let tone: string = ""

		const prompts = selectedPrompt?.value.split("-")
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
		streamPort.postMessage(body)
	}

	return (
		<div className="relative flex flex-col m-2">
			<div
				className="flex flex-row items-center justify-center gap-2"
				id="dragable"
			>
				<ContextMenuComponent />
				<button
					className="p-1 bg-blue-200 rounded-lg"
					onClick={() => setIsShowContext(!isShowContext)}
				>
					{isShowContext ? (
						<ChevronUp size={18} />
					) : (
						<ChevronDown size={18} />
					)}
				</button>
				{isLoading ? (
					<button
						onClick={() => setIsLoading(false)}
						className="p-1 bg-blue-200 rounded-lg"
					>
						<StopCircle size={18} className="animate-spin" />
					</button>
				) : (
					<button
						onClick={handleMessage}
						className="p-1 bg-blue-200 rounded-lg"
					>
						<Send size={18} />
					</button>
				)}
			</div>

			{isShowContext && (
				<textarea
					className="w-full mt-2 rounded-lg"
					value={context}
					onChange={e => setContext(e.target.value)}
				></textarea>
			)}
		</div>
	)
}
