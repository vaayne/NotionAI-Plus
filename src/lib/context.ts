import { createContext } from "react"


interface InputContextProps {
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
