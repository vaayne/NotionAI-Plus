import { useStorage } from "@plasmohq/storage/hook"

import { storage } from "~lib/storage"

import "~style.css"

import { useEffect, useState } from "react"

import { ConstEnum } from "~lib/enums"

function IndexPopup() {
  const [notionSpaceId, setNotionSpaceId] = useState<string>("")
  const [defaultEngine, setDefaultEngine] = useStorage<string>("")

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const spaceID = await storage.get(ConstEnum.NOTION_SPACE_ID)
    setNotionSpaceId(spaceID)
    const engine = await storage.get(ConstEnum.DEFAULT_ENGINE)
    setDefaultEngine(engine)
  }

  const handleIsReady = () => {
    if (notionSpaceId) {
      return (
        <div className="prose bg-stone-200 text-sm text-black p-2 rounded-lg">
          <p>
            NotionAI is <strong>ready</strong>
          </p>
          <p>
            The default engine is <strong>{defaultEngine}</strong>
          </p>
        </div>
      )
    } else {
      return (
        <p>
          NotionAI is not ready, please go to option page and set Notion Space
          ID
        </p>
      )
    }
  }

  return (
    <div className="prose w-64 p-4">
      <article>
        <h1>NotionAI+</h1>
        <p>
          NotionAI plus is a browser extension that let you use NotionAI in your
          browser
        </p>
        <p>
          This project is Open Source, you can find the source code on{" "}
          <a href="https://github.com/Vaayne/NotionAI">Github</a>
        </p>
        <div className="">{handleIsReady()}</div>
      </article>
    </div>
  )
}

export default IndexPopup
