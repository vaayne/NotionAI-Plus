async function chat(
	prompt: string,
	host: string,
	apiKey: string,
	model: string,
	port: chrome.runtime.Port
) {
	const url = `${host}/v1beta/models/${model}:generateContent?key=${apiKey}`
	const payload = {
		contents: [
			{
				parts: [
					{
						text: prompt,
					},
				],
			},
		],
	}

	const resp = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	})

	if (!resp.ok) {
		const errMsg = `GoogleAI return error, status: ${resp.status}`
		console.log(errMsg)
		throw new Error(errMsg)
	}

	// parse json response
	const data = await resp.json()
	console.log(data)
	const content = data.candidates[0].content.parts[0].text
	port.postMessage(content)
}

async function GoogleAIChat(
	prompt: string,
	host: string,
	apiKey: string,
	model: string,
	port: chrome.runtime.Port
) {
	if (!apiKey) {
		const msg =
			"Please set your Google API key in the extension options page."
		console.error(msg)
		port.postMessage(msg)
		port.postMessage("[DONE]")
		return
	}
	try {
		await chat(prompt, host, apiKey, model, port)
	} catch (err) {
		console.error(err)
		port.postMessage(err.message)
	}
	port.postMessage("[DONE]")
}

export default GoogleAIChat
