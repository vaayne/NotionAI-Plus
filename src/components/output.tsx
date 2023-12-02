import { useAtomValue } from "jotai"
import { responseMessageAtom } from "~lib/atoms"
import { MarkdownComponent } from "./makrdown"

export function OutputComponent() {
	const responseMessage = useAtomValue(responseMessageAtom)

	if (responseMessage) {
		return (
			<div className="max-w-2xl p-2 mx-2 mt-0 mb-2 overflow-y-auto text-gray-800 bg-white rounded-lg non-draggable min-w-xl max-h-64">
				<MarkdownComponent text={responseMessage} />
			</div>
		)
	}
	return <></>
}
