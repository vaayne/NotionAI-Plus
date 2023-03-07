import type { PlasmoMessaging } from "@plasmohq/messaging"

import { PostChatGPT } from "~lib/api/chatgpt"
import { Chat } from "~lib/api/chatgptapi"
import { PostNotion } from "~lib/api/notion"
import { Parse } from "~lib/api/readability"
import { EngineEnum, ProcessTypeEnum, PromptTypeEnum } from "~lib/enums"
import {
  ChangeToneTemplate,
  ChatGPTInstractionMap,
  ContinueWritingTemplate,
  ExplainThisTemplate,
  FindActionItemsTemplate,
  FixSpellingGrammarTemplate,
  ImproveWritingTemplate,
  MakeLongerTemplate,
  MakeShorterTemplate,
  SummarizeTemplate,
  TopicWritingTemplate,
  TranslateTemplate
} from "~lib/prompt-enums"

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

function buildChatGPTinstruction(body: RequestBody): string {
  let instruction: string = ChatGPTInstractionMap.get("default")
  if (body.builtinPrompt) {
    instruction = ChatGPTInstractionMap.get(body.builtinPrompt)
  }
  return instruction
}

function buildChatGPTPrompt(body: RequestBody): string {
  let prompt: string
  if (body.builtinPrompt) {
    switch (body.builtinPrompt) {
      case PromptTypeEnum.TopicWriting:
        prompt = TopicWritingTemplate(body.customPromot, body.context)
        break
      case PromptTypeEnum.ContinueWriting:
        prompt = ContinueWritingTemplate(body.context)
        break
      case PromptTypeEnum.ChangeTone:
        prompt = ChangeToneTemplate(body.tone, body.context)
        break
      case PromptTypeEnum.Summarize:
        prompt = SummarizeTemplate(body.context)
        break
      case PromptTypeEnum.FixSpellingGrammar:
        prompt = FixSpellingGrammarTemplate(body.context)
        break
      case PromptTypeEnum.ImproveWriting:
        prompt = ImproveWritingTemplate(body.context)
        break
      case PromptTypeEnum.Translate:
        prompt = TranslateTemplate(body.language, body.context)
        break
      case PromptTypeEnum.MakeLonger:
        prompt = MakeLongerTemplate(body.context)
        break
      case PromptTypeEnum.MakeShorter:
        prompt = MakeShorterTemplate(body.context)
        break
      case PromptTypeEnum.FindActionItems:
        prompt = FindActionItemsTemplate(body.context)
        break
      case PromptTypeEnum.ExplainThis:
        prompt = ExplainThisTemplate(body.context)
        break
      default:
        prompt = body.customPromot
    }
  } else {
    prompt = body.customPromot
  }

  return prompt
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let message: string

  const body = req.body as RequestBody
  const instruction: string = buildChatGPTinstruction(body)
  const prompt: string = buildChatGPTPrompt(body)
  // console.log(`request body: ${JSON.stringify(body)}`)

  if (body.processType === ProcessTypeEnum.Page) {
    // summary page article or vedio
    try {
      const data = await Parse(req.body.url)
      switch (body.engine) {
        case EngineEnum.ChatGPTWeb:
          message = await PostChatGPT(
            `${instruction}\n\n${SummarizeTemplate(data.content)}`
          )
          break
        case EngineEnum.ChatGPTAPI:
          message = await Chat(
            instruction,
            SummarizeTemplate(data.content),
            body.chatGPTAPIKey
          )
          break
        case EngineEnum.NotionAI:
          message = await PostNotion(
            body.builtinPrompt,
            data.content,
            body.notionSpaceId,
            body.customPromot,
            body.language,
            body.tone
          )
          break
      }
    } catch (error) {
      message = error
    }
  } else {
    console.log(`instruction: ${instruction}, prompt: ${prompt}`)
    switch (body.engine) {
      case EngineEnum.ChatGPTWeb:
        message = await PostChatGPT(`${instruction}\n\n${prompt}`)
        break
      case EngineEnum.ChatGPTAPI:
        message = await Chat(instruction, prompt, body.chatGPTAPIKey)
        break
      case EngineEnum.NotionAI:
        message = await PostNotion(
          body.builtinPrompt,
          body.context,
          body.notionSpaceId,
          body.customPromot,
          body.language,
          body.tone
        )
        break
    }
  }
  res.send({
    message
  })
}

export default handler
