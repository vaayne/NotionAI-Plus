import "~base.css"

import cssText from "data-text:~style.css"
import { marked } from "marked"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"
import { useStorage } from "@plasmohq/storage/hook"

import { SelectComponent } from "~components/select"
import { PromptTypeEnum } from "~lib/enums"
import { storage } from "~lib/storage"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const Index = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>(
    PromptTypeEnum.HelpMeWrite
  )
  const [context, setContext] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [responseMessage, setResponseMessage] = useState<string>("")
  const [notionSpaceId] = useStorage<string>({
    key: "noiton-space-id",
    instance: storage
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isShowElement, setIsShowElement] = useState(false)
  const [notification, setNotification] = useState<string>("")

  // hidden panel using ESC
  useEffect(() => {
    function handleEscape(event: any) {
      if (event.key === "Escape") {
        setIsShowElement(false)
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  useEffect(() => {
    if (notification != "") {
      const timer = setTimeout(() => {
        setNotification("")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // show panel using shortcut
  useMessage<string, string>(async (req, res) => {
    if (req.name === "activate") {
      // if not select text, then get context from Webpage
      if (!isShowElement && window.getSelection().toString() !== "") {
        const selection = window.getSelection().toString()
        setContext(selection)
      }
      setIsShowElement(!isShowElement)
    }
  })

  // show input for ChatGPT and hel me write

  const handleLoading = () => {
    if (isLoading) {
      return <progress className="progress w-56"></progress>
    }
    const html = marked(responseMessage)
    return (
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}></article>
    )
  }
  const handleMessage = async () => {
    setIsLoading(true)

    let lprompt: string = ""
    let language: string = ""
    let tone: string = ""

    const prompts = selectedPrompt.split("-")
    console.log("prompts: " + prompts)
    let promptType = prompts[0]
    if (promptType === PromptTypeEnum.Translate) {
      language = prompts[1]
    } else if (promptType === PromptTypeEnum.ChangeTone) {
      tone = prompts[1]
    } else if (promptType === PromptTypeEnum.TopicWriting) {
      setPrompt(prompts[1])
      lprompt = prompts[1]
    } else if (promptType === PromptTypeEnum.HelpMeWrite) {
      lprompt = prompt
    }

    setResponseMessage("Waitting for Notion AI...")
    const response = await sendToBackground({
      name: "request",
      body: {
        promptType: promptType,
        context: context,
        prompt: lprompt,
        language: language,
        tone: tone,
        notionSpaceId: notionSpaceId
      }
    })
    console.log(response.message)
    setResponseMessage(response.message)
    setIsLoading(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(responseMessage)
    handleToast("Copied to clipboard")
  }

  const handleToast = (message: string) => {
    setNotification(message)
  }

  const handleClear = () => {
    setResponseMessage("")
    handleToast("Cleared")
  }

  const page = () => {
    if (isShowElement) {
      return (
        <div className="fixed top-1/3 right-10 w-1/3 h-1/2 overflow-hidden rounded-lg flex flex-col bg-blue-100">
          <div className="form-control flex flex-col">
            <div className="flex flex-row justify-between align-middle">
              <label className="label">
                <span className="label-text text-primary-focus">
                  Here is your context that you want NotionAI to process
                </span>
              </label>
              <div className="flex flex-row items-center mr-2">
                <a
                  href="https://twitter.com/LiuVaayne"
                  target="_blank"
                  className="px-2">
                  <svg
                    height="32"
                    width="32"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <g>
                      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                    </g>
                  </svg>
                </a>
                <a href="https://github.com/Vaayne/NotionAI" target="_blank">
                  <svg
                    height="32"
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="32"
                    data-view-component="true">
                    <path
                      fill-rule="evenodd"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <textarea
              className="textarea mx-2 break-all text-sm"
              placeholder="Please enter your context"
              value={context}
              onChange={(e) => setContext(e.target.value)}></textarea>
          </div>
          <label className="label">
            <span className="label-text text-primary-focus">
              Here is your Prompt that how you want NotionAI process the context{" "}
            </span>
          </label>
          <SelectComponent
            selectedPrompt={selectedPrompt}
            setSelectedPrompt={setSelectedPrompt}
            prompt={prompt}
            setPrompt={setPrompt}
          />

          <button className="btn btn-primary m-2" onClick={handleMessage}>
            Submit
          </button>
          <div className="divider m-0"></div>
          <div className="p-0 m-0 flex flex-row justify-between content-center items-stretch">
            <h3 className="px-4 my-1 self-center text-primary">
              NotionAI Says:
            </h3>
            <div className="flex flex-row">
              <button className="btn btn-primary gap-2" onClick={handleClear}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="16"
                  height="16">
                  <path d="M17.7,6.3c-0.6-0.6-1.6-0.6-2.2,0c-2.2,2.2-5.7,2.2-7.9,0c-0.6-0.6-1.6-0.6-2.2,0c-0.6,0.6-0.6,1.6,0,2.2c3.4,3.4,8.9,3.4,12.3,0C18.3,7.9,18.3,6.9,17.7,6.3z M13.8,11.7c-0.6,0.6-0.6,1.6,0,2.2c0.6,0.6,1.6,0.6,2.2,0c1.5-1.5,1.5-4,0-5.5c-0.6-0.6-1.6-0.6-2.2,0C13.2,10.1,13.2,11.1,13.8,11.7z M9.3,13.3c0.6-0.6,0.6-1.6,0-2.2c-0.6-0.6-1.6-0.6-2.2,0c-1.5,1.5-1.5,4,0,5.5c0.6,0.6,1.6,0.6,2.2,0C9.9,14.9,9.9,13.9,9.3,13.3z" />
                </svg>
              </button>
              <button className="btn btn-primary gap-2" onClick={handleCopy}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="16"
                  height="16">
                  <path d="M19.4,4.6h-4.1V3c0-1.1-0.9-2-2-2s-2,0.9-2,2v1.6h-4.1c-1.1,0-2,0.9-2,2v13.8c0,1.1,0.9,2,2,2h14.1c1.1,0,2-0.9,2-2V6.6C21.4,5.5,20.5,4.6,19.4,4.6z M7.4,3c0-0.6,0.4-1,1-1s1,0.4,1,1v1.6H7.4V3z M15.3,18.4H8.7v-1.6c0-0.6-0.4-1-1-1s-1,0.4-1,1v1.6H4.7V6.6h10.6V18.4z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="divider m-0"></div>
          <div className="px-4 overflow-auto box-border ">
            {handleLoading()}
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      {isShowElement && page()}{" "}
      {notification && (
        <div className="toast toast-top toast-end mr-4">
          <div className="alert alert-success">
            <div>
              <span>{notification}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Index
