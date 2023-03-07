import { v4 as uuidv4 } from "uuid"

import { storage } from "~lib/storage"

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

async function PostChatGPT(prompt: string): Promise<string> {
  const accessToken = await getAccessToken()

  const cacheConversationId = await storage.get(CACHE_KEY_CONVERSATION_ID)
  if (!cacheConversationId) {
    await storage.set(CACHE_KEY_CONVERSATION_ID, uuidv4())
  }

  const data = {
    action: "next",
    conversation_id: uuidv4(),
    messages: [
      {
        author: {
          role: "user"
        },
        id: uuidv4(),
        role: "user",
        content: { content_type: "text", parts: [prompt] }
      }
    ],
    parent_message_id: cacheConversationId,
    model: CHATGPT_MODEL
  }
  // console.log(`ChatGPTWeb request: ${JSON.stringify(data)}`)
  const url = `${CHATGPT_HOST}/backend-api/conversation`
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(data)
  })

  if (resp.status == 200) {
    return parseChatGPTResponse(await resp.text())
  }
  if (resp.status == 403 || resp.status == 401) {
    await storage.remove(CACHE_KEY_TOKEN)
    return "ChatGPT return 403 FORBIDDEN, please login in to https://chat.openai.com"
  } else {
    console.log(`fail: ${resp.text}`)
    return `ChatGPT return error, please retry, status: ${resp.status}, error: ${resp.text}`
  }
}

function parseChatGPTResponse(data: string) {
  const texts = data.split("\n")
  let res = ""
  for (let text of texts) {
    try {
      const tmp = JSON.parse(text.slice(6))
      res = tmp.message.content.parts[0]
    } catch (error) {
      // console.log(`parse error, data: ${text} error: ${error}`);
    }
  }
  return res
}

export { PostChatGPT }
