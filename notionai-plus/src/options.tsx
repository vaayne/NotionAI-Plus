import "~base.css"
import "~style.css"

import { useStorage } from "@plasmohq/storage/hook"

import { storage } from "~lib/storage"

function OptionsPage() {
  const [notionToken, setNotionToken] = useStorage<string>({
    key: "noiton-token",
    instance: storage
  })
  const [notionSpaceId, setNotionSpaceId] = useStorage<string>({
    key: "noiton-space-id",
    instance: storage
  })

  return (
    <div className="prose container">
      <div className="row">
        <div className="col-12">
          <h1>NotionAI+</h1>
          <p>
            NotionAI+ is a browser extension that adds a few features to Notion.
          </p>
          <p>It is currently in development, and is not ready for use.</p>
          <p>Check back later!</p>
        </div>

        {/* a form with two input , one for notion token nad one for notion space id */}
        <form className="container flex flex-col">
          <input
            type="text"
            placeholder="Please input your Notion Token"
            className="input input-bordered w-full max-w-xs"
            value={notionToken}
            onChange={(e) => setNotionToken(e.target.value)}
          />
          <input
            type="text"
            placeholder="Please input your Notion Space Id"
            className="input input-bordered w-full max-w-xs"
            value={notionSpaceId}
            onChange={(e) => setNotionSpaceId(e.target.value)}
          />
          <button
            className="btn"
            onClick={(e) => {
              alert(
                `Success set Notion Token ${notionToken} and Space Id ${notionSpaceId}!`
              )
            }}>
            Button
          </button>
        </form>
      </div>
    </div>
  )
}

export default OptionsPage
