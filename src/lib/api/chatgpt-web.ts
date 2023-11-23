import { v4 as uuidv4 } from "uuid"

import { storage } from "~lib/state"
import { parseSSEResponse } from "~lib/utils/sse"

const CHATGPT_MODEL = "text-davinci-002-render-sha"
const CHATGPT_HOST = "https://chat.openai.com"

const CACHE_KEY_TOKEN = "chatgpt-token"
const CACHE_KEY_CONVERSATION_ID = "chatgpt-conversation-id"

async function getAccessToken() {
  const resp = await fetch(`${CHATGPT_HOST}/api/auth/session`)
  if (resp.ok) {
    const data = await resp.json()
    if (data.accessToken) {
      await storage.set(CACHE_KEY_TOKEN, data.accessToken)
      return
    }
  }
  throw new Error(`${resp.status}, Please login to https://chat.openai.com/`)
}

async function ChatGPTWebChat(prompt: string, port: chrome.runtime.Port) {
  try {
    return await chat(prompt, port)
  } catch (err) {
    console.error(err)
    port.postMessage(err.message)
  }
}

async function chat(prompt: string, port: chrome.runtime.Port) {
  const cacheConversationId = await storage.get(CACHE_KEY_CONVERSATION_ID)
  if (!cacheConversationId) {
    await storage.set(CACHE_KEY_CONVERSATION_ID, uuidv4())
  }

  const data = {
    action: "next",
    messages: [
      {
        id: uuidv4(),
        author: { role: "user" },
        content: { content_type: "text", parts: [prompt] },
        metadata: {}
      }
    ],
    conversation_id: null,
    parent_message_id: cacheConversationId,
    model: CHATGPT_MODEL,
    timezone_offset_min: -480,
    suggestions: [],
    history_and_training_disabled: false,
    arkose_token: null,
    conversation_mode: {
      kind: "primary_assistant"
    },
    force_paragen: false,
    force_rate_limit: false
  }

  const url = `${CHATGPT_HOST}/backend-api/conversation`

  const sendRequest = async (): Promise<Response> => {
    const accessToken = await storage.get(CACHE_KEY_TOKEN)
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    })
  }

  let resp = await sendRequest()

  if (resp.status === 401 || resp.status === 403) {
    try {
      await getAccessToken()
      resp = await sendRequest()
    } catch (err) {
      console.error(err)
      port.postMessage(err.message)
      return
    }
  }

  let conversationId: string = ""

  await parseSSEResponse(resp, (message) => {
    if (message === "[DONE]") {
      // console.debug("chatgpt sse message done, start remove conversation")
      removeConversation(conversationId)
      port.postMessage("[DONE]")
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
  const accessToken = await storage.get(CACHE_KEY_TOKEN)
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
