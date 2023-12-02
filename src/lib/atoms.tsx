import { atom, useSetAtom } from "jotai"
import { ConstEnum, EngineEnum, ProcessTypeEnum } from "./enums"

import { Storage } from "@plasmohq/storage"
import { useEffect } from "react"

export const storage = new Storage({
	area: "local",
})

export const DEFAULT_OPENAI_API_URL =
	"https://api.openai.com/v1/chat/completion"
export const DEFAULT_OPENAI_API_MODEL = "gpt-3.5-turbo"
export const DEFAULT_CHATGPT_MODEL = "text-davinci-002-render-sha"

export const engineAtom = atom<string>(EngineEnum.OpenAIAPI)
export const notionSpaceIdAtom = atom<string>("")
export const notionSpacesAtom = atom<string>("")
export const openAIAPIKeyAtom = atom<string>("")
export const openAIAPIHostAtom = atom<string>(DEFAULT_OPENAI_API_URL)
export const openAIAPIModelAtom = atom<string>(DEFAULT_OPENAI_API_MODEL)
export const chatGPTModelAtom = atom<string>(DEFAULT_CHATGPT_MODEL)
export const isEnableContextMenuAtom = atom(false)

export const processTypeAtom = atom(ProcessTypeEnum.Text)
export const selectedPromptAtom = atom("")
export const selectedElementAtom = atom<Selection | null>(null)
export const contextAtom = atom("")
export const promptAtom = atom("")
export const responseMessageAtom = atom("")
export const isLoadingAtom = atom(false)
export const isFullModeAtom = atom(false)
export const isShowToastAtom = atom(false)
export const notificationAtom = atom("")
export const isShowElementAtom = atom(false)
export const isShowContextAtom = atom(false)
export const isPinElementAtom = atom(false)
export const isShowIconAtom = atom(false)
export const queryTextAtom = atom("")

export const iconPositionAtom = atom<{ x: number; y: number } | null>(null)
export const elePositionAtom = atom<{ x: number | string; y: number | string }>(
	{ x: "50%", y: "50%" }
)
// iconPositionDirectionAtom is used to determine the direction of the icon
// https://tailwindcss.com/docs/position
export const iconPositionDirectionAtom = atom("")

export const InitAtomComponent = () => {
	const setEngine = useSetAtom(engineAtom)
	const setNotionSpaceId = useSetAtom(notionSpaceIdAtom)
	const setNotionSpaces = useSetAtom(notionSpacesAtom)
	const setOpenAIAPIKey = useSetAtom(openAIAPIKeyAtom)
	const setOpenAIAPIHost = useSetAtom(openAIAPIHostAtom)
	const setOpenAIAPIModel = useSetAtom(openAIAPIModelAtom)
	const setChatGPTModel = useSetAtom(chatGPTModelAtom)
	const setIsEnableContextMenu = useSetAtom(isEnableContextMenuAtom)

	useEffect(() => {
		const fetchAndSetData = async () => {
			const engine = await storage.get(ConstEnum.DEFAULT_ENGINE)
			if (engine) {
				setEngine(engine)
			}
			const openAIAPIKey = await storage.get(ConstEnum.OPENAI_API_KEY)
			if (openAIAPIKey) {
				setOpenAIAPIKey(openAIAPIKey)
			}
			const openAIAPIHost = await storage.get(ConstEnum.OPENAI_API_HOST)
			if (openAIAPIHost) {
				setOpenAIAPIHost(openAIAPIHost)
			}
			const openAIAPIModel = await storage.get(ConstEnum.OPENAI_API_MODEL)
			if (openAIAPIModel) {
				setOpenAIAPIModel(openAIAPIModel)
			}
			const notionSpaceId = await storage.get(ConstEnum.NOTION_SPACE_ID)
			if (notionSpaceId) {
				setNotionSpaceId(notionSpaceId)
			}
			const notionSpaces = await storage.get(ConstEnum.NOTION_SPACES)
			if (notionSpaces) {
				setNotionSpaces(notionSpaces)
			}
			const chatGPTModel = await storage.get(ConstEnum.CHATGPT_MODEL)
			if (chatGPTModel) {
				setChatGPTModel(chatGPTModel)
			}
			const isEnableContext = await storage.get(
				ConstEnum.IS_ENABLE_CONTEXT_MENU
			)
			setIsEnableContextMenu(isEnableContext == "true" ? true : false)
		}
		fetchAndSetData()
	}, [])
	return <></>
}
