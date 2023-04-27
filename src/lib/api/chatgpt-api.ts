import { ofetch } from "ofetch"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { parseSSEResponse } from "~lib/utils/sse"

const MODEL = "gpt-3.5-turbo"

async function chat(
  url: string,
  instraction: string,
  prompt: string,
  api_key: string,
  res: PlasmoMessaging.Response<any>
) {
  const data = {
    model: MODEL,
    stream: true,
    messages: [
      { role: "system", content: instraction },
      { role: "user", content: prompt }
    ]
  }
  const resp = await ofetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`
    },
    body: JSON.stringify(data)
  })
  let content: string = ""

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
}

async function ChatStream(
  url: string,
  instraction: string,
  prompt: string,
  api_key: string,
  res: PlasmoMessaging.Response<any>
) {
  console.log(`ChatStream: ${url}, ${instraction}, ${prompt}, ${api_key}`)
  if (!api_key) {
    res.send("Please set your OpenAI API key in the extension options page.")
    return
  }
  let message = ""
  for (let i = 0; i < 3; i++) {
    try {
      await chat(url, instraction, prompt, api_key, res)
      return
    } catch (err) {
      console.error(err)
      message = err.message
    }
  }
  res.send(message)
}

export { ChatStream }
