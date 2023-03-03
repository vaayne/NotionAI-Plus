import "~base.css"
import "~style.css"

import { useStorage } from "@plasmohq/storage/hook"

import { storage } from "~lib/storage"

function OptionsPage() {
  const [notionSpaceId, setNotionSpaceId] = useStorage<string>({
    key: "noiton-space-id",
    instance: storage
  })

  const [ChatGPTAPIKey, setChatGPTAPIKey] = useStorage<string>({
    key: "chat-gpt-api-key",
    instance: storage
  })

  return (
    <div className="prose container mx-auto">
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

        {/* a form with two input , one for notion token nad one for notion space id */}
        <form className="flex flex-col">
          <div className="flex flex-row">
            <label className="label">
              <span className="label-text">Notion Space ID: </span>
            </label>
            <input
              type="text"
              placeholder="Please input your Notion Space Id"
              className="input input-bordered w-full max-w-xs"
              value={notionSpaceId}
              onChange={(e) => setNotionSpaceId(e.target.value)}
            />
          </div>
          <div className="flex flex-row my-2">
            <label className="label">
              <span className="label-text">OpenAI ApiKey: </span>
            </label>
            <input
              type="text"
              placeholder="Please input your OpenAI ApiKey"
              className="input input-bordered w-full max-w-xs"
              value={ChatGPTAPIKey}
              onChange={(e) => setChatGPTAPIKey(e.target.value)}
            />
          </div>
          <button
            className="btn m-4"
            onClick={(e) => {
              alert(`Success set Notion Space Id and OpenAI ApiKey!`)
            }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default OptionsPage
