import { v4 as uuidv4 } from "uuid"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { PromptTypeEnum } from "~lib/enums"
import { processNdjsonResp } from "~lib/utils/ndjson"

const MODEL = "openai-3"
const HOST = "https://www.notion.so"

async function PostNotionStream(
  res: PlasmoMessaging.Response<any>,
  promptType: string,
  context: string,
  notionSpaceId: string,
  prompt?: string,
  language?: string,
  tone?: string
): Promise<string> {
  if (!notionSpaceId) {
    return "Please set notionSpaceId in options page"
  }

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
  } else if (promptType === PromptTypeEnum.HelpMeWrite) {
    data.context = {
      type: promptType,
      prompt: prompt,
      previousContent: context
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
  let fullMessage: string = ""
  const onMessage = (msg: any) => {
    // console.log(`msg: ${JSON.stringify(msg)}`)
    if (msg.type == "success") {
      fullMessage += msg.completion
      res.send(fullMessage)
    } else {
      res.send(msg.completion)
    }
  }

  if (resp.status == 200) {
    await processNdjsonResp(resp, onMessage)
  } else {
    console.log(`fail: ${resp.status}`)
    res.send(resp.statusText)
  }
}

export { PostNotionStream }
