import { Menu } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { useAtomValue, useSetAtom } from "jotai"
import { Fragment, startTransition, useState } from "react"
import { PromptTypeEnum, PromptTypeMappings, PromptOptions } from "~lib/enums"
import {
	iconPositionDirectionAtom,
	isShowElementAtom,
	selectedPromptAtom,
} from "~lib/atoms"

export default function DropdownMenuComponent() {
	const [subPrompt, setSubPrompt] = useState<string | null>("")
	const setSelectedPrompt = useSetAtom(selectedPromptAtom)
	const setIsShowElement = useSetAtom(isShowElementAtom)
	const iconPositionDirection = useAtomValue(iconPositionDirectionAtom)

	const itemButton = (prompt: string) => {
		return (
			<Menu.Item key={prompt}>
				{({ active }) => (
					<button
						className={`${
							active
								? "bg-violet-500 text-white"
								: "text-gray-900"
						} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
						value={prompt}
						onClick={e => {
							startTransition(() => {
								setIsShowElement(true)
								setSelectedPrompt(e.target.value)
							})
						}}
					>
						{PromptTypeMappings.get(prompt)?.label}
					</button>
				)}
			</Menu.Item>
		)
	}

	const subItemButton = (prompt: string) => {
		const subPrompts = PromptOptions.filter(o => o.category == prompt)
		return (
			<div className="px-1 py-1 ">
				<Menu.Item key={prompt.value}>
					{({ active }) => (
						<button
							className={`${
								active
									? "bg-violet-500 text-white"
									: "text-gray-900"
							} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
							onClick={e => {
								e.preventDefault()
								setSubPrompt(
									prompt == subPrompt ? null : prompt
								)
							}}
						>
							{PromptTypeMappings.get(prompt).label}
							<ChevronDownIcon className="w-5 h-5" />
						</button>
					)}
				</Menu.Item>
				{subPrompt == prompt && (
					<Fragment>
						{subPrompts.map(p => itemButton(p.value))}
					</Fragment>
				)}
			</div>
		)
	}

	return (
		<div className="w-full">
			<Menu as="div" className="relative inline-block text-left">
				{({ close, open }) => (
					<Fragment>
						<div>
							<Menu.Button className="inline-flex items-center justify-center w-full p-1 text-sm text-white rounded-md min-w-24 bg-violet-600 hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
								AIPlus
								<ChevronDownIcon
									className="w-4 h-4 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
									aria-hidden="true"
								/>
							</Menu.Button>
						</div>
						<Menu.Items
							className={`absolute w-56 h-48 mt-2 overflow-auto bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${iconPositionDirection}`}
						>
							<div className="px-1 py-1">
								{PromptOptions.filter(
									p =>
										![
											PromptTypeEnum.TopicWriting.toString(),
											PromptTypeEnum.ChangeTone.toString(),
											PromptTypeEnum.Translate.toString(),
										].includes(p.value) && p.category == ""
								).map(p => itemButton(p.value))}
							</div>
							{subItemButton(PromptTypeEnum.Translate.toString())}
							{subItemButton(
								PromptTypeEnum.TopicWriting.toString()
							)}
							{subItemButton(
								PromptTypeEnum.ChangeTone.toString()
							)}
						</Menu.Items>
					</Fragment>
				)}
			</Menu>
		</div>
	)
}
