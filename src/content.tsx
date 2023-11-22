import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import Draggable from "react-draggable"

import { useMessage } from "@plasmohq/messaging/hook"

import { useAtom, useAtomValue } from "jotai"
import {
  contextAtom,
  engineAtom,
  isFullModeAtom,
  isLoadingAtom,
  isShowElementAtom,
  isShowToastAtom,
  notificationAtom,
  notionSpaceIdAtom,
  openAIAPIHostAtom,
  openAIAPIKeyAtom,
  processTypeAtom,
  promptAtom,
  responseMessageAtom,
  selectedElementAtom,
  selectedPromptAtom
} from "~/lib/state"
import ComboxComponent from "~components/combobox"
import NotificationComponent from "~components/notification"
import { OutputComponent } from "~components/output"
import DividerComponent from "~components/toolbar"
import { InputContext, ToolbarContext } from "~lib/context"
import {
  ConstEnum,
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

const Index = () => {
  const [notionSpaceId, setNotionSpaceId] = useAtom(notionSpaceIdAtom)
  const [openAIAPIKey, setOpenAIAPIKey] = useAtom(openAIAPIKeyAtom)
  const [openAIAPIHost, setOpenAIAPIHost] = useAtom(openAIAPIHostAtom)
  const [engine, setEngine] = useAtom(engineAtom)
  const [processType, setProcessType] = useAtom(processTypeAtom)
  const [selectedPrompt, setSelectedPrompt] = useAtom(selectedPromptAtom)
  const [context, setContext] = useAtom(contextAtom)
  const [prompt, setPrompt] = useAtom(promptAtom)
  const [responseMessage, setResponseMessage] = useAtom(responseMessageAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const [isShowElement, setIsShowElement] = useAtom(isShowElementAtom)
  const [notification, setNotification] = useAtom(notificationAtom)
  const isFullMode = useAtomValue(isFullModeAtom)
  const [selectedElement, setSelectedElement] = useAtom(selectedElementAtom)
  const [isShowToast, setIsShowToast] = useAtom(isShowToastAtom)

  const streamPort = chrome.runtime.connect({ name: "stream" })

  // when press ESC will hidden the  window
  const handleEscape = (event: any) => {
    if (event.key === "Escape") {
      setIsShowElement(false)
    }
  }

  streamPort.onMessage.addListener(function (msg) {
    if (msg === "[DONE]") {
      setIsLoading(false)
    } else {
      setResponseMessage(msg)
    }
  })

  // init on page load
  useEffect(() => {
    // set default engine
    storage.get(ConstEnum.DEFAULT_ENGINE).then(val => setEngine(val))
    storage.get(ConstEnum.NOTION_SPACE_ID).then(val => setNotionSpaceId(val))
    storage.get(ConstEnum.OPENAI_API_KEY).then(val => setOpenAIAPIKey(val))
    storage.get(ConstEnum.OPENAI_API_HOST).then(val => setOpenAIAPIHost(val))

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
      // console.log("select text from input")
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
    if (isLoading) {
      handleToast("AI is processing, please wait")
      return
    }
    setIsLoading(true)

    let lprompt: string = ""
    let language: string = ""
    let tone: string = ""

    const prompts = selectedPrompt.value.split("-")
    let promptType = prompts[0]
    if (promptType === PromptTypeEnum.Translate) {
      language = prompts[1]
    } else if (promptType === PromptTypeEnum.ChangeTone) {
      tone = prompts[1]
    } else if (promptType === PromptTypeEnum.TopicWriting) {
      setPrompt(prompts[1])
      lprompt = prompts[1]
    } else if (promptType === PromptTypeEnum.AskAI) {
      lprompt = PromptTypeEnum.AskAI
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
      chatGPTAPIKey: openAIAPIKey,
      chatGPTAPIHost: openAIAPIHost
    }

    streamPort.postMessage(body)
    // // wait 3 seconds
    // await new Promise((resolve) => setTimeout(resolve, 5000))
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
            className={`fixed  ${isFullMode
              ? " h-5/6 w-11/12 top-10 left-10"
              : "top-1/3 right-10 w-1/3 h-1/2"
              } overflow-hidden rounded-lg flex flex-col bg-slate-200 dark:bg-slate-700`}>
            <InputContext.Provider
              value={{
                handleMessage,
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

              {responseMessage && <OutputComponent />}
              {responseMessage && <OutputComponent />}
            {responseMessage && <OutputComponent />}
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
