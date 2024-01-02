import { sendToContentScript } from "@plasmohq/messaging"
import browser from "webextension-polyfill"
import { PromptOptions } from "~lib/enums"

import handleStream from "~lib/stream"

// Register a keyboard shortcut
browser.commands.onCommand.addListener(function (command) {
	if (command === "activate-aiplus") {
		sendToContentScript({
			name: "activate",
		})
	}
})

// Register a context menu
browser.contextMenus.create(
	{
		id: "aiplus",
		title: "AiPlus",
		contexts: ["selection", "page"],
	},
	() => {
		browser.runtime.lastError
	}
)

PromptOptions.forEach(option => {
	browser.contextMenus.create(
		{
			id: option.value,
			title: option.label,
			contexts: ["selection"],
			parentId: option.category == "" ? "aiplus" : option.category,
		},
		() => {
			browser.runtime.lastError
		}
	)
})

// auto add selected text to context
browser.contextMenus.onClicked.addListener(async (info, tab) => {
	tab.id &&
		sendToContentScript({
			name: "activate-with-selection",
			body: JSON.stringify({
				prompt: info.menuItemId.toString(),
				text: info.selectionText,
			}),
		})
})

browser.runtime.onConnect.addListener(function (port) {
	if (port.name === "stream") {
		// console.log("Connected to the content script")
		port.onMessage.addListener(function (msg) {
			handleStream(msg, port)
		})

		// port.onDisconnect.addListener(() => {
		// 	console.log("Content script disconnected")
		// })
	}
})

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action == "openOptionsPage") {
		chrome.runtime.openOptionsPage()
	}
})
