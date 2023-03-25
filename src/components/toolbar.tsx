import { ClipboardCopy, Edit, Eraser, TextCursorInputIcon } from "lucide-react"
import { useContext } from "react"

import { ToolbarContext } from "~lib/context"

export default function DividerComponent() {
  const { handleClear, handleCopy, handleInsertClick, handleReplaceClick } =
    useContext(ToolbarContext)
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="inline-flex -space-x-px rounded-md shadow-sm isolate">
          <button
            type="button"
            onClick={handleClear}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <div className="flex flex-col items-center justify-between w-8 h-8">
              <Eraser size={16} />
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700">
                Eraser
              </label>
            </div>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <div className="flex flex-col items-center justify-between w-8 h-8">
              <ClipboardCopy size={16} />
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700">
                Copy
              </label>
            </div>
          </button>
          <button
            type="button"
            onClick={handleInsertClick}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <div className="flex flex-col items-center justify-between w-8 h-8">
              <TextCursorInputIcon size={16} />
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700">
                Insert
              </label>
            </div>
          </button>
          <button
            type="button"
            onClick={handleReplaceClick}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <div className="flex flex-col items-center justify-between w-8 h-8">
              <Edit size={16} />
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700">
                Replace
              </label>
            </div>
          </button>
        </span>
      </div>
    </div>
  )
}
