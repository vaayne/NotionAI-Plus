// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const { originalActiveElement, text } = selectedText();
	// console.log(`Selected text: ${text}`);
	if (request.type === "notionai-click") {
		showLoadingCursor();
		(async () => {
			const response = await chrome.runtime.sendMessage({
				type: "notionai-request",
				menuItemId: request.menuItemId,
				context: text,
			});
			console.log(response);
		})();
	} else if (request.type === "notionai-response") {
		replaceText(originalActiveElement, request.reply);
		// console.log(`request.reply: ${request.reply}`);
		restoreCursor();
	}
	return true;
});

function selectedText() {
	let originalActiveElement = null;
	let text = "";
	if (
		document.activeElement &&
		(document.activeElement.isContentEditable ||
			document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
			document.activeElement.nodeName.toUpperCase() === "INPUT")
	) {
		// Set as original for later
		originalActiveElement = document.activeElement;
		// Use selected text or all text in the input
		text =
			document.getSelection().toString().trim() ||
			document.activeElement.textContent.trim();
	} else {
		// If no active text input use any selected text on page
		text = document.getSelection().toString().trim();
	}

	if (!text) {
		alert(
			"No text found. Select this option after right clicking on a textarea that contains text or on a selected portion of text."
		);
		return;
	}

	return { originalActiveElement: originalActiveElement, text: text };
}

function replaceText(originalActiveElement, text) {
	const activeElement =
		originalActiveElement ||
		(document.activeElement.isContentEditable && document.activeElement);

	if (activeElement) {
		if (
			activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
			activeElement.nodeName.toUpperCase() === "INPUT"
		) {
			// Insert after selection
			activeElement.value =
				activeElement.value.slice(0, activeElement.selectionEnd) +
				`\n\n${text}` +
				activeElement.value.slice(
					activeElement.selectionEnd,
					activeElement.length
				);
		} else {
			// Special handling for contenteditable
			const replyNode = document.createTextNode(`\n\n${text}`);
			const selection = window.getSelection();

			if (selection.rangeCount === 0) {
				selection.addRange(document.createRange());
				selection.getRangeAt(0).collapse(activeElement, 1);
			}

			const range = selection.getRangeAt(0);
			range.collapse(false);

			// Insert reply
			range.insertNode(replyNode);

			// Move the cursor to the end
			selection.collapse(replyNode, replyNode.length);
		}
	} else {
		// Alert reply since no active text area
		alert(`NotionAI says: ${text}`);
	}
}

const showLoadingCursor = () => {
	const style = document.createElement("style");
	style.id = "cursor_wait";
	style.innerHTML = `* {cursor: wait;}`;
	document.head.insertBefore(style, null);
};

const restoreCursor = () => {
	document.getElementById("cursor_wait").remove();
};
