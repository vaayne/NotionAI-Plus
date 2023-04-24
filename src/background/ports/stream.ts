import type { PlasmoMessaging } from "@plasmohq/messaging"

import { Chat } from "~lib/api/chatgptapi"
import { PostChatGPTStream } from "~lib/api/chatgptstream"
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
  notionBoyAPIKey: string
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

function buildChatGPTinstruction(body: RequestBody): string {
  let instruction: string = ChatGPTInstractionMap.get("default")
  if (body.builtinPrompt) {
    instruction = ChatGPTInstractionMap.get(body.builtinPrompt)
  }
  return instruction
}

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const body = req.body as RequestBody
  const instruction: string = buildChatGPTinstruction(body)
  const prompt: string = buildChatGPTPrompt(body)
  // console.log(req)

  await PostChatGPTStream(`${instruction}\n\n${prompt}`, res)
}

export default handler
