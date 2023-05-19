import { BardChat } from "~lib/api/bard"
import { BingChat } from "~lib/api/bing"
import { ChatGPTApiChat } from "~lib/api/chatgpt-api"
import { ChatGPTWebChat } from "~lib/api/chatgpt-web"
import { NotionCompletion } from "~lib/api/notion-completion"
import { EngineEnum } from "~lib/enums"
import {
  RequestBody,
  buildChatGPTPrompt,
  buildChatGPTinstruction
} from "~lib/utils/prompt"

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
const NOTIONBOY_API_URL = "https://notionboy.theboys.tech/v1/chat/completions"

export default async function handleStream(
  body: RequestBody,
  port: chrome.runtime.Port
) {
  const instruction: string = buildChatGPTinstruction(body)
  const prompt: string = buildChatGPTPrompt(body)

  switch (body.engine) {
    case EngineEnum.ChatGPTWeb:
      await ChatGPTWebChat(`${instruction}\n\n${prompt}`, port)
      break
    case EngineEnum.Bing:
      await BingChat(`${instruction}\n\n${prompt}`, port)
      break
    case EngineEnum.ChatGPTAPI:
      await ChatGPTApiChat(
        OPENAI_API_URL,
        instruction,
        prompt,
        body.chatGPTAPIKey,
        port
      )
      break
    case EngineEnum.Bard:
      await BardChat(`${instruction}\n\n${prompt}`, port)
      break
    case EngineEnum.NotionBoy:
      await ChatGPTApiChat(
        NOTIONBOY_API_URL,
        instruction,
        prompt,
        body.notionBoyAPIKey,
        port
      )
      break
    case EngineEnum.NotionAI:
      await NotionCompletion(
        port,
        body.builtinPrompt,
        body.context,
        body.notionSpaceId,
        body.customPromot,
        body.language,
        body.tone
      )
  }
}
