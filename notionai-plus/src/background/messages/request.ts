import type { PlasmoMessaging } from "@plasmohq/messaging"

import { PostChatGPT } from "~lib/api/chatgpt"
import { Chat } from "~lib/api/chatgptapi"
import { PostNotion } from "~lib/api/notion"
import { Parse } from "~lib/api/readability"
import { EngineEnum, ProcessTypeEnum, PromptTypeEnum } from "~lib/enums"

type RequestBody = {
  engine: string
  processType: string
  builtinPrompt: string
  customPromot: string
  context: string
  language: string
  tone: string
  notionSpaceId: string
  chatGPTAPIKey: string
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let message: string

  const body = req.body as RequestBody

  if (body.processType === ProcessTypeEnum.Page) {
    // summary page article or vedio
    try {
      const data = await Parse(req.body.url)
      message = data.content
    } catch (error) {
      message = error
    }
  } else {
    // process text
    switch (body.engine) {
      case EngineEnum.ChatGPTWeb:
        message = await PostChatGPT(body.customPromot, body.context)
      case EngineEnum.ChatGPTAPI:
        message = await Chat(
          body.customPromot,
          body.context,
          body.chatGPTAPIKey
        )
      case EngineEnum.NotionAI:
        message = await PostNotion(
          body.builtinPrompt,
          body.context,
          body.notionSpaceId,
          body.customPromot,
          body.language,
          body.tone
        )
    }
  }
  res.send({
    message
  })
}

export default handler
