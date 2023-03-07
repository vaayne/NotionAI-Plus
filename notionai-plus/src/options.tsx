import "~base.css"
import "~style.css"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import type { NotionSpace } from "~lib/api/notion"
import { ConstEnum, EngineOptions } from "~lib/enums"
import { storage } from "~lib/storage"

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
    <div className="prose container mx-auto w-1/2">
      <div className="row">
        <div className="col-12 pl-1">
          <h1>NotionAI+</h1>
          <p>
            NotionAI+ is a browser extension that adds a few features to Notion.
          </p>
          <p>It is currently in development, and may have break change.</p>
          <p>
            This project is Open Source, you can find the source code on{" "}
            <a href="https://github.com/Vaayne/NotionAI">Github</a>
          </p>
        </div>

        <form className="flex flex-col justify-items-start w-2/3">
          <div className="flex flex-row items-center">
            <label className="label w-12">
              <span className="label-text">Notion Space: </span>
            </label>
            <button
              className="btn mx-2"
              onClick={async () => handleGetNotionSpaces()}>
              Get Spaces
            </button>
            {!notionSpaces && (
              <p className="bg-error rounded-lg px-1 my-1">
                Please login Notion and click GetSpaces
              </p>
            )}
            {notionSpaces && (
              <select
                className="select select-primary flex-1"
                value={notionSpaceId}
                onChange={(e) => setNotionSpaceId(e.target.value)}>
                <option value="disabled" key="disbaled" disabled>
                  Please select a space
                </option>
                {JSON.parse(notionSpaces)?.map((space) => {
                  space = space as NotionSpace
                  return (
                    <option value={space.id} key={space.id}>
                      {space.name}
                    </option>
                  )
                })}
              </select>
            )}
          </div>
          <p>{message}</p>
          <div className="flex flex-row my-2 ">
            <label className="label w-12">
              <span className="label-text">OpenAI ApiKey: </span>
            </label>
            <input
              type="text"
              placeholder="Please input your OpenAI ApiKey"
              className="input input-bordered flex-1 mx-2"
              value={ChatGPTAPIKey}
              onChange={(e) => setChatGPTAPIKey(e.target.value)}
            />
          </div>
          <div className="flex flex-row my-2">
            <label className="label w-12">
              <span className="label-text">Default Engine: </span>
            </label>
            <select
              className="select select-primary rounded-full flex-1 mx-2"
              value={defaultEngine}
              onChange={(e) => setDefaultEngine(e.target.value)}>
              {EngineOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn"
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
