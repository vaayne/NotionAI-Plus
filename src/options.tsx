import { sendToBackground } from "@plasmohq/messaging"
import {
	Button,
	Heading,
	Link,
	RadioGroup,
	Select,
	Separator,
	Text,
	TextField,
	Theme,
} from "@radix-ui/themes"
import "~style.css"
import "@radix-ui/themes/styles.css"
import { useAtom } from "jotai"
import { Github, Twitter } from "lucide-react"
import { useState } from "react"
import type { NotionSpace } from "~lib/api/notion-space"
import { ConstEnum, EngineEnum, EngineMappings } from "~lib/enums"
import {
	chatGPTModelAtom,
	engineAtom,
	notionSpaceIdAtom,
	notionSpacesAtom,
	openAIAPIHostAtom,
	openAIAPIKeyAtom,
	openAIAPIModelAtom,
	storage,
} from "~lib/state"

const SETTING_GENERAL = "General"
const SETTING_CONTACT_US = "Contact Us"

const GITHUB_URL = "https://github.com/Vaayne/NotionAI-Plus"
const TWITTER_URL = "https://twitter.com/LiuVaayne"
const DEFAULT_OPENAI_API_URL = "https://api.openai.com/v1/chat/completion"
const CHATGPT_URL = "https://chat.openai.com"
const NOTION_URL = "https://www.notion.so"
const GOOGLE_BARD_URL = "https://bard.google.com"
const CLAUDE_AI_URL = "https://claude.ai/chats"

// Helper Functions
const settingNameToId = (name: string) => {
	return name.toLowerCase().replace(" ", "-")
}

const settingNameToIdComponent = (engineId: EngineEnum) => {
	return (
		<Text size="4" weight="bold" align="left" as="div">
			<RadioGroup.Item value={engineId} /> {EngineMappings[engineId]}
		</Text>
	)
}

const engineDescriptionComponent = (engineId: EngineEnum, url: string) => {
	return (
		<Text as="p" size="2" mt="-4" ml="4">
			You must remain logged in to your {EngineMappings[engineId]} account
			on the{" "}
			<Link weight="medium" underline="always" target="_blank" href={url}>
				{url}.
			</Link>
		</Text>
	)
}

function Options() {
	const [settingId, setSettingId] = useState("general")
	const [notionSpaceId, setNotionSpaceId] = useAtom(notionSpaceIdAtom)
	const [notionSpaces, setNotionSpaces] = useAtom(notionSpacesAtom)
	const [openAIAPIKey, setOpenAIAPIKey] = useAtom(openAIAPIKeyAtom)
	const [openAIAPIHost, setOpenAIAPIHost] = useAtom(openAIAPIHostAtom)
	const [openAIAPIModel, setOpenAIAPIModel] = useAtom(openAIAPIModelAtom)
	const [chatGPTModel, setChatGPTModel] = useAtom(chatGPTModelAtom)
	const [engine, setEngine] = useAtom(engineAtom)

	storage.watch({
		[ConstEnum.DEFAULT_ENGINE]: c => setEngine(c.newValue),
		[ConstEnum.NOTION_SPACE_ID]: c => setNotionSpaceId(c.newValue),
		[ConstEnum.NOTION_SPACES]: c => setNotionSpaces(c.newValue),
		[ConstEnum.OPENAI_API_HOST]: c => setOpenAIAPIHost(c.newValue),
		[ConstEnum.OPENAI_API_KEY]: c => setOpenAIAPIKey(c.newValue),
		[ConstEnum.OPENAI_API_MODEL]: c => setOpenAIAPIModel(c.newValue),
		[ConstEnum.CHATGPT_MODEL]: c => setChatGPTModel(c.newValue),
	})

	const saveToStorage = async (key: string, val: any) => {
		await storage.set(key, val)
	}

	const handleGetNotionSpaces = async () => {
		const response = await sendToBackground({
			name: "get-notion-spaces",
			body: {},
		})
		alert(response)
	}

	const notionAISettings = () => {
		return (
			<div className="flex flex-row items-center justify-between gap-4 mx-2">
				<Text as="span">NotionAI Workspace:</Text>

				<Select.Root
					value={notionSpaceId}
					onValueChange={e =>
						saveToStorage(ConstEnum.NOTION_SPACE_ID, e)
					}
				>
					<Select.Trigger className="max-w-lg grow" />
					<Select.Content>
						{JSON.parse(notionSpaces)?.map((space: any) => {
							space = space as NotionSpace
							return (
								<Select.Item value={space.id} key={space.id}>
									{space.name}
								</Select.Item>
							)
						})}
					</Select.Content>
				</Select.Root>
				<Button onClick={async () => handleGetNotionSpaces()}>
					Get Spaces
				</Button>
			</div>
		)
	}

	const chatGPTSettings = () => {
		return (
			<div className="flex flex-row items-center justify-between gap-4 mx-2">
				<Text as="span">ChatGPT Model:</Text>
				<Select.Root
					defaultValue="text-davinci-002-render-sha"
					value={chatGPTModel}
					onValueChange={e =>
						saveToStorage(ConstEnum.CHATGPT_MODEL, e)
					}
				>
					<Select.Trigger className="max-w-lg grow" />
					<Select.Content>
						<Select.Item value="text-davinci-002-render-sha">
							GPT-3.5
						</Select.Item>
						<Select.Item value="gpt-4">GPT-4</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		)
	}

	const openaiAPISettings = () => {
		return (
			<div className="flex flex-col justify-between gap-3">
				<div className="flex flex-row justify-between gap-4 mx-2">
					<Text as="span" weight="medium">
						API URL:
					</Text>
					<TextField.Root className="max-w-lg grow">
						<TextField.Input
							placeholder={`OpenAI API URL, default: ${DEFAULT_OPENAI_API_URL}`}
							defaultValue={DEFAULT_OPENAI_API_URL}
							value={openAIAPIHost}
							onChange={e =>
								saveToStorage(
									ConstEnum.OPENAI_API_HOST,
									e.target.value
								)
							}
						/>
					</TextField.Root>
				</div>
				<div className="flex flex-row justify-between gap-4 mx-2">
					<Text as="span" weight="medium">
						API Key:
					</Text>
					<TextField.Root className="max-w-lg grow">
						<TextField.Input
							placeholder="Please enter the API key"
							type="password"
							value={openAIAPIKey}
							onChange={e => {
								saveToStorage(
									ConstEnum.OPENAI_API_KEY,
									e.target.value
								)
							}}
						/>
					</TextField.Root>
				</div>
				<div className="flex flex-row items-center justify-between gap-4 mx-2">
					<Text as="span" weight="medium">
						API Model:
					</Text>
					<Select.Root
						value={openAIAPIModel}
						defaultValue="gpt-3dot5-turbo"
						onValueChange={e => {
							saveToStorage(ConstEnum.OPENAI_API_MODEL, e)
						}}
					>
						<Select.Trigger className="max-w-lg grow" />
						<Select.Content>
							<Select.Group>
								<Select.Label>GPT-3.5</Select.Label>
								<Select.Item value="gpt-3dot5-turbo">
									GPT-3.5-Turbo
								</Select.Item>
								<Select.Item value="gpt-3dot5-16k">
									GPT-3.5-16K
								</Select.Item>
							</Select.Group>
							<Select.Separator />
							<Select.Group>
								<Select.Label>GPT-4</Select.Label>
								<Select.Item value="gpt-4">GPT-4</Select.Item>
								<Select.Item value="gpt-4-32k">
									GPT-4-32K
								</Select.Item>
								<Select.Item value="gpt-4-turbo">
									GPT-4-Turbo
								</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		)
	}

	const selectEngineComponent = () => {
		return (
			<div className="flex flex-col flex-grow p-4 m-4 align-top rounded-lg bg-background-200">
				<Heading as="h1" size="8" mx="2" my="4">
					General
				</Heading>
				<Separator my="3" size="4" />
				<Heading m="2" size="6">
					Set Default Engine for NotionAI Plus
				</Heading>
				<div className="flex-grow p-6 my-4 rounded-lg bg-background-200">
					<RadioGroup.Root
						value={engine}
						onValueChange={e => {
							saveToStorage(ConstEnum.DEFAULT_ENGINE, e)
						}}
					>
						<div className="flex flex-col gap-6">
							{settingNameToIdComponent(EngineEnum.OpenAIAPI)}
							{engine == EngineEnum.OpenAIAPI &&
								openaiAPISettings()}

							{settingNameToIdComponent(EngineEnum.ChatGPT)}
							{engineDescriptionComponent(
								EngineEnum.ChatGPT,
								CHATGPT_URL
							)}
							{engine == EngineEnum.ChatGPT && chatGPTSettings()}

							{settingNameToIdComponent(EngineEnum.NotionAI)}
							{engineDescriptionComponent(
								EngineEnum.NotionAI,
								NOTION_URL
							)}
							{engine == EngineEnum.NotionAI &&
								notionAISettings()}

							{settingNameToIdComponent(EngineEnum.GoogleBard)}
							{engineDescriptionComponent(
								EngineEnum.GoogleBard,
								GOOGLE_BARD_URL
							)}

							{settingNameToIdComponent(EngineEnum.Claude)}
							{engineDescriptionComponent(
								EngineEnum.Claude,
								CLAUDE_AI_URL
							)}
						</div>
					</RadioGroup.Root>
				</div>
			</div>
		)
	}

	const contactUsComponet = () => {
		return (
			<div className="flex flex-col justify-start flex-grow gap-4 p-8 m-4 rounded-lg bg-background-200">
				<div className="flex gap-1">
					<Github color="blue" />
					<Text weight="bold">
						Github:
						<Link
							href={GITHUB_URL}
							target="_blank"
							weight="regular"
							mx="2"
						>
							{GITHUB_URL}
						</Link>
					</Text>
				</div>

				<div className="flex gap-1">
					<Twitter color="blue" />
					<Text weight="bold">
						Twitter:
						<Link
							href={TWITTER_URL}
							target="_blank"
							weight="regular"
							mx="2"
						>
							{TWITTER_URL}
						</Link>
					</Text>
				</div>
			</div>
		)
	}

	const settingTitle = (name: string) => {
		const localSettingId = settingNameToId(name)
		return (
			<Button
				size="3"
				onClick={() => {
					setSettingId(localSettingId)
				}}
				value={settingId}
				variant={settingId == localSettingId ? "surface" : "ghost"}
				className="w-full"
			>
				<Text
					as="p"
					size="6"
					m="2"
					align="left"
					color="gray"
					className="w-full"
				>
					{name}
				</Text>
			</Button>
		)
	}

	return (
		<Theme>
			<div className="flex flex-row m-8 p-6 gap-6 justify-center min-w-[50vh] min-h-[75vh]">
				<div className="rounded-lg bg-background-200">
					<div className="flex flex-col items-start justify-between gap-4 p-4 m-4 rounded-lg bg-background-200">
						<Heading as="h1" size="8" my="4" mx="2">
							NotionAI Plus
						</Heading>
						{settingTitle(SETTING_GENERAL)}
						{settingTitle(SETTING_CONTACT_US)}
					</div>
				</div>
				<div className="flex flex-col justify-between flex-grow rounded-lg bg-gray-3">
					{settingId == settingNameToId(SETTING_GENERAL) &&
						selectEngineComponent()}
					{settingId == settingNameToId(SETTING_CONTACT_US) &&
						contactUsComponet()}
				</div>
			</div>
		</Theme>
	)
}

export default Options
