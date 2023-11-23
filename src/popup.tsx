import { sendToContentScript } from "@plasmohq/messaging"
import { useEffect } from "react"


function IndexPopup() {

  // click icon to show the main window
  useEffect(() => {
    sendToContentScript({
      name: "activate"
    })
  }, [])

  return 
}

export default IndexPopup
