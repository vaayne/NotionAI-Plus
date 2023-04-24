import { MarkdownComponent } from "~components/makrdown"

import "~style.css"

const usageStr = `
# NotionAI Plus

This project is Open Source, and the source code can be found on [Github](https://github.com/Vaayne/NotionAI-Plus).

You can connect me on [Twitter](https://twitter.com/LiuVaayne) if you have any questions or suggestions.

## Features

- All **NotionAI** features, such as enhancing writing, summarizing, changing tone, translating, etc. 
- Support for multiple engines like ChatGPT **Web** and ChatGPT **API**. 
- **Draggable** window.
- Full screen mode.
- Stream response.

## Usage

### Triggers
There are two ways to use NotionAI Plus:
1. Select text on a webpage and right-click to open the context menu.
2. Select text on a webpage and press the shortcut key.

#### Shortcuts

Default keybindings:
- Mac: CMD+K
- Windows: Alt+K

You can change the shortcut key by going to the extension's options page.

#### Context Menu

You can also use NotionAI Plus by right-clicking on a selected text and selecting the option starting with **NotionAI**.

`

function IndexPopup() {
  return (
    <div className="w-96">
      <MarkdownComponent text={usageStr} />
    </div>
  )
}

export default IndexPopup
