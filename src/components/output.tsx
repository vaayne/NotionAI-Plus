import { marked } from "marked"
import { useContext } from "react"

import { OutputContext } from "~lib/context"

export function OutputComponent() {
  const { isFullMode, responseMessage } = useContext(OutputContext)

  if (responseMessage) {
    const html = marked(responseMessage)
    return (
      <div className="box-border px-4 overflow-auto ">
        <article
          className={`${
            isFullMode ? "prose-base" : "prose-xs"
          } dark:text-white`}
          dangerouslySetInnerHTML={{ __html: html }}></article>
      </div>
    )
  }
}
