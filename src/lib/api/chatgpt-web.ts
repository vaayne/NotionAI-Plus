import { v4 as uuidv4 } from "uuid"

import type { PlasmoMessaging } from "@plasmohq/messaging"

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
  if (resp.status === 403) {
    return "403 FORBIDDEN"
  }
  const data = await resp.json().catch(() => ({}))
  if (!data.accessToken) {
    return "401 UNAUTHORIZED"
  }
  await storage.set(CACHE_KEY_TOKEN, data.accessToken)
  return data.accessToken
}

async function PostChatGPTStream(
  prompt: string,
  res: PlasmoMessaging.Response<any>
) {
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

  let conversationId: string = ""

  if (resp.status == 200) {
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
          res.send(text)
          conversationId = data.conversation_id
        }
      } catch (err) {
        console.error(err)
        res.send(err)
        return
      }
    })
  } else {
    res.send(resp.statusText)
  }
}

async function removeConversation(id: string) {
  const accessToken = await getAccessToken()
  try {
    const resp = await fetch(`${CHATGPT_HOST}/backend-api/conversation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        is_visible: false
      })
    })
    console.log(await resp.json())
  } catch (err) {
    console.error(err)
  }
}

export { PostChatGPTStream }