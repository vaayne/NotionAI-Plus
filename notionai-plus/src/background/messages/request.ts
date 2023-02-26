import type { PlasmoMessaging } from "@plasmohq/messaging"

import { postChatGPT } from "~lib/api/chatgpt"
import { postNotion } from "~lib/api/notion"
import { PromptTypeEnum } from "~lib/enums"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let message: string
  if (req.body.promptType === PromptTypeEnum.ChatGPT) {
    message = await postChatGPT(req.body.prompt, req.body.context)
  } else {
    message = await postNotion(
      req.body.promptType,
      req.body.context,
      req.body.notionSpaceId,
      req.body.prompt,
      req.body.language,
      req.body.tone
    )
  }

  res.send({
    message
  })
}

export default handler
