import { sendToContentScript } from "@plasmohq/messaging"

// Register a keyboard shortcut
chrome.commands.onCommand.addListener(function (command) {
  if (command === "activate-notionai") {
    sendToContentScript({
      name: "activate"
    })
  }
})

// Create a new context menu
chrome.contextMenus.create({
  id: "notionai-plus",
  title: "NotionAI Plus",
  contexts: ["selection"]
})

// auto add selected text to context
chrome.contextMenus.onClicked.addListener((info, tab?) => {
  sendToContentScript({
    name: "activate",
    body: info.selectionText
  })
})
