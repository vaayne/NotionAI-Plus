import { Combobox, Disclosure } from "@headlessui/react"
import {
  CheckIcon,
  ChevronUpDownIcon,
  ChevronUpIcon
} from "@heroicons/react/20/solid"
import { Github, Maximize, Minus, Send, Twitter } from "lucide-react"
import { useContext, useState } from "react"

import { InputContext } from "~lib/context"
import {
  EngineOptions,
  LanguageOptions,
  PromptType,
  PromptTypeEnum,
  PromptTypeOptions,
  ToneOptions,
  TopicOptions
} from "~lib/enums"

const Options: PromptType[] = [
  ...PromptTypeOptions.filter((option) => {
    return (
      option.value !== PromptTypeEnum.ChangeTone &&
      option.value !== PromptTypeEnum.Translate &&
      option.value !== PromptTypeEnum.TopicWriting
    )
  }),
  ...ToneOptions.map((option) => {
    option.label = `🎭 Change Tone - ${option.label}`
    return option
  }),
  ...TopicOptions.map((option) => {
    option.label = `📝 Topic - ${option.label}`
    return option
  }),
  ...LanguageOptions.map((option) => {
    option.label = `🌐 Translate - ${option.label}`
    return option
  })
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function ComboxComponent() {
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
    handleMessage,
    isLoading
  } = useContext(InputContext)

  const [query, setQuery] = useState("")

  const filteredOptions =
    query === ""
      ? Options
      : Options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase())
        })

  const inputCustomPrompt = () => {
    if (selectedPrompt && selectedPrompt.value == PromptTypeEnum.HelpMeWrite) {
      return (
        <div className="relative">
          <textarea
            rows={2}
            name="comment"
            id="comment"
            className="block w-full p-2 pr-6 border-gray-300 rounded-md shadow-sm relivate focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Write your custom prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="button"
            onClick={handleMessage}
            className="absolute right-2 bottom-1 inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <Send size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      )
    }
  }

  const header = () => {
    return (
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-end mr-2 space-x-1">
          <a
            href="https://twitter.com/LiuVaayne"
            target="_blank"
            className="inline-flex item-center dark:text-white">
            <Twitter size={16} />
          </a>
          <a
            href="https://github.com/Vaayne/NotionAI"
            target="_blank"
            className="inline-flex item-center dark:text-white">
            <Github size={16} />
          </a>
          <button
            type="button"
            className="inline-flex items-center border border-transparent rounded-full shadow-sm dark:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setIsFullMode(!isFullMode)}>
            <Minus size={16} />
          </button>
          <button
            type="button"
            className="inline-flex items-center border border-transparent rounded-full shadow-sm dark:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setIsFullMode(!isFullMode)}>
            <Maximize size={16} className="" />
          </button>
        </div>
      </div>
    )
  }

  const showContext = () => {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <div className="flex flex-row items-center justify-between space-x-2">
              {selectEngine()}
              <Disclosure.Button className="flex justify-between w-1/2 px-4 py-2 text-sm font-medium text-left text-purple-900 bg-indigo-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Show context</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>

              {header()}
            </div>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <div className="flex flex-col space-y-1">
                <textarea
                  rows={2}
                  name="comment"
                  id="comment"
                  className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Here are your context."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }

  const selectEngine = () => {
    return (
      <select
        id="location"
        name="location"
        className="block w-1/3 py-2 pl-3 pr-10 my-1 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        defaultValue={engine}
        onChange={(e) => setEngine(e.target.value)}>
        {EngineOptions.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  const handleSelectPromot = (prompt: PromptType) => {
    setSelectedPrompt(prompt)
    if (prompt.value == PromptTypeEnum.HelpMeWrite) {
      return
    }
    handleMessage()
  }

  const comboxSelect = () => {
    return (
      <Combobox
        as="div"
        value={selectedPrompt}
        onChange={handleSelectPromot}
        className="w-full">
        <div className="relative">
          <Combobox.Input
            className="w-full py-[6px] pl-3 pr-10 bg-white border-0 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Please select a prompt..."
            displayValue={(option: PromptType) => option?.label}
          />
          <Combobox.Button className="absolute inset-y-0 flex items-center px-2 right-2 rounded-r-md focus:outline-none">
            <ChevronUpDownIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredOptions.length > 0 && (
            <Combobox.Options className="box-border absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    )
                  }>
                  {({ active, selected }) => (
                    <>
                      <div className="flex items-center">
                        <span
                          className={classNames(
                            "ml-3 truncate",
                            selected && "font-semibold"
                          )}>
                          {option.label}
                        </span>
                      </div>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-indigo-600"
                          )}>
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    )
  }

  return (
    <div className="flex flex-col m-2 space-y-1">
      {showContext()}
      {comboxSelect()}
      {inputCustomPrompt()}
    </div>
  )
}
