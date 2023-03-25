import { Dispatch, SetStateAction, createContext } from "react"

import type { PromptType } from "./enums"

interface InputContextProps {
  engine: string
  setEngine: Dispatch<SetStateAction<string>>

  isFullMode: boolean
  setIsFullMode: Dispatch<SetStateAction<boolean>>

  //   processType: string
  //   setProcessType: Dispatch<SetStateAction<string>>

  selectedPrompt: PromptType
  setSelectedPrompt: Dispatch<SetStateAction<PromptType>>

  context: string
  setContext: Dispatch<SetStateAction<string>>

  prompt: string
  setPrompt: Dispatch<SetStateAction<string>>
  isLoading: boolean

  handleMessage: () => void
}

export const InputContext = createContext({} as InputContextProps)

interface ToolbarContextProps {
  handleClear: () => void
  handleCopy: () => void
  handleInsertClick: () => void
  handleReplaceClick: () => void
}

export const ToolbarContext = createContext({} as ToolbarContextProps)

interface OutputContextProps {
  isFullMode: boolean
  responseMessage: string
}

export const OutputContext = createContext({} as OutputContextProps)
