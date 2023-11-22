
import { atom } from 'jotai';
import {
    EngineEnum,
    ProcessTypeEnum,
    PromptType,
} from "./enums";


export const notionSpaceIdAtom = atom("")
export const openAIAPIKeyAtom = atom("")
export const openAIAPIHostAtom = atom("")

export const engineAtom = atom<string>(EngineEnum.ChatGPTAPI)
export const processTypeAtom = atom(ProcessTypeEnum.Text)
export const selectedPromptAtom = atom<PromptType>(undefined)
export const selectedElementAtom = atom<HTMLElement>(undefined)
export const contextAtom = atom("")
export const promptAtom = atom("")
export const responseMessageAtom = atom("")
export const isLoadingAtom = atom(false)
export const isFullModeAtom = atom(false)
export const isShowToastAtom = atom(false)
export const notificationAtom = atom("")
export const isShowElementAtom = atom(false)
