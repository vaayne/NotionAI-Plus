import { sendToContentScript } from "@plasmohq/messaging"
import browser from "webextension-polyfill"

import handleStream from "~lib/stream"

// Register a keyboard shortcut
browser.commands.onCommand.addListener(function (command) {
	if (command === "activate-notionai") {
		sendToContentScript({
			name: "activate",
		})
	}
})

browser.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (msg) {
		handleStream(msg, port)
	})
})

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action == "openOptionsPage") {
		chrome.runtime.openOptionsPage()
	}
})
