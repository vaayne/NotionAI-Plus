import { useStorage } from "@plasmohq/storage/hook"

import { CountButton } from "~features/count-button"
import { storage } from "~lib/storage"

import "~base.css"
import "~style.css"

function IndexPopup() {
  const [notionToken] = useStorage<string>({
    key: "noiton-token",
    instance: storage
  })
  const [notionSpaceId] = useStorage<string>({
    key: "noiton-space-id",
    instance: storage
  })
  return (
    <div className="prose container flex flex-col">
      <div className="flex items-center justify-center h-16 w-40">
        <CountButton />
      </div>
      <div>
        <h1>NotionAI+</h1>
        <p>
          NotionAI+ is a browser extension that adds a few features to Notion.
        </p>

        <p>Notion Token: {notionToken}</p>
        <p>Notion Space Id: {notionSpaceId}</p>
      </div>
    </div>
  )
}

export default IndexPopup
