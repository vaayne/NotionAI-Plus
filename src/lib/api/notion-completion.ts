import { v4 as uuidv4 } from "uuid"

import { PromptTypeEnum } from "~lib/enums"
import { processNdjsonResp } from "~lib/utils/ndjson"

const MODEL = "openai-3"
const HOST = "https://www.notion.so"

async function complation(
  port: chrome.runtime.Port,
  promptType: string,
  context: string,
  notionSpaceId: string,
  prompt?: string,
  language?: string,
  tone?: string
) {
  const url = `${HOST}/api/v3/getCompletion`
  const data = {
    id: uuidv4(),
    model: MODEL,
    spaceId: notionSpaceId,
    isSpacePermission: false,
    context: {}
  }

  if (promptType === PromptTypeEnum.Translate) {
    data.context = {
      type: "translate",
      text: context,
      language: language
    }
  } else if (promptType === PromptTypeEnum.ChangeTone) {
    data.context = {
      type: promptType,
      text: context,
      tone: tone
    }
  } else if (promptType === PromptTypeEnum.TopicWriting) {
    data.context = {
      type: prompt,
      topic: context,
      pageContent: ""
    }
  } else if (promptType === PromptTypeEnum.ContinueWriting) {
    data.context = {
      type: promptType,
      previousContent: context
    }
  } else {
    data.context = {
      type: promptType,
      selectedText: context
    }
  }
  // console.log(`request body: ${JSON.stringify(data)}`)
  let headers = {
    "Content-Type": "application/json",
    accept: "application/x-ndjson"
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  })

  if (!resp.ok) {
    const errMsg = `NotionAI return error, status: ${resp.status}`
    console.error(errMsg)
    throw new Error(errMsg)
  }
  let fullMessage: string = ""
  const onMessage = (msg: any) => {
    // console.log(`msg: ${JSON.stringify(msg)}`)
    if (msg.type == "success") {
      fullMessage += msg.completion
      port.postMessage(fullMessage)
    } else {
      port.postMessage(msg.completion)
    }
  }
  await processNdjsonResp(resp, onMessage)
}

async function NotionCompletion(
  port: chrome.runtime.Port,
  promptType: string,
  context: string,
  notionSpaceId: string,
  prompt?: string,
  language?: string,
  tone?: string
): Promise<string> {
  if (!notionSpaceId) {
    port.postMessage("Please set notionSpaceId in options page")
    return
  }
  let message = ""
  for (let i = 0; i < 3; i++) {
    try {
      await complation(
        port,
        promptType,
        context,
        notionSpaceId,
        prompt,
        language,
        tone
      )
      return
    } catch (err) {
      console.error(err)
      message = err.message
    }
  }
  port.postMessage(message)
}

export { NotionCompletion }
