import { PromptTypeEnum } from "~lib/enums"
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
	TranslateTemplate,
} from "~lib/prompt-enums"

export type RequestBody = {
	engine: string
	processType: string
	builtinPrompt: string
	customPromot: string
	context: string
	language: string
	tone: string
	notionSpaceId: string
	chatGPTAPIHost: string
	chatGPTAPIKey: string
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
			case PromptTypeEnum.AskAI:
				prompt = body.context
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

export { buildChatGPTPrompt, buildChatGPTinstruction }
