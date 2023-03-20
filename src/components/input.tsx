import { Expand, Github, Shrink, Twitter } from "lucide-react"
import { useContext } from "react"

import { InputContext } from "~lib/context"
import { EngineOptions } from "~lib/enums"

import { SelectComponent } from "./select"

export function InputComponent() {
  const {
    engine,
    setEngine,
    isFullMode,
    setIsFullMode,
    selectedPrompt,
    setSelectedPrompt,
    context,
    setContext,
    prompt,
    setPrompt,
    handleMessage
  } = useContext(InputContext)
  const renderFullMode = () => {
    const mode = () => {
      if (isFullMode) {
        return <Shrink />
      } else {
        return <Expand />
      }
    }

    return (
      <div
        className="tooltip tooltip-left"
        data-tip={`FullMode ${isFullMode ? "Off" : "On"}`}>
        <button
          className="btn bg-transparent border-0"
          onClick={() => setIsFullMode(!isFullMode)}>
          {mode()}
        </button>
      </div>
    )
  }
  return (
    <div className="form-control flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div
          className="tooltip tooltip-right"
          data-tip="Please select your engine">
          <select
            className={` ${
              isFullMode ? "text select" : "text-xs select-xs"
            } shrink  dark:bg-info-content dark:text-white rounded-lg mr-1`}
            value={engine}
            onChange={(e) => setEngine(e.target.value)}>
            {EngineOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center justify-end mr-2">
          <a
            href="https://twitter.com/LiuVaayne"
            target="_blank"
            className="px-2">
            <Twitter />
          </a>
          <a
            href="https://github.com/Vaayne/NotionAI"
            target="_blank"
            className="bg-accent-transparent">
            <Github />
          </a>

          {renderFullMode()}
        </div>
      </div>

      <textarea
        className={`textarea mx-1 break-all ${
          isFullMode ? "text" : "text-xs"
        }  rounded-lg dark:bg-info-content dark:text-white`}
        placeholder="Please enter your context"
        value={context}
        onChange={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setContext(e.target.value)
        }}></textarea>

      <div className="flex flex-row items-center">
        <SelectComponent
          isFullMode={isFullMode}
          selectedPrompt={selectedPrompt}
          setSelectedPrompt={setSelectedPrompt}
          prompt={prompt}
          setPrompt={setPrompt}
        />

        <button
          className={`${
            isFullMode ? "btn" : "btn-xs"
          } btn-base-300 ml-0 m-2 rounded-lg dark:bg-info-content dark:text-white`}
          onClick={handleMessage}>
          Submit
        </button>
      </div>
    </div>
  )
}
