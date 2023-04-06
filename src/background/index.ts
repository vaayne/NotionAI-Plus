import browser from "webextension-polyfill"

import { sendToContentScript } from "@plasmohq/messaging"

import {
  LanguageOptions,
  PromptTypeEnum,
  PromptTypeOptions,
  ToneOptions,
  TopicOptions
} from "~lib/enums"

// Register a keyboard shortcut
chrome.commands.onCommand.addListener(function (command) {
  if (command === "activate-notionai") {
    sendToContentScript({
      name: "activate"
    })
  }
})

// Create a new context menu
chrome.contextMenus.create(
  {
    id: "notionai-plus",
    title: "NotionAI Plus",
    contexts: ["selection", "page"]
  },
  () => {
    browser.runtime.lastError
  }
)

PromptTypeOptions.forEach((prompt) => {
  chrome.contextMenus.create(
    {
      id: prompt.value,
      title: prompt.label,
      contexts: ["selection"],
      parentId: "notionai-plus"
    },
    () => {
      browser.runtime.lastError
    }
  )
})

TopicOptions.forEach((topic) => {
  chrome.contextMenus.create(
    {
      id: topic.value,
      title: topic.label,
      contexts: ["selection"],
      parentId: PromptTypeEnum.TopicWriting
    },
    () => {
      browser.runtime.lastError
    }
  )
})

LanguageOptions.forEach((lang) => {
  chrome.contextMenus.create(
    {
      id: lang.value,
      title: lang.label,
      contexts: ["selection"],
      parentId: PromptTypeEnum.Translate
    },
    () => {
      browser.runtime.lastError
    }
  )
})

ToneOptions.forEach((tone) => {
  chrome.contextMenus.create(
    {
      id: tone.value,
      title: tone.label,
      contexts: ["selection"],
      parentId: PromptTypeEnum.ChangeTone
    },
    () => {
      browser.runtime.lastError
    }
  )
})

// auto add selected text to context
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  tab.id &&
    sendToContentScript({
      name: "activate",
      body: JSON.stringify({
        prompt: info.menuItemId,
        text: info.selectionText
      })
    })
})
