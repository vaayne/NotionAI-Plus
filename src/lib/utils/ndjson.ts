export async function processNdjsonResp(
	resp: Response,
	onMessage: (message: any) => void
): Promise<void> {
	const reader = resp.body?.getReader()
	if (!reader) {
		throw new Error("No body reader found in response")
	}

	const decoder = new TextDecoder()
	let buffer = ""

	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		buffer += decoder.decode(value, { stream: true })

		let lineEnd = buffer.indexOf("\n")
		while (lineEnd !== -1) {
			const line = buffer.slice(0, lineEnd)
			buffer = buffer.slice(lineEnd + 1)

			const json = JSON.parse(line)
			onMessage(json)
			lineEnd = buffer.indexOf("\n")
		}
	}

	if (buffer) {
		const json = JSON.parse(buffer)
		onMessage(json)
	}
}
