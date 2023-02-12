// Create a context menu item
chrome.contextMenus.create({
	id: "notionai",
	title: "NotionAI",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "chatGPT",
	parentId: "notionai",
	title: "chatGPT",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-translate",
	parentId: "notionai",
	title: "translate",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-changeTone",
	parentId: "notionai",
	title: "changeTone",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite",
	parentId: "notionai",
	title: "helpMeWrite",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-brainsteamIdeas",
	parentId: "notionai-helpMeWrite",
	title: "brainsteamIdeas",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-blogPost",
	parentId: "notionai-helpMeWrite",
	title: "blogPost",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-outline",
	parentId: "notionai-helpMeWrite",
	title: "outline",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-socialMediaPost",
	parentId: "notionai-helpMeWrite",
	title: "socialMediaPost",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-pressRelease",
	parentId: "notionai-helpMeWrite",
	title: "pressRelease",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-creativeStory",
	parentId: "notionai-helpMeWrite",
	title: "creativeStory",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-essay",
	parentId: "notionai-helpMeWrite",
	title: "essay",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-poem",
	parentId: "notionai-helpMeWrite",
	title: "poem",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-meetingAgenda",
	parentId: "notionai-helpMeWrite",
	title: "meetingAgenda",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-prosConsList",
	parentId: "notionai-helpMeWrite",
	title: "prosConsList",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-jobDescription",
	parentId: "notionai-helpMeWrite",
	title: "jobDescription",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-salesEmail",
	parentId: "notionai-helpMeWrite",
	title: "salesEmail",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-helpMeWrite-recruitingEmail",
	parentId: "notionai-helpMeWrite",
	title: "recruitingEmail",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-continueWriting",
	parentId: "notionai",
	title: "continueWriting",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-summarize",
	parentId: "notionai",
	title: "summarize",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-improveWriting",
	parentId: "notionai",
	title: "improveWriting",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-fixSpellingGrammar",
	parentId: "notionai",
	title: "fixSpellingGrammar",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-explainThis",
	parentId: "notionai",
	title: "explainThis",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-makeLonger",
	parentId: "notionai",
	title: "makeLonger",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-makeShorter",
	parentId: "notionai",
	title: "makeShorter",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-findActionItems",
	parentId: "notionai",
	title: "findActionItems",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-simplifyLanguage",
	parentId: "notionai",
	title: "simplifyLanguage",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-translate-english",
	parentId: "notionai-translate",
	title: "english",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-korean",
	parentId: "notionai-translate",
	title: "korean",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-translate-chinese",
	parentId: "notionai-translate",
	title: "chinese",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-japanese",
	parentId: "notionai-translate",
	title: "japanese",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-spanish",
	parentId: "notionai-translate",
	title: "spanish",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-russia",
	parentId: "notionai-translate",
	title: "russia",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-translate-frence",
	parentId: "notionai-translate",
	title: "frence",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-german",
	parentId: "notionai-translate",
	title: "german",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-italian",
	parentId: "notionai-translate",
	title: "italian",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-portuguese",
	parentId: "notionai-translate",
	title: "portuguese",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-dutch",
	parentId: "notionai-translate",
	title: "dutch",
	contexts: ["all"],
});
chrome.contextMenus.create({
	id: "notionai-translate-indonesia",
	parentId: "notionai-translate",
	title: "indonesia",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-translate-tagalog",
	parentId: "notionai-translate",
	title: "tagalog",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-translate-vietnamese",
	parentId: "notionai-translate",
	title: "vietnamese",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-changeTone-professional",
	parentId: "notionai-changeTone",
	title: "professional",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-changeTone-casual",
	parentId: "notionai-changeTone",
	title: "casual",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-changeTone-straightForward",
	parentId: "notionai-changeTone",
	title: "straightForward",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-changeTone-confident",
	parentId: "notionai-changeTone",
	title: "confident",
	contexts: ["all"],
});

chrome.contextMenus.create({
	id: "notionai-changeTone-friendly",
	parentId: "notionai-changeTone",
	title: "friendly",
	contexts: ["all"],
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
	// processClick(info);
	chrome.tabs.sendMessage(tab.id, {
		type: "notionai-click",
		menuItemId: info.menuItemId,
	});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === "notionai-request") {
		if (request.menuItemId === "chatGPT") {
			const resp = postChatGPT(request.context);
			(async () => {
				const [tab] = await chrome.tabs.query({
					active: true,
					lastFocusedWindow: true,
				});
				await chrome.tabs.sendMessage(tab.id, {
					type: "notionai-response",
					reply: await resp,
				});
				// console.log(`notionai-response: ${response}`);
			})();
		} else {
			const infos = request.menuItemId.split("-");

			const prompt_type = infos[1];
			let context = request.context;
			let prompt = "";
			let lang = "";
			let tone = "";

			if (infos[1] === "translate") {
				lang = infos[2];
			} else if (infos[1] === "helpMeWrite") {
				prompt = infos[2];
			} else if (infos[1] === "changeTone") {
				tone = infos[2];
			}

			const resp = postToNotion(prompt_type, context, prompt, lang, tone);
			(async () => {
				const [tab] = await chrome.tabs.query({
					active: true,
					lastFocusedWindow: true,
				});
				await chrome.tabs.sendMessage(tab.id, {
					type: "notionai-response",
					reply: await resp,
				});
				// console.log(`notionai-response: ${response}`);
			})();
		}
	}
	return true;
});

const CACHE = new Map();
const CACHE_TTL = 60 * 5;
const KEY_ACCESS_TOKEN = "accessToken";
const KEY_CONVERSATION_ID = "conversationId";
function setCache(key, value) {
	CACHE.set(key, [value, Date.now()]);
}

function getCache(key) {
	const val = CACHE.get(key);
	if (!val) {
		return null;
	}
	if ((Date.now() - val[1]) / 1000 > CACHE_TTL) {
		CACHE.delete(key);
		return null;
	}
	return val[0];
}

async function postToNotion(
	prompt_type,
	context,
	prompt = "",
	lang = "",
	tone = ""
) {
	const url = "https://www.notion.so/api/v3/getCompletion";
	const data = {
		id: UUIDv4.generate(),
		model: "openai-1.1",
		spaceId: UUIDv4.generate(),
		isSpacePermission: false,
	};

	if (prompt_type === "translate") {
		data.context = {
			type: "translate",
			text: context,
			language: lang,
		};
	} else if (prompt_type === "helpMeWrite") {
		data.context = {
			type: "helpMeWrite",
			prompt: prompt,
			previousContent: context,
		};
	} else if (prompt_type === "changeTone") {
		data.context = {
			type: "changeTone",
			text: context,
			tone: tone,
		};
	} else {
		data.context = {
			type: prompt_type,
			selectedText: context,
		};
	}
	console.log(`request body: ${JSON.stringify(data)}`);

	const resp = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (resp.status == 200) {
		let data = await resp.text();
		if (!data || data === "" || data === "[]") {
			console.log("response is empty");
			return "Get response error";
		}
		data = data.match(/.+/g).map(JSON.parse);
		// console.log(data);

		const texts = data.map((tmp) => {
			return tmp.type == "success" ? tmp.completion : tmp.message;
		});
		// console.log(texts);
		return texts.join("").trim();
	} else {
		console.log(`fail: ${resp.status}`);
		return await resp.text();
	}
}

async function getAccessToken() {
	const resp = await fetch("https://chat.openai.com/api/auth/session");
	if (resp.status === 403) {
		throw new Error("CLOUDFLARE");
	}
	const data = await resp.json().catch(() => ({}));
	if (!data.accessToken) {
		throw new Error("UNAUTHORIZED");
	}
	setCache(KEY_ACCESS_TOKEN, data.accessToken);
	return data.accessToken;
}

async function postChatGPT(context) {
	// cache access token
	let accessToken = getCache(KEY_ACCESS_TOKEN);
	if (!accessToken) {
		accessToken = await getAccessToken();
	}

	// cache parent message id
	let conversationId = getCache(KEY_CONVERSATION_ID);
	if (!conversationId) {
		conversationId = UUIDv4.generate();
		setCache(KEY_CONVERSATION_ID, conversationId);
	}

	const data = {
		action: "next",
		messages: [
			{
				id: UUIDv4.generate(),
				role: "user",
				content: { content_type: "text", parts: [context] },
			},
		],
		// conversation_id: UUIDv4.generate(),
		parent_message_id: conversationId,
		model: "text-davinci-002-render-next",
	};
	const url = "https://chat.openai.com/backend-api/conversation";
	const resp = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(data),
	});

	if (resp.status == 200) {
		return parseChatGPTResponse(await resp.text());
	} else {
		console.log(`fail: ${resp.status}`);
		return await resp.text();
	}
}

function parseChatGPTResponse(data) {
	const texts = data.split("\n");
	let res = "";
	for (let text of texts) {
		try {
			const tmp = JSON.parse(text.slice(6));
			res = tmp.message.content.parts[0];
		} catch (error) {
			// console.log(`parse error, data: ${text} error: ${error}`);
		}
	}
	return res;
}

var UUIDv4 = new (function () {
	function generateNumber(limit) {
		var value = limit * Math.random();
		return value | 0;
	}
	function generateX() {
		var value = generateNumber(16);
		return value.toString(16);
	}
	function generateXes(count) {
		var result = "";
		for (var i = 0; i < count; ++i) {
			result += generateX();
		}
		return result;
	}
	function generateVariant() {
		var value = generateNumber(16);
		var variant = (value & 0x3) | 0x8;
		return variant.toString(16);
	}
	// UUID v4
	//
	//   varsion: M=4
	//   variant: N
	//   pattern: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
	//
	this.generate = function () {
		var result =
			generateXes(8) +
			"-" +
			generateXes(4) +
			"-" +
			"4" +
			generateXes(3) +
			"-" +
			generateVariant() +
			generateXes(3) +
			"-" +
			generateXes(12);
		return result;
	};
})();
