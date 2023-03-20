import { ClipboardCopy, Edit, Eraser, TextCursorInputIcon } from "lucide-react"
import { useContext } from "react"

import { ToolbarContext } from "~lib/context"

export function ToolBarComponent() {
  const {
    isFullMode,
    handleClear,
    handleCopy,
    handleInsertClick,
    handleReplaceClick
  } = useContext(ToolbarContext)
  return (
    <div className="p-0 m-0 flex flex-row justify-between content-center items-stretch">
      <p
        className={`px-4 my-1 self-center ${
          isFullMode ? "text" : "text-sm"
        } text-black dark:text-white`}>
        <strong>AI Says:</strong>
      </p>
      <div className="flex flex-row mx-2">
        <div className="tooltip tooltip-top tooltip-primary" data-tip="Clear">
          <button
            className={`${
              isFullMode ? "btn" : "btn-sm"
            } btn-primary bg-transparent border-0 gap-2`}
            onClick={handleClear}>
            <Eraser />
          </button>
        </div>
        <div className="tooltip tooltip-top tooltip-primary" data-tip="Copy">
          <button
            className={`${
              isFullMode ? "btn" : "btn-sm"
            } btn-primary bg-transparent border-0 gap-2`}
            onClick={handleCopy}>
            <ClipboardCopy />
          </button>
        </div>
        <div className="tooltip tooltip-top tooltip-primary" data-tip="Insert">
          <button
            className={`${
              isFullMode ? "btn" : "btn-sm"
            } btn-primary bg-transparent border-0 gap-2`}
            onClick={handleInsertClick}>
            <TextCursorInputIcon />
          </button>
        </div>
        <div className="tooltip tooltip-top tooltip-primary" data-tip="Replace">
          <button
            className={`${
              isFullMode ? "btn" : "btn-sm"
            } btn-primary bg-transparent border-0 gap-2`}
            onClick={handleReplaceClick}>
            <Edit />
          </button>
        </div>
      </div>
    </div>
  )
}
