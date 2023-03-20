import { marked } from "marked"
import { useContext } from "react"

import { OutputContext } from "~lib/context"

export function OutputComponent() {
  const { isFullMode, isLoading, responseMessage } = useContext(OutputContext)
  const handleLoading = () => {
    if (isLoading) {
      return (
        <progress
          className={`progress ${isFullMode ? "w-full" : "w-56"}`}></progress>
      )
    }
    if (responseMessage != undefined && responseMessage != "") {
      const html = marked(responseMessage)
      return (
        <article
          className={`${isFullMode ? "prose-base" : "prose-xs"} `}
          dangerouslySetInnerHTML={{ __html: html }}></article>
      )
    }
  }
  return <div className="px-4 overflow-auto box-border ">{handleLoading()}</div>
}
