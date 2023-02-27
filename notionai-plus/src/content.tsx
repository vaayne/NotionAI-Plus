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
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Here is your context that you want NotionAI to process
              </span>
            </label>
            <textarea
              className="textarea mx-2"
              placeholder="Please enter your context"
              value={context}
              onChange={(e) => setContext(e.target.value)}></textarea>
          </div>
          <label className="label">
            <span className="label-text">
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
          <div className="flex flex-col h-full">
            <div className="p-0 m-0 flex flex-row justify-between content-center items-stretch">
              <h3 className="px-4 my-1 self-center">NotionAI Says: </h3>
              <div className="flex flex-row">
                <button className="btn gap-2" onClick={handleClear}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="16"
                    height="16">
                    <path d="M17.7,6.3c-0.6-0.6-1.6-0.6-2.2,0c-2.2,2.2-5.7,2.2-7.9,0c-0.6-0.6-1.6-0.6-2.2,0c-0.6,0.6-0.6,1.6,0,2.2c3.4,3.4,8.9,3.4,12.3,0C18.3,7.9,18.3,6.9,17.7,6.3z M13.8,11.7c-0.6,0.6-0.6,1.6,0,2.2c0.6,0.6,1.6,0.6,2.2,0c1.5-1.5,1.5-4,0-5.5c-0.6-0.6-1.6-0.6-2.2,0C13.2,10.1,13.2,11.1,13.8,11.7z M9.3,13.3c0.6-0.6,0.6-1.6,0-2.2c-0.6-0.6-1.6-0.6-2.2,0c-1.5,1.5-1.5,4,0,5.5c0.6,0.6,1.6,0.6,2.2,0C9.9,14.9,9.9,13.9,9.3,13.3z" />
                  </svg>
                </button>
                <button className="btn gap-2" onClick={handleCopy}>
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
            <div className="flex-1 px-4 pb-4 w-full overflow-auto box-border ">
              {handleLoading()}
            </div>
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
