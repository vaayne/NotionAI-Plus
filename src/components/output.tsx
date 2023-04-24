import { marked } from "marked"
import { useContext } from "react"

import { OutputContext } from "~lib/context"

export function OutputComponent() {
  const { isFullMode, responseMessage, streamPort } = useContext(OutputContext)

  if (streamPort.data) {
    return (
      <div className="box-border px-4 mt-4 overflow-auto ">
        <article
          className={`${
            isFullMode ? "prose-base" : "prose-xs"
          } dark:text-white`}
          dangerouslySetInnerHTML={{ __html: streamPort.data }}></article>
      </div>
    )
  }

  if (responseMessage) {
    const html = marked(responseMessage)
    return (
      <div className="box-border px-4 mt-4 overflow-auto ">
        <article
          className={`${
            isFullMode ? "prose-base" : "prose-xs"
          } dark:text-white`}
          dangerouslySetInnerHTML={{ __html: html }}></article>
      </div>
    )
  }
}
