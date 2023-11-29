const HOST = "https://www.notion.so"

export type NotionSpace = {
	id: string
	name: string
}

async function GetSpaces() {
	const url = `${HOST}/api/v3/getSpaces`

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	})

	if (res.status == 200) {
		const data = (await res.json()) as Map<string, any>
		let spaces: NotionSpace[] = []

		for (const [key, value] of Object.entries(data)) {
			const sdata = value.space
			for (const [skey, svalue] of Object.entries(sdata)) {
				const space = svalue.value as NotionSpace
				spaces.push({
					id: space.id,
					name: space.name,
				})
			}
		}
		return spaces
	} else {
		return []
	}
}

export { GetSpaces }
