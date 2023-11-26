import { useAtomValue } from "jotai"
import { responseMessageAtom } from "~lib/state"
import { MarkdownComponent } from "./makrdown"

export function OutputComponent() {
	const responseMessage = useAtomValue(responseMessageAtom)

	if (responseMessage) {
		return (
			<div className="box-border px-4 mt-4 overflow-auto ">
				<MarkdownComponent text={responseMessage} />
			</div>
		)
	}
	return <></>
}
