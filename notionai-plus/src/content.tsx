import cssText from "data-text:~style.css"
import { marked } from "marked"
import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import {
  LanguageOptions,
  PromptTypeEnum,
  PromptTypeOptions,
  ToneOptions,
  TopicOptions
} from "~lib/enums"
import { storage } from "~lib/storage"

import "~base.css"

import { useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>(
    PromptTypeEnum.ChatGPT
  )
  const [context, setContext] = useState<string>("")
  const [language, setLanguage] = useState<string>("")
  const [tone, setTone] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [responseMessage, setResponseMessage] = useState<string>("")

  const [notionToken] = useStorage<string>({
    key: "noiton-token",
    instance: storage
  })
  const [notionSpaceId] = useStorage<string>({
    key: "noiton-space-id",
    instance: storage
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const promptOptions = () => {
    if (selectedPrompt == PromptTypeEnum.Translate) {
      return (
        <select
          className="select select-primary w-full"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}>
          {LanguageOptions.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      )
    } else if (selectedPrompt == PromptTypeEnum.TopicWriting) {
      return (
        <select
          className="select select-primary w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}>
          {TopicOptions.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      )
    } else if (selectedPrompt == PromptTypeEnum.ChangeTone) {
      return (
        <select
          className="select select-primary w-full"
          value={tone}
          onChange={(e) => setTone(e.target.value)}>
          {ToneOptions.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      )
    } else if (
      selectedPrompt == PromptTypeEnum.HelpMeWrite ||
      selectedPrompt == PromptTypeEnum.ChatGPT
    ) {
      return (
        <input
          type="text"
          placeholder="Please type your prompt"
          className="input input-bordered input-primary w-full box-border px-2"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      )
    }
  }

  const sendMessage = async () => {
    setIsLoading(true)
    console.log(`
      selectedPrompt: ${selectedPrompt},
      prompt: ${prompt},
      context: ${context},
      language: ${language},
      tone: ${tone},
      notionToken: ${notionToken},
      notionSpaceId: ${notionSpaceId}
    `)
    setResponseMessage("Waitting for Notion AI...")
    const response = await sendToBackground({
      name: "request",
      body: {
        promptType: selectedPrompt,
        context: context,
        prompt: prompt,
        language: language,
        tone: tone,
        notionToken: notionToken,
        notionSpaceId: notionSpaceId
      }
    })
    console.log(response.message)
    setResponseMessage(response.message)
    setIsLoading(false)
  }

  const handleLoading = () => {
    if (isLoading) {
      return <progress className="progress w-56"></progress>
    }
    const html = marked(responseMessage)
    return (
      <div className="flex items-center justify-center overflow-auto">
        <article
          className="prose overflow-auto"
          dangerouslySetInnerHTML={{ __html: html }}></article>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col fixed top-10 bottom-20 right-1 w-1/2 max-w-3/4 min-h-96 bg-green-100">
        <textarea
          className="textarea textarea-primary"
          placeholder="Please enter your context"
          value={context}
          onChange={(e) => setContext(e.target.value)}></textarea>
        <div className="flex flex-row items-center">
          <select
            className="select select-primary w-1/3"
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}>
            {PromptTypeOptions.map((option) => {
              return <option value={option.value}>{option.label}</option>
            })}
          </select>
          <div className="flex-1">{promptOptions()}</div>
          <button
            className="btn btn-primary"
            onClick={() => {
              sendMessage()
            }}>
            Submit
          </button>
        </div>
        <div className="divider my-0"></div>
        <div className="flex flex-col h-full">
          <div className="p-0 m-0">
            <h3 className="p-0 m-0">NotionAI Says: </h3>
          </div>
          <div className="flex-1 px-4 py-2 overflow-auto">
            {handleLoading()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlasmoOverlay
