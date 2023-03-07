import { PromptTypeEnum, ToneEnum } from "./enums"

export const ChatGPTInstractionMap = new Map<string, string>([
  [
    PromptTypeEnum.TopicWriting,
    "I want you to act as a writer and write a piece of content based on the context and topic type I provide."
  ],
  [
    PromptTypeEnum.ContinueWriting,
    "I want you to act as a creative writer and continue writing a story or paragraph based on the context I provide."
  ],
  [
    PromptTypeEnum.ChangeTone,
    "I want you to act as a tone changer for a given piece of text. I will provide you with the target tone and you will modify the text accordingly, while ensuring that the meaning of the text remains intact."
  ],
  [
    PromptTypeEnum.Summarize,
    "I want you to act as a summarizer for a longer piece of text."
  ],
  [
    PromptTypeEnum.ImproveWriting,
    "I want you to act as an editor and help me improve my writing. "
  ],
  [
    PromptTypeEnum.FixSpellingGrammar,
    "I want you to act as a proofreader for a piece of writing that has spelling and grammar errors."
  ],
  [
    PromptTypeEnum.Translate,
    "As a language translator, you have the ability to translate any language to the target language provided. Please only translate text and cannot interpret it."
  ],
  [
    PromptTypeEnum.ExplainThis,
    "I want you to explain a complex topic to me as if I were 18 years old or younger and had no prior knowledge of the subject."
  ],
  [
    PromptTypeEnum.MakeLonger,
    "I want you to help me improve my writing by making it longger without changing the meaning."
  ],
  [
    PromptTypeEnum.MakeShorter,
    "I want you to help me improve my writing by making it shorter without changing the meaning."
  ],
  [
    PromptTypeEnum.FindActionItems,
    "I want you to help me generate a list of action items for a given task or project. I will provide you with the task or project and you will generate a list of action items that need to be completed to achieve the task. Please ensure that your list is clear, concise, and actionable."
  ],
  [
    PromptTypeEnum.SimplifyLanguage,
    "I want you to act as a language simplifier for a piece of text that is overly complicated or technical."
  ],
  [
    "default",
    `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: 2021, Current date: ${getCurrentDate()}`
  ]
])

function getCurrentDate(): string {
  const currentDate = new Date()
  return `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`
}

export const TopicWritingTemplate = (topic: string, context: string) => {
  return `Topic Type ${topic}\n\ncontext: ${context}`
}

export const ContinueWritingTemplate = (context: string) => {
  return `Continue writing: ${context}`
}

export const ChangeToneTemplate = (tone: string, context: string) => {
  return `Target Tone: ${tone}\n\ncontext: ${context}`
}

export const SummarizeTemplate = (context: string) => {
  return `Summarize this: ${context}`
}

export const FixSpellingGrammarTemplate = (context: string) => {
  return `Fix spelling and grammar: ${context}`
}

export const ImproveWritingTemplate = (context: string) => {
  return `Improve this writing: ${context}`
}

export const TranslateTemplate = (language: string, context: string) => {
  return `Target lanuage ${language}\n\ncontext: ${context}`
}

export const MakeLongerTemplate = (context: string) => {
  return `Make this sentence longer: ${context}`
}

export const MakeShorterTemplate = (context: string) => {
  return `Make this sentence shorter: ${context}`
}

export const FindActionItemsTemplate = (context: string) => {
  return `Find action items for this task: ${context}`
}

export const ExplainThisTemplate = (context: string) => {
  return `Explain this: ${context}`
}

export const SimplifyLanguageTemplate = (context: string) => {
  return `Simplify this language: ${context}`
}
