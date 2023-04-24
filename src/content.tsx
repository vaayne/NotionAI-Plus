import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import Draggable from "react-draggable"

import { sendToBackground } from "@plasmohq/messaging"
import { useMessage, usePort } from "@plasmohq/messaging/hook"
import { useStorage } from "@plasmohq/storage/hook"

import ComboxComponent from "~components/combobox"
import NotificationComponent from "~components/notification"
import { OutputComponent } from "~components/output"
import DividerComponent from "~components/toolbar"
import { InputContext, OutputContext, ToolbarContext } from "~lib/context"
import {
  ConstEnum,
  EngineEnum,
  ProcessTypeEnum,
  PromptType,
  PromptTypeEnum,
  newPromptType
} from "~lib/enums"
import type { MessageBody } from "~lib/model"
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

const getDefaultEngine = async () => {
  return await storage.get(ConstEnum.DEFAULT_ENGINE)
}

const Index = () => {
  const [engine, setEngine] = useState<string>()
  const [processType, setProcessType] = useState<string>(ProcessTypeEnum.Text)
  const [selectedPrompt, setSelectedPrompt] = useState<PromptType>()
  const [context, setContext] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [responseMessage, setResponseMessage] = useState<string>("")
  const [notionSpaceId] = useStorage<string>({
    key: ConstEnum.NOTION_SPACE_ID,
    instance: storage
  })
  const [chatGPTAPIKey] = useStorage<string>({
    key: ConstEnum.CHATGPT_API_KEY,
    instance: storage
  })
  const [notionBoyAPIKey] = useStorage<string>({
    key: ConstEnum.NOTIONBOY_API_KEY,
    instance: storage
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isShowElement, setIsShowElement] = useState(false)
  const [notification, setNotification] = useState<string>("")
  const [isFullMode, setIsFullMode] = useState<boolean>(false)
  const [selectedElement, setSelectedElement] = useState<HTMLElement>()
  const [isShowToast, setIsShowToast] = useState<boolean>(false)

  const streamPort = usePort("stream")

  // when press ESC will hidden the  window
  const handleEscape = (event: any) => {
    if (event.key === "Escape") {
      setIsShowElement(false)
    }
  }

  // init on page load
  useEffect(() => {
    // set default engine
    getDefaultEngine().then((engine) => {
      setEngine(engine)
    })

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // show panel using shortcut
  useMessage<string, string>(async (req, res) => {
    if (req.name === "activate") {
      // if not select text, then get context from Webpage
      if (!isShowElement && window.getSelection().toString() !== "") {
        const selection = window.getSelection().toString()
        setContext(selection)
      }
      if (req.body) {
        const msg = JSON.parse(req.body) as MessageBody
        setContext(msg.text)
        setSelectedPrompt(newPromptType(msg.prompt))
      } else {
        handlerSelectText()
      }

      setIsShowElement(true)
    }
  })

  const handlerSelectText = () => {
    if (
      document.activeElement &&
      (document.activeElement.isContentEditable ||
        document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        document.activeElement.nodeName.toUpperCase() === "INPUT")
    ) {
      console.log("select text from input")
      // Set as original for later
      setSelectedElement(document.activeElement as HTMLElement)
    }
  }

  const handleMessage = async () => {
    if (!engine) {
      handleToast("Please select an engine")
      return
    }
    if (!context) {
      handleToast("Please input context")
      return
    }
    // setIsLoading(true)

    let lprompt: string = ""
    let language: string = ""
    let tone: string = ""
    // console.log("selectedPrompt", selectedPrompt)
    const prompts = selectedPrompt.value.split("-")
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

    setResponseMessage("Waitting for AI response ...")

    const body = {
      engine: engine,
      processType: processType,
      builtinPrompt: promptType,
      customPromot: lprompt,
      context: context,
      language: language,
      tone: tone,
      notionSpaceId: notionSpaceId,
      chatGPTAPIKey: chatGPTAPIKey,
      notionBoyAPIKey: notionBoyAPIKey
    }

    streamPort.send(body)

    // if (body.engine == EngineEnum.ChatGPTWeb) {
    //   streamPort.send(body)
    //   return
    // }

    // const response = await sendToBackground({
    //   name: "request",
    //   body: body
    // })
    // // console.log(
    // //   `request: ${JSON.stringify(body)}, response: ${response.message}`
    // // )
    // setResponseMessage(response.message)
    // setIsLoading(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(responseMessage)
    handleToast("Copied to clipboard")
  }

  const handleToast = (message: string) => {
    setNotification(message)
    setIsShowToast(true)
  }

  const handleClear = () => {
    setResponseMessage("")
    handleToast("Cleared")
  }

  const handleInsertClick = () => {
    if (selectedElement) {
      selectedElement.value = `${selectedElement.value}\n\n${responseMessage}`
    }
  }

  const handleReplaceClick = () => {
    if (selectedElement) {
      selectedElement.value = responseMessage
    }
  }

  if (isShowElement) {
    return (
      <>
        <Draggable handle="#dragable">
          <div
            id="notionai-plus"
            className={`fixed  ${
              isFullMode
                ? " h-5/6 w-11/12 top-10 left-10"
                : "top-1/3 right-10 w-1/3 h-1/2"
            } overflow-hidden rounded-lg flex flex-col bg-slate-200 dark:bg-slate-700`}>
            <InputContext.Provider
              value={{
                engine,
                setEngine,
                isFullMode,
                setIsFullMode,
                selectedPrompt,
                setSelectedPrompt,
                context,
                setContext,
                prompt,
                setPrompt,
                handleMessage,
                isLoading
              }}>
              <ComboxComponent />
            </InputContext.Provider>

            <ToolbarContext.Provider
              value={{
                handleClear,
                handleCopy,
                handleInsertClick,
                handleReplaceClick
              }}>
              {responseMessage && <DividerComponent />}
            </ToolbarContext.Provider>

            <OutputContext.Provider
              value={{
                isFullMode,
                responseMessage,
                streamPort
              }}>
              {responseMessage && <OutputComponent />}
            </OutputContext.Provider>
          </div>
        </Draggable>
        <NotificationComponent
          isShow={isShowToast}
          setIsShow={setIsShowToast}
          title={notification}
        />
      </>
    )
  }
}

export default Index
