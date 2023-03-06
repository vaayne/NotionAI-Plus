import type { PlasmoMessaging } from "@plasmohq/messaging"

import { GetSpaces } from "~lib/api/notion"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const spaces = await GetSpaces()
  res.send({
    spaces
  })
}

export default handler
