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
                    className="fill-none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="https://github.com/Vaayne/NotionAI" target="_blank">
                  <svg
                    className="fill-none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
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
                  className="fill-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
                  <path d="M22 21H7"></path>
                  <path d="m5 11 9 9"></path>
                </svg>
              </button>
              <button className="btn btn-primary gap-2" onClick={handleCopy}>
                <svg
                  className="fill-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                  <path d="M16 4h2a2 2 0 0 1 2 2v4"></path>
                  <path d="M21 14H11"></path>
                  <path d="m15 10-4 4 4 4"></path>
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
