const API_URL = "https://api.openai.com/v1/chat/completions"

const MODEL = "gpt-3.5-turbo"

type ChatGPTResponseChoice = {
  index: number
  message: {
    role: string
    content: string
  }
  finish_reason: string
}

type ChatGPTResponseUsgae = {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

type ChatGPTResponse = {
  id: string
  object: string
  created: number
  choices: ChatGPTResponseChoice[]
  usage: ChatGPTResponseUsgae
}

async function Chat(instraction: string, prompt: string, api_key: string) {
  if (api_key == "") {
    return "Please set your OpenAI API key in the extension options page."
  }
  const data = {
    model: MODEL,
    messages: [
      { role: "system", content: instraction },
      { role: "user", content: prompt }
    ]
  }
  console.log(`ChatGPTAPI request: ${JSON.stringify(data)}`)

  const resp = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`
    },
    body: JSON.stringify(data)
  })

  if (resp.status == 200) {
    const respData = (await resp.json()) as ChatGPTResponse
    return respData.choices[0].message.content
  } else {
    return `ChatGPT return error, status: ${resp.status}`
  }
}

export { Chat }
