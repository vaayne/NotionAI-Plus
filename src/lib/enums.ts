export enum ConstEnum {
  DEFAULT_ENGINE = "default-engine",
  NOTION_SPACE_ID = "notion-space-id",
  NOTION_SPACES = "notion-spaces",
  CHATGPT_API_KEY = "chatgpt-api-key",
  NOTIONBOY_API_KEY = "notionboy-api-key"
}

export enum EngineEnum {
  NotionAI = "notionAI",
  ChatGPTWeb = "chatGPTWeb",
  ChatGPTAPI = "chatGPTAPI",
  NotionBoy = "notionBoy",
  Bard = "bard",
  Bing = "bing"
}

export const EngineOptions: PromptType[] = [
  { label: "🤖 NotionAI", value: EngineEnum.NotionAI },
  { label: "💬 ChatGPTWeb", value: EngineEnum.ChatGPTWeb },
  { label: "💬 ChatGPTAPI", value: EngineEnum.ChatGPTAPI },
  { label: "🤖 NotionBoy", value: EngineEnum.NotionBoy },
  { label: "🎤 Bard", value: EngineEnum.Bard },
  { label: "🔎 Bing", value: EngineEnum.Bing }
]

export enum ProcessTypeEnum {
  Text = "text",
  Page = "page"
}

export interface PromptType {
  label: string
  value: string
}

export enum PromptTypeEnum {
  TopicWriting = "topicWriting",
  ContinueWriting = "continueWriting",
  ChangeTone = "changeTone",
  Summarize = "summarize",
  ImproveWriting = "improveWriting",
  FixSpellingGrammar = "fixSpellingGrammar",
  Translate = "translate",
  ExplainThis = "explainThis",
  MakeLonger = "makeLonger",
  MakeShorter = "makeShorter",
  FindActionItems = "findActionItems",
  SimplifyLanguage = "simplifyLanguage",
  AskAI = "askAI"
}

export const PromptTypeOptions: PromptType[] = [
  { label: "❓ Ask AI", value: PromptTypeEnum.AskAI },
  { label: "📝 Topic Writing", value: PromptTypeEnum.TopicWriting },

  { label: "🚀 Continue Writing", value: PromptTypeEnum.ContinueWriting },
  { label: "🎭 Change Tone", value: PromptTypeEnum.ChangeTone },
  { label: "📝 Summarize", value: PromptTypeEnum.Summarize },
  { label: "🔧 Improve Writing", value: PromptTypeEnum.ImproveWriting },
  {
    label: "📖 Fix Spelling/Grammar",
    value: PromptTypeEnum.FixSpellingGrammar
  },
  { label: "🌐 Translate", value: PromptTypeEnum.Translate },
  { label: "❓ Explain This", value: PromptTypeEnum.ExplainThis },
  { label: "📏 Make Longer", value: PromptTypeEnum.MakeLonger },
  { label: "📐 Make Shorter", value: PromptTypeEnum.MakeShorter },
  { label: "📋 Find Action Items", value: PromptTypeEnum.FindActionItems },
  { label: "🗣️ Simplify Language", value: PromptTypeEnum.SimplifyLanguage }
  //   { label: "🔪 Help Me Edit", value: PromptTypeEnum.HelpMeEdit }
]
export enum TopicEnum {
  brainstormIdeas = "brainstormIdeas",
  blogPost = "blogPost",
  outline = "outline",
  socialMediaPost = "socialMediaPost",
  pressRelease = "pressRelease",
  creativeStory = "creativeStory",
  essay = "essay",
  poem = "poem",
  meetingAgenda = "meetingAgenda",
  prosConsList = "prosConsList",
  jobDescription = "jobDescription",
  salesEmail = "salesEmail",
  recruitingEmail = "recruitingEmail"
}

export const TopicOptions: PromptType[] = [
  {
    label: "💡 Brainstorm Ideas",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.brainstormIdeas}`
  },
  {
    label: "📝 Blog Post",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.blogPost}`
  },
  {
    label: "📃 Outline",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.outline}`
  },
  {
    label: "📱 Social Media Post",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.socialMediaPost}`
  },
  {
    label: "🗞️ Press Release",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.pressRelease}`
  },
  {
    label: "📖 Creative Story",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.creativeStory}`
  },
  {
    label: "📝 Essay",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.essay}`
  },
  {
    label: "📝 Poem",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.poem}`
  },
  {
    label: "📅 Meeting Agenda",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.meetingAgenda}`
  },
  {
    label: "✅ Pros Cons List",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.prosConsList}`
  },
  {
    label: "🧑‍💼 Job Description",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.jobDescription}`
  },
  {
    label: "📧 Sales Email",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.salesEmail}`
  },
  {
    label: "📧 Recruiting Email",
    value: `${PromptTypeEnum.TopicWriting}-${TopicEnum.recruitingEmail}`
  }
]

export enum LanguageEnum {
  english = "english",
  korean = "korean",
  chinese = "chinese",
  japanese = "japanese",
  spanish = "spanish",
  russian = "russian",
  french = "french",
  german = "german",
  italian = "italian",
  portuguese = "portuguese",
  dutch = "dutch",
  indonesia = "indonesia",
  tagalog = "tagalog",
  vietnamese = "vietnamese"
}

export const LanguageOptions: PromptType[] = [
  {
    label: "🇺🇸 English",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.english}`
  },
  {
    label: "🇰🇷 Korean",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.korean}`
  },
  {
    label: "🇨🇳 Chinese",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.chinese}`
  },
  {
    label: "🇯🇵 Japanese",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.japanese}`
  },
  {
    label: "🇪🇸 Spanish",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.spanish}`
  },
  {
    label: "🇷🇺 Russian",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.russian}`
  },
  {
    label: "🇫🇷 French",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.french}`
  },
  {
    label: "🇩🇪 German",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.german}`
  },
  {
    label: "🇮🇹 Italian",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.italian}`
  },
  {
    label: "🇵🇹 Portuguese",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.portuguese}`
  },
  {
    label: "🇳🇱 Dutch",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.dutch}`
  },
  {
    label: "🇮🇩 Indonesian",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.indonesia}`
  },
  {
    label: "🇵🇭 Tagalog",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.tagalog}`
  },
  {
    label: "🇻🇳 Vietnamese",
    value: `${PromptTypeEnum.Translate}-${LanguageEnum.vietnamese}`
  }
]

export enum ToneEnum {
  professional = "professional",
  casual = "casual",
  straightforward = "straightforward",
  confident = "confident",
  friendly = "friendly"
}

export const ToneOptions: PromptType[] = [
  {
    label: "💼 Professional",
    value: `${PromptTypeEnum.ChangeTone}-${ToneEnum.professional}`
  },
  {
    label: "👤 Casual",
    value: `${PromptTypeEnum.ChangeTone}-${ToneEnum.casual}`
  },
  {
    label: "📝 Straightforward",
    value: `${PromptTypeEnum.ChangeTone}-${ToneEnum.straightforward}`
  },
  {
    label: "🦸 Confident",
    value: `${PromptTypeEnum.ChangeTone}-${ToneEnum.confident}`
  },
  {
    label: "👋 Friendly",
    value: `${PromptTypeEnum.ChangeTone}-${ToneEnum.friendly}`
  }
]

const allPromptTypes = [
  ...PromptTypeOptions,
  ...TopicOptions,
  ...LanguageOptions,
  ...ToneOptions
]

export function newPromptType(value: string): PromptType | undefined {
  return allPromptTypes.find((promptType) => promptType.value === value)
}
