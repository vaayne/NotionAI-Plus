import { Dispatch, SetStateAction, createContext } from "react"

interface InputContextProps {
  engine: string
  setEngine: Dispatch<SetStateAction<string>>

  isFullMode: boolean
  setIsFullMode: Dispatch<SetStateAction<boolean>>

  //   processType: string
  //   setProcessType: Dispatch<SetStateAction<string>>

  selectedPrompt: string
  setSelectedPrompt: Dispatch<SetStateAction<string>>

  context: string
  setContext: Dispatch<SetStateAction<string>>

  prompt: string
  setPrompt: Dispatch<SetStateAction<string>>

  handleMessage: () => void
}

export const InputContext = createContext({} as InputContextProps)

interface ToolbarContextProps {
  isFullMode: boolean
  handleClear: () => void
  handleCopy: () => void
  handleInsertClick: () => void
  handleReplaceClick: () => void
}

export const ToolbarContext = createContext({} as ToolbarContextProps)

interface OutputContextProps {
  isFullMode: boolean
  isLoading: boolean
  responseMessage: string
}

export const OutputContext = createContext({} as OutputContextProps)
