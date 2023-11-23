import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import Draggable from "react-draggable"

import { useMessage } from "@plasmohq/messaging/hook"

import { useAtom, useAtomValue } from "jotai"
import {
  contextAtom,
  isFullModeAtom,
  isLoadingAtom,
  isShowElementAtom,
  isShowToastAtom,
  notificationAtom,
  responseMessageAtom,
  selectedElementAtom,
  selectedPromptAtom
} from "~/lib/state"
import ComboxComponent from "~components/combobox"
import NotificationComponent from "~components/notification"
import { OutputComponent } from "~components/output"
import DividerComponent from "~components/toolbar"
import { ToolbarContext } from "~lib/context"
import {
  newPromptType
} from "~lib/enums"
import type { MessageBody } from "~lib/model"

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
  const [selectedPrompt, setSelectedPrompt] = useAtom(selectedPromptAtom)
  const [context, setContext] = useAtom(contextAtom)
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
            <ComboxComponent />

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
