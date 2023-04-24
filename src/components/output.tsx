import { useContext } from "react"

import { OutputContext } from "~lib/context"

import { MarkdownComponent } from "./makrdown"

export function OutputComponent() {
  const { responseMessage } = useContext(OutputContext)

  if (responseMessage) {
    return (
      <div className="box-border px-4 mt-4 overflow-auto ">
        <MarkdownComponent text={responseMessage} />
      </div>
    )
  }
}
