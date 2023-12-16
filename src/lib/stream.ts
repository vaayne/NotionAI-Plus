import { BardChat } from "~lib/api/bard"
import { BingChat } from "~lib/api/bing"
import OpenAIAPIChat from "~lib/api/openai-api"
import { ChatGPTWebChat } from "~lib/api/chatgpt-web"
import { NotionCompletion } from "~lib/api/notion-completion"
import { EngineEnum } from "~lib/enums"
import {
	buildChatGPTPrompt,
	buildChatGPTinstruction,
	type RequestBody,
} from "~lib/utils/prompt"

import { ClaudeChat } from "./api/claude"
import GoogleAIChat from "./api/google-ai"

export default async function handleStream(
	body: RequestBody,
	port: chrome.runtime.Port
) {
	const instruction: string = buildChatGPTinstruction(body)
	const prompt: string = buildChatGPTPrompt(body)

	switch (body.engine) {
		case EngineEnum.ChatGPT:
			await ChatGPTWebChat(
				`${instruction}\n\n${prompt}`,
				body.apiModel,
				port
			)
			break
		case EngineEnum.Bing:
			await BingChat(`${instruction}\n\n${prompt}`, port)
			break
		case EngineEnum.Claude:
			await ClaudeChat(`${instruction}\n\n${prompt}`, port)
			break
		case EngineEnum.OpenAIAPI:
			await OpenAIAPIChat(
				body.apiUrl,
				instruction,
				prompt,
				body.apiKey,
				body.apiModel,
				port
			)
			break
		case EngineEnum.GoogleAI:
			await GoogleAIChat(
				`${instruction}\n\n${prompt}`,
				body.apiUrl,
				body.apiKey,
				body.apiModel,
				port
			)
			break
		case EngineEnum.GoogleBard:
			await BardChat(`${instruction}\n\n${prompt}`, port)
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
