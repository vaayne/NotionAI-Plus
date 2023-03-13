import { sendToContentScript } from "@plasmohq/messaging"

// Register a keyboard shortcut
chrome.commands.onCommand.addListener(function (command) {
  if (command === "activate-notionai") {
    sendToContentScript({
      name: "activate"
    })
  }
})
