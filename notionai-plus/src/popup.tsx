import { useStorage } from "@plasmohq/storage/hook"

import { CountButton } from "~features/count-button"
import { storage } from "~lib/storage"

import "~base.css"
import "~style.css"

import { useState } from "react"

function IndexPopup() {
  const [notionSpaceId] = useStorage<string>({
    key: "noiton-space-id",
    instance: storage
  })

  const handleIsReady = () => {
    if (notionSpaceId) {
      return <p>NotionAI is ready</p>
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
