import { parseSSEResponse } from "~lib/utils/sse"

const MODEL = "gpt-3.5-turbo"

async function chat(
  url: string,
  instraction: string,
  prompt: string,
  api_key: string,
  port: chrome.runtime.Port
) {
  const data = {
    model: MODEL,
    stream: true,
    messages: [
      { role: "system", content: instraction },
      { role: "user", content: prompt }
    ]
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`
    },
    body: JSON.stringify(data)
  })

  if (!resp.ok) {
    const errMsg = `ChatGPTAPI return error, status: ${resp.status}`
    console.error(errMsg)
    throw new Error(errMsg)
  }

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
          port.postMessage(content)
        }
      }
    } catch (err) {
      console.error(err)
      port.postMessage(err.message)
      return
    }
  })
}

async function ChatGPTApiChat(
  url: string,
  instraction: string,
  prompt: string,
  api_key: string,
  port: chrome.runtime.Port
) {
  if (!api_key) {
    port.postMessage(
      "Please set your OpenAI API key in the extension options page."
    )
    return
  }
  let message = ""
  for (let i = 0; i < 3; i++) {
    try {
      await chat(url, instraction, prompt, api_key, port)
      return
    } catch (err) {
      console.error(err)
      message = err.message
    }
  }
  port.postMessage(message)
}

export { ChatGPTApiChat }
