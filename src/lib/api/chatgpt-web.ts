import { v4 as uuidv4 } from "uuid"

import { storage } from "~lib/storage"
import { parseSSEResponse } from "~lib/utils/sse"

const CHATGPT_MODEL = "text-davinci-002-render-sha"
const CHATGPT_HOST = "https://chat.openai.com"

const CACHE_KEY_TOKEN = "chatgpt-token"
const CACHE_KEY_CONVERSATION_ID = "chatgpt-conversation-id"

async function getAccessToken(): Promise<string> {
  const cacheToken = await storage.get(CACHE_KEY_TOKEN)
  if (cacheToken) {
    return cacheToken as string
  }

  const resp = await fetch(`${CHATGPT_HOST}/api/auth/session`)
  if (resp.status === 401 || resp.status === 403) {
    throw new Error(
      "401 UNAUTHORIZED, Please login to https://chat.openai.com/"
    )
  }
  if (!resp.ok) {
    throw new Error(`ChatGPT return error, status: ${resp.status}`)
  }

  const data = await resp.json()
  if (!data.accessToken) {
    throw new Error("401 UNAUTHORIZED")
  }
  await storage.set(CACHE_KEY_TOKEN, data.accessToken)
  return data.accessToken
}

async function ChatGPTWebChat(prompt: string, port: chrome.runtime.Port) {
  let message = ""
  for (let i = 0; i < 3; i++) {
    try {
      await chat(prompt, port)
      return
    } catch (err) {
      await storage.remove(CACHE_KEY_TOKEN)
      console.error(err)
      message = err.message
    }
  }
  port.postMessage(message)
}

async function chat(prompt: string, port: chrome.runtime.Port) {
  const accessToken = await getAccessToken()

  const cacheConversationId = await storage.get(CACHE_KEY_CONVERSATION_ID)
  if (!cacheConversationId) {
    await storage.set(CACHE_KEY_CONVERSATION_ID, uuidv4())
  }

  const data = {
    action: "next",
    conversation_id: undefined,
    messages: [
      {
        author: { role: "user" },
        id: uuidv4(),
        content: { content_type: "text", parts: [prompt] }
      }
    ],
    parent_message_id: cacheConversationId,
    model: CHATGPT_MODEL
  }
  const url = `${CHATGPT_HOST}/backend-api/conversation`
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(data)
  })

  if (!resp.ok) {
    const errMsg = `ChatGPT return error, status: ${resp.status}`
    console.error(errMsg)
    throw new Error(errMsg)
  }

  let conversationId: string = ""

  await parseSSEResponse(resp, (message) => {
    if (message === "[DONE]") {
      // console.debug("chatgpt sse message done, start remove conversation")
      removeConversation(conversationId)
      return
    }
    try {
      const data = JSON.parse(message)
      const text = data.message?.content?.parts?.[0]
      if (text) {
        // console.debug("chatgpt sse message", text)
        port.postMessage(text)
        conversationId = data.conversation_id
      }
    } catch (err) {
      console.error(err)
      port.postMessage(`ChatGPT return error, error: ${err.message}`)
      return
    }
  })
}

async function removeConversation(id: string) {
  const accessToken = await getAccessToken()
  try {
    await fetch(`${CHATGPT_HOST}/backend-api/conversation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        is_visible: false
      })
    })
    // console.log(await resp.json())
  } catch (err) {
    console.error(err)
  }
}

export { ChatGPTWebChat }
