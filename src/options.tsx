import "~style.css"

import { sendToBackground } from "@plasmohq/messaging"

import type { NotionSpace } from "~lib/api/notion-space"
import {
  ConstEnum,
  EngineEnum,
  EngineOptions,
  OpenAIModelOptions
} from "~lib/enums"
import { engineAtom, notionSpaceIdAtom, notionSpacesAtom, openAIAPIHostAtom, openAIAPIKeyAtom, openAIAPIModelAtom, storage } from "~lib/state"
import { useAtom } from "jotai"

function OptionsPage() {

  const [notionSpaceId, setNotionSpaceId] = useAtom(notionSpaceIdAtom)
  const [notionSpaces, setNotionSpaces] = useAtom(notionSpacesAtom)
  const [openAIAPIKey, setOpenAIAPIKey] = useAtom(openAIAPIKeyAtom)
  const [openAIAPIHost, setOpenAIAPIHost] = useAtom(openAIAPIHostAtom)
  const [openAIAPIModel, setOpenAIAPIModel] = useAtom(openAIAPIModelAtom)
  const [engine, setEngine] = useAtom(engineAtom)

  storage.watch({
    [ConstEnum.DEFAULT_ENGINE]: (c) => setEngine(c.newValue),
    [ConstEnum.NOTION_SPACE_ID]: (c) => setNotionSpaceId(c.newValue),
    [ConstEnum.NOTION_SPACES]: (c) => setNotionSpaces(c.newValue),
    [ConstEnum.OPENAI_API_HOST]: (c) => setOpenAIAPIHost(c.newValue),
    [ConstEnum.OPENAI_API_KEY]: (c) => setOpenAIAPIKey(c.newValue),
    [ConstEnum.OPENAI_API_MODEL]: (c) => setOpenAIAPIModel(c.newValue),
  })

const saveToStorage = async (key: string, val: any) => {
  await storage.set(key, val)
}


const handleGetNotionSpaces = async () => {
  const response = await sendToBackground({
    name: "get-notion-spaces",
    body: {}
  })
  alert(response)
}

const notionAISettings = () => {
  return (
    <div className="flex flex-col space-y-1">
      <label
        htmlFor="location"
        className="block text-sm font-medium text-gray-700">
        Notion Space: (only set it if you using NotionAI, need login first)
      </label>
      <div className="flex flex-row space-x-2">
        <button
          type="button"
          className="w-28 rounded border border-transparent bg-indigo-600 px-2.5 py-0 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={async () => handleGetNotionSpaces()}>
          Get Spaces
        </button>
        <select
          id="location"
          name="location"
          value={notionSpaceId}
          className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          onChange={(e) => saveToStorage(ConstEnum.NOTION_SPACE_ID, e.target.value)}>
          <option value="disabled" key="disbaled">
            Please select a space
          </option>
          {notionSpaces &&
            JSON.parse(notionSpaces)?.map((space) => {
              space = space as NotionSpace
              return (
                <option value={space.id} key={space.id}>
                  {space.name}
                </option>
              )
            })}
        </select>
      </div>
    </div>
  )
}

const openaiAPISettings = () => {
  return (
    <div>
      <div className="flex flex-col space-y-1 ">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700">
          OpenAI API Host:
        </label>
        <input
          type="text"
          id="openai-key"
          className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          // defaultValue={"https://api.openai.com"}
          value={openAIAPIHost}
          onChange={(e) => saveToStorage(ConstEnum.OPENAI_API_HOST, e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1 ">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700">
          OpenAI ApiKey:
        </label>
        <input
          type="password"
          id="openai-key"
          className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Please input your OpenAI ApiKey"
          value={openAIAPIKey}
          onChange={(e) => saveToStorage(ConstEnum.OPENAI_API_KEY, e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1 ">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700">
          OpenAI Model:
        </label>
        <select
          id="location"
          name="location"
          value={openAIAPIModel}
          className="block w-full p-3 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          onChange={(e) => saveToStorage(ConstEnum.OPENAI_API_MODEL, e.target.value)}>
          <option value="disabled" key="disbaled">
            Please select default model
          </option>
          {OpenAIModelOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

return (
  <div className="w-full h-screen">
    <div className="container h-full max-w-3xl p-10 mx-auto ">
      <form className="flex flex-col p-4 space-y-3 bg-slate-100 rounded-xl">
        <div className="flex flex-row justify-between">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700">
            Default Engine:
          </label>

          <select
            id="location"
            name="location"
            value={engine}
            className="block w-full p-3 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            onChange={(e) => saveToStorage(ConstEnum.DEFAULT_ENGINE, e.target.value) }>
            <option value="disabled" key="disbaled">
              Please select a engine
            </option>
            {EngineOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {engine === EngineEnum.NotionAI && notionAISettings()}
        {engine === EngineEnum.ChatGPTAPI && openaiAPISettings()}

        <button
          type="button"
          className="px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            alert(`Config Saved!`)
          }}>
          Save
        </button>
      </form>
    </div>
  </div>
)
}

export default OptionsPage
