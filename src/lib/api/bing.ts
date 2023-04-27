import { random } from "lodash-es"
import { FetchError, ofetch } from "ofetch"
import { v4 as uuidv4 } from "uuid"
import WebSocketAsPromised from "websocket-as-promised"

import type { PlasmoMessaging } from "@plasmohq/messaging"

export enum BingConversationStyle {
  Creative = "creative",
  Balanced = "balanced",
  Precise = "precise"
}

export interface ConversationResponse {
  conversationId: string
  clientId: string
  conversationSignature: string
  result: {
    value: string
    message: null
  }
}

export enum InvocationEventType {
  Invocation = 1,
  StreamItem = 2,
  Completion = 3,
  StreamInvocation = 4,
  CancelInvocation = 5,
  Ping = 6,
  Close = 7
}

// https://github.com/bytemate/bingchat-api/blob/main/src/lib.ts

export interface ConversationInfo {
  conversationId: string
  clientId: string
  conversationSignature: string
  invocationId: number
  conversationStyle: BingConversationStyle
}

export interface BingChatResponse {
  conversationSignature: string
  conversationId: string
  clientId: string
  invocationId: number
  conversationExpiryTime: Date
  response: string
  details: ChatResponseMessage
}

export interface ChatResponseMessage {
  text: string
  author: string
  createdAt: Date
  timestamp: Date
  messageId: string
  messageType?: string
  requestId: string
  offense: string
  adaptiveCards: AdaptiveCard[]
  sourceAttributions: SourceAttribution[]
  feedback: Feedback
  contentOrigin: string
  privacy: null
  suggestedResponses: SuggestedResponse[]
}

export interface AdaptiveCard {
  type: string
  version: string
  body: Body[]
}

export interface Body {
  type: string
  text: string
  wrap: boolean
  size?: string
}

export interface Feedback {
  tag: null
  updatedOn: null
  type: string
}

export interface SourceAttribution {
  providerDisplayName: string
  seeMoreUrl: string
  searchQuery: string
}

export interface SuggestedResponse {
  text: string
  author: string
  createdAt: Date
  timestamp: Date
  messageId: string
  messageType: string
  offense: string
  feedback: Feedback
  contentOrigin: string
  privacy: null
}

export async function generateMarkdown(response: BingChatResponse) {
  // change `[^Number^]` to markdown link
  const regex = /\[\^(\d+)\^\]/g
  const markdown = response.details.text.replace(regex, (match, p1) => {
    const sourceAttribution =
      response.details.sourceAttributions[Number(p1) - 1]
    return `[${sourceAttribution.providerDisplayName}](${sourceAttribution.seeMoreUrl})`
  })
  return markdown
}

export function convertMessageToMarkdown(message: ChatResponseMessage): string {
  if (message.messageType === "InternalSearchQuery") {
    return message.text
  }
  for (const card of message.adaptiveCards) {
    for (const block of card.body) {
      if (block.type === "TextBlock") {
        return block.text
      }
    }
  }
  return ""
}

const RecordSeparator = String.fromCharCode(30)

export const websocketUtils = {
  packMessage(data: any) {
    return `${JSON.stringify(data)}${RecordSeparator}`
  },
  unpackMessage(data: string | ArrayBuffer | Blob) {
    return data
      .toString()
      .split(RecordSeparator)
      .filter(Boolean)
      .map((s) => JSON.parse(s))
  }
}

const styleOptionMap: Record<BingConversationStyle, string> = {
  [BingConversationStyle.Balanced]: "harmonyv3",
  [BingConversationStyle.Creative]: "h3imaginative",
  [BingConversationStyle.Precise]: "h3precise"
}

function buildChatRequest(conversation: ConversationInfo, message: string) {
  const styleOption = styleOptionMap[conversation.conversationStyle]
  return {
    arguments: [
      {
        source: "cib",
        optionsSets: [
          "deepleo",
          "nlu_direct_response_filter",
          "disable_emoji_spoken_text",
          "responsible_ai_policy_235",
          "enablemm",
          "dtappid",
          "rai253",
          "dv3sugg",
          styleOption
        ],
        allowedMessageTypes: ["Chat", "InternalSearchQuery"],
        isStartOfSession: conversation.invocationId === 0,
        message: {
          author: "user",
          inputMethod: "Keyboard",
          text: message,
          messageType: "Chat"
        },
        conversationId: conversation.conversationId,
        conversationSignature: conversation.conversationSignature,
        participant: { id: conversation.clientId }
      }
    ],
    invocationId: conversation.invocationId.toString(),
    target: "chat",
    type: InvocationEventType.StreamInvocation
  }
}

// https://github.com/acheong08/EdgeGPT/blob/master/src/EdgeGPT.py#L32
function randomIP() {
  return `13.${random(104, 107)}.${random(0, 255)}.${random(0, 255)}`
}

const API_ENDPOINT = "https://www.bing.com/turing/conversation/create"

export async function createConversation(): Promise<ConversationResponse> {
  const headers = {
    "x-ms-client-request-id": uuidv4(),
    "x-ms-useragent":
      "azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32"
  }

  let resp: ConversationResponse
  try {
    resp = await ofetch(API_ENDPOINT, { headers, redirect: "error" })
    if (!resp.result) {
      throw new Error("Invalid response")
    }
  } catch (err) {
    console.error("retry bing create", err)
    resp = await ofetch(API_ENDPOINT, {
      headers: { ...headers, "x-forwarded-for": randomIP() },
      redirect: "error"
    })
    if (!resp) {
      throw new FetchError(`Failed to fetch (${API_ENDPOINT})`)
    }
  }

  if (resp.result.value !== "Success") {
    const message = `${resp.result.value}: ${resp.result.message}`
    if (resp.result.value === "UnauthorizedRequest") {
      throw new Error("401 Unauthorized")
    }
    if (resp.result.value === "Forbidden") {
      throw new Error("403 Forbidden")
    }
    throw new Error(message)
  }
  return resp
}

async function chat(prompt: string, res: PlasmoMessaging.Response<any>) {
  const conversation = await createConversation()
  const bingConversationStyle = BingConversationStyle.Balanced
  const conversationContext = {
    conversationId: conversation.conversationId,
    conversationSignature: conversation.conversationSignature,
    clientId: conversation.clientId,
    invocationId: 0,
    conversationStyle: bingConversationStyle
  }

  const wsp = new WebSocketAsPromised("wss://sydney.bing.com/sydney/ChatHub", {
    packMessage: websocketUtils.packMessage,
    unpackMessage: websocketUtils.unpackMessage
  })

  wsp.onUnpackedMessage.addListener((events) => {
    for (const event of events) {
      if (JSON.stringify(event) === "{}") {
        wsp.sendPacked({ type: 6 })
        wsp.sendPacked(buildChatRequest(conversationContext, prompt))
        conversationContext.invocationId += 1
      } else if (event.type === 6) {
        wsp.sendPacked({ type: 6 })
      } else if (event.type === 3) {
        wsp.removeAllListeners()
        wsp.close()
      } else if (event.type === 1) {
        if (event.arguments[0].messages) {
          const text = convertMessageToMarkdown(event.arguments[0].messages[0])
          res.send(text)
        }
      } else if (event.type === 2) {
        const messages = event.item.messages as ChatResponseMessage[]
        const limited = messages.some(
          (message) => message.contentOrigin === "TurnLimiter"
        )
        if (limited) {
          res.send(
            "Sorry, you have reached chat turns limit in this conversation."
          )
        }
      }
    }
  })

  //   wsp.onClose.addListener(() => {})

  await wsp.open()
  wsp.sendPacked({ protocol: "json", version: 1 })
}

export async function BingChat(
  prompt: string,
  res: PlasmoMessaging.Response<any>
) {
  try {
    chat(prompt, res)
  } catch (err) {
    console.error("BingChat", err)
    res.send(
      "Sorry, Bing Chat is not available at the moment. error: " + err.message
    )
  }
}
