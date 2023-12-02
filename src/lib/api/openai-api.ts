import { parseSSEResponse } from "~lib/utils/sse"

async function chat(
	url: string,
	instraction: string,
	prompt: string,
	api_key: string,
	model: string,
	port: chrome.runtime.Port
) {
	const data = {
		model: model,
		stream: true,
		messages: [
			{ role: "system", content: instraction },
			{ role: "user", content: prompt },
		],
	}
	const resp = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${api_key}`,
		},
		body: JSON.stringify(data),
	})

	if (!resp.ok) {
		const errMsg = `ChatGPTAPI return error, status: ${resp.status}`
		throw new Error(errMsg)
	}

	let content: string = ""

	await parseSSEResponse(resp, message => {
		if (message === "[DONE]") {
			port.postMessage("[DONE]")
			return
		}
		try {
			const data = JSON.parse(message)
			// console.log(content)
			if (data?.choices?.length) {
				const delta = data.choices[0].delta
				if (delta?.content) {
					content += delta.content
					port.postMessage(content)
				}
			}
		} catch (err) {
			throw new Error(`ChatGPTAPI return error: ${err.message}`)
		}
	})
}

async function OpenAIAPIChat(
	url: string,
	instraction: string,
	prompt: string,
	api_key: string,
	model: string,
	port: chrome.runtime.Port
) {
	if (!api_key) {
		const msg =
			"Please set your OpenAI API key in the extension options page."
		console.error(msg)
		port.postMessage(msg)
		port.postMessage("[DONE]")
		return
	}
	try {
		await chat(url, instraction, prompt, api_key, model, port)
	} catch (err) {
		console.error(err)
		port.postMessage(err.message)
	}
	port.postMessage("[DONE]")
}

export default OpenAIAPIChat
