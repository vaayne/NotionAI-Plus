import { atom } from "jotai"
import { ConstEnum, EngineEnum, ProcessTypeEnum, PromptType } from "./enums"
// import { storage } from "~lib/storage"

import { Storage } from "@plasmohq/storage"

export const storage = new Storage({
	area: "local",
})

const engine = async () => await storage.get(ConstEnum.DEFAULT_ENGINE)
const openAIAPIKey = async () => await storage.get(ConstEnum.OPENAI_API_KEY)
const openAIAPIHost = async () => await storage.get(ConstEnum.OPENAI_API_HOST)
const openAIAPIModel = async () => await storage.get(ConstEnum.OPENAI_API_MODEL)
const notionSpaceId = async () => await storage.get(ConstEnum.NOTION_SPACE_ID)
const notionSpaces = async () => await storage.get(ConstEnum.NOTION_SPACES)
const chatGPTModel = async () => await storage.get(ConstEnum.CHATGPT_MODEL)

export const engineAtom = atom(engine())
export const notionSpaceIdAtom = atom(notionSpaceId())
export const notionSpacesAtom = atom(notionSpaces())
export const openAIAPIKeyAtom = atom(openAIAPIKey())
export const openAIAPIHostAtom = atom(openAIAPIHost())
export const openAIAPIModelAtom = atom(openAIAPIModel())
export const chatGPTModelAtom = atom(chatGPTModel())

export const processTypeAtom = atom(ProcessTypeEnum.Text)
export const selectedPromptAtom = atom<PromptType>(null)
export const selectedElementAtom = atom<HTMLElement>(null)
export const contextAtom = atom("")
export const promptAtom = atom("")
export const responseMessageAtom = atom("")
export const isLoadingAtom = atom(false)
export const isFullModeAtom = atom(false)
export const isShowToastAtom = atom(false)
export const notificationAtom = atom("")
export const isShowElementAtom = atom(false)
