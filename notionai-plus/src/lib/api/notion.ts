import { type } from "os"
import { v4 as uuidv4 } from "uuid"

import { PromptTypeEnum } from "~lib/enums"

const MODEL = "openai-3"
const HOST = "https://www.notion.so"

async function PostNotion(
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
      type: "helpMeWrite",
      prompt: prompt,
      previousContent: context
    }
  } else if (promptType === PromptTypeEnum.ChangeTone) {
    data.context = {
      type: "changeTone",
      text: context,
      tone: tone
    }
  } else if (promptType === PromptTypeEnum.TopicWriting) {
    data.context = {
      type: prompt,
      topic: context,
      pageContent: ""
    }
  } else {
    data.context = {
      type: promptType,
      selectedText: context
    }
  }
  console.log(`request body: ${JSON.stringify(data)}`)
  let headers = {
    "Content-Type": "application/json"
  }
  console.log(`request headers: ${JSON.stringify(headers)}`)
  console.log(`request url: ${url}`)
  console.log(`request data: ${JSON.stringify(data)}`)

  const resp = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  })

  if (resp.status == 200) {
    let resData = await resp.text()
    if (!resData || resData === "" || resData === "[]") {
      return "Get response error, empty response"
    }
    let rData = resData.match(/.+/g).map((tmp) => JSON.parse(tmp))
    // console.log(rData)

    const texts = rData.map((tmp) => {
      return tmp.type == "success" ? tmp.completion : tmp.message
    })
    // console.log(texts)
    return texts.join("").trim()
  } else {
    console.log(`fail: ${resp.status}`)
    return await resp.text()
  }
}

export type NotionSpace = {
  id: string
  name: string
}

async function GetSpaces() {
  const url = `${HOST}/api/v3/getSpaces`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (res.status == 200) {
    const data = (await res.json()) as Map<string, any>
    let spaces: NotionSpace[] = []

    for (const [key, value] of Object.entries(data)) {
      const sdata = value.space
      for (const [skey, svalue] of Object.entries(sdata)) {
        const space = svalue.value as NotionSpace
        spaces.push({
          id: space.id,
          name: space.name
        })
      }
    }
    console.log(
      `get notion spaces success: ${spaces.length} spaces, ${JSON.stringify(
        spaces
      )}}`
    )
    return spaces
  } else {
    console.log(`get notion spaces failed: ${res.status}`)
    return []
  }
}

export { PostNotion, GetSpaces }
