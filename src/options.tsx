import "~style.css"

import { marked } from "marked"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import type { NotionSpace } from "~lib/api/notion"
import { ConstEnum, EngineOptions } from "~lib/enums"
import { storage } from "~lib/storage"

const IntroStr = `

# NotionAI Plus

NotionAI Plus is a remarkable browser extension that enhances any website you visit with NotionAI's powerful features.
With NotionAI Plus, you can effortlessly analyze text, generate summaries, and perform sentiment analysis on any webpage.

This project is Open Source, and the source code can be found on [Github](https://github.com/Vaayne/NotionAI-Plus).

You can connect me on [Twitter](https://twitter.com/LiuVaayne) if you have any questions or suggestions.

## Settings

### Notion Space
To use NotionAI as an engine, follow these steps:
1. Sign in to [Notion](https://www.notion.so/)
2. Set the notion space id by clicking the "Get Spaces" button and selecting a space.

### ChatGPT ApiKey
If you prefer to use ChatGPT API as an engine instead of NotionAI, obtain an API key from [OpenAI](https://openai.com/).

### ChatGPT Web
Alternatively, if you want to use ChatGPT Web as your engine of choice for analyzing text on webpages, sign in to [ChatGPT](https://chat.openai.com/).

### Default Engine
You have the option of setting a default engine for your analyses or changing engines by clicking on the icon in the
`

function OptionsPage() {
  const [notionSpaceId, setNotionSpaceId] = useStorage<string>({
    key: ConstEnum.NOTION_SPACE_ID,
    instance: storage
  })

  const [defaultEngine, setDefaultEngine] = useStorage<string>({
    key: ConstEnum.DEFAULT_ENGINE,
    instance: storage
  })

  const [ChatGPTAPIKey, setChatGPTAPIKey] = useStorage<string>({
    key: ConstEnum.CHATGPT_API_KEY,
    instance: storage
  })

  const [notionSpaces] = useStorage<string>({
    key: ConstEnum.NOTION_SPACES,
    instance: storage
  })

  const [message, setMessage] = useStorage<string>({
    key: "message",
    instance: storage
  })

  const handleGetNotionSpaces = async () => {
    const response = await sendToBackground({
      name: "get-notion-spaces",
      body: {}
    })
    setMessage(response)
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-row">
        <div
          className="w-full p-2 prose"
          dangerouslySetInnerHTML={{ __html: marked(IntroStr) }}></div>
        <form className="flex flex-col w-2/3 p-4 space-y-3 prose justify-items-start bg-slate-100">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700">
              Notion Space: (only set it if you using NotionAI, need login
              first)
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
                className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setNotionSpaceId(e.target.value)}>
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

          <div className="flex flex-col space-y-1 ">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700">
              OpenAI ApiKey: (only set it if you using ChatGPT API)
            </label>
            <input
              type="password"
              id="openai-key"
              className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Please input your OpenAI ApiKey"
              value={ChatGPTAPIKey}
              onChange={(e) => setChatGPTAPIKey(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700">
              Default Engine:
            </label>

            <select
              id="location"
              name="location"
              className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => setNotionSpaceId(e.target.value)}>
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
