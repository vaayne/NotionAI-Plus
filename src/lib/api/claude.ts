import { Claude } from "claude-ai"

const claude = new Claude({
  sessionKey: "sk-ant-sid01-sessionKey"
})

async function chat(prompt: string, port: chrome.runtime.Port) {
  if (
    claude.organizationId === undefined ||
    claude.organizationId === null ||
    claude.organizationId === ""
  ) {
    await claude.init()
  }

  const done = () => {
    // console.log("Done")
    port.postMessage("[DONE]")
  }
  const progress = (chunk: any) => {
    // console.log("Progress", chunk)
    port.postMessage(chunk.completion)
  }

  await claude.sendMessage(prompt, {
    done: done,
    progress: progress as any
  })
}

export async function ClaudeChat(prompt: string, port: chrome.runtime.Port) {
  try {
    chat(prompt, port)
  } catch (err) {
    console.error("Claude", err)
    port.postMessage(
      "Sorry,  Claude is not available at the moment. error: " + err.message
    )
  }
}
