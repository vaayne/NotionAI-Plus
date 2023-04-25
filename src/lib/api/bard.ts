import { ofetch } from "ofetch"

import type { PlasmoMessaging } from "@plasmohq/messaging"

function extractFromHTML(variableName: string, html: string) {
  const regex = new RegExp(`"${variableName}":"([^"]+)"`)
  const match = regex.exec(html)
  return match?.[1]
}

export async function fetchRequestParams() {
  const html = await ofetch("https://bard.google.com/faq")
  const atValue = extractFromHTML("SNlM0e", html)
  const blValue = extractFromHTML("cfb2h", html)
  return { atValue, blValue }
}

export function parseBartResponse(resp: string) {
  const data = JSON.parse(resp.split("\n")[3])
  const payload = JSON.parse(data[0][2])
  if (!payload) {
    throw new Error("Failed to access Bard: Empty response")
  }
  console.debug("bard response payload", payload)
  const text = payload[0][0]
  return {
    text,
    ids: [...payload[1], payload[4][0][0]] as [string, string, string]
  }
}

function generateReqId() {
  return Math.floor(Math.random() * 900000) + 100000
}

export async function BardChat(
  prompt: string,
  res: PlasmoMessaging.Response<any>
) {
  const requestParams = await fetchRequestParams()
  let contextIds = ["", "", ""]
  const resp = await ofetch(
    "https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate",
    {
      method: "POST",
      query: {
        bl: requestParams.blValue,
        _reqid: generateReqId(),
        rt: "c"
      },
      body: new URLSearchParams({
        at: requestParams.atValue!,
        "f.req": JSON.stringify([
          null,
          `[[${JSON.stringify(prompt)}],null,${JSON.stringify(contextIds)}]`
        ])
      }),
      parseResponse: (txt) => txt
    }
  )
  const { text, ids } = parseBartResponse(resp)
  contextIds = ids
  res.send(text)
}
