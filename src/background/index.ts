import { sendToContentScript } from "@plasmohq/messaging"

import handleStream from "~lib/stream"

// Register a keyboard shortcut
chrome.commands.onCommand.addListener(function (command) {
	if (command === "activate-notionai") {
		sendToContentScript({
			name: "activate",
		})
	}
})

chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (msg) {
		handleStream(msg, port)
	})
})
