import type { PlasmoMessaging } from "@plasmohq/messaging"

import { parseSSEResponse } from "~lib/utils/sse"

const MODEL = "gpt-3.5-turbo"

type ChatGPTResponseChoice = {
  index: number
  message: {
    role: string
    content: string
  }
  finish_reason: string
}

type ChatGPTResponseUsgae = {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

type ChatGPTResponse = {
  id: string
  object: string
  created: number
  choices: ChatGPTResponseChoice[]
  usage: ChatGPTResponseUsgae
}

async function ChatStream(
  url: string,
  instraction: string,
  prompt: string,
  api_key: string,
  res: PlasmoMessaging.Response<any>
) {
  if (api_key == "") {
    return "Please set your OpenAI API key in the extension options page."
  }
  const data = {
    model: MODEL,
    stream: true,
    messages: [
      { role: "system", content: instraction },
      { role: "user", content: prompt }
    ]
  }
  console.log(`ChatGPTAPI request: ${JSON.stringify(data)}`)

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`
    },
    body: JSON.stringify(data)
  })
  let content: string

  if (resp.status == 200) {
    await parseSSEResponse(resp, (message) => {
      if (message === "[DONE]") {
        return
      }

      try {
        const data = JSON.parse(message)
        // console.log(content)
        if (data?.choices?.length) {
          const delta = data.choices[0].delta
          if (delta?.content) {
            content += delta.content
            res.send(content)
          }
        }
      } catch (err) {
        console.error(err)
        res.send(err)
        return
      }
    })
  } else {
    res.send(`ChatGPT return error, status: ${resp.status}`)
  }
}

export { ChatStream }
