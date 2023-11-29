import { useAtomValue } from "jotai"
import { responseMessageAtom } from "~lib/state"
import { MarkdownComponent } from "./makrdown"

export function OutputComponent() {
	const responseMessage = useAtomValue(responseMessageAtom)

	if (responseMessage) {
		return (
			<div className="non-draggable max-w-2xl p-2 mx-2 mt-0 mb-2 min-w-[192px] overflow-y-auto text-gray-800 bg-white rounded-lg max-h-64">
				<MarkdownComponent text={responseMessage} />
			</div>
		)
	}
	return <></>
}
