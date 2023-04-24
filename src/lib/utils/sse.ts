import { createParser } from "eventsource-parser"
import { isEmpty } from "lodash-es"

export async function parseSSEResponse(
  resp: Response,
  onMessage: (message: string) => void
) {
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}))
    throw new Error(
      !isEmpty(error)
        ? JSON.stringify(error)
        : `${resp.status} ${resp.statusText}`
    )
  }
  const parser = createParser((event) => {
    if (event.type === "event") {
      onMessage(event.data)
    }
  })
  for await (const chunk of streamAsyncIterable(resp.body!)) {
    const str = new TextDecoder().decode(chunk)
    parser.feed(str)
  }
}

async function* streamAsyncIterable(stream: ReadableStream) {
  const reader = stream.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        return
      }
      yield value
    }
  } finally {
    reader.releaseLock()
  }
}
