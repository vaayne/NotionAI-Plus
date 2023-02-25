import type { PlasmoMessaging } from "@plasmohq/messaging"

import { postChatGPT } from "~lib/api/chatgpt"
import { postNotion } from "~lib/api/notion"
import { PromptTypeEnum } from "~lib/enums"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(`request body: ${JSON.stringify(req.body)}`)
  let message: string
  if (req.body.promptType === PromptTypeEnum.ChatGPT) {
    message = await postChatGPT(req.body.prompt, req.body.context)
  } else {
    message = await postNotion(
      req.body.promptType,
      req.body.context,
      req.body.notionToken,
      req.body.notionSpaceId,
      req.body.prompt,
      req.body.language,
      req.body.tone
    )
  }

  console.log(`response message: ${message}`)
  res.send({
    message
  })
}

export default handler
