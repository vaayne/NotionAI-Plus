import { Combobox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { useAtom, useSetAtom } from "jotai"
import {

	isShowElementAtom,

	queryTextAtom,
	selectedPromptAtom,
} from "~/lib/state"

import {
	PromptTypeOptions,
	type PromptType,
	ToneOptions,
	TopicOptions,
	LanguageOptions,
	PromptTypeEnum,
} from "~lib/enums"
import { startTransition } from "react"

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(" ")
}

const Options: PromptType[] = [
	...PromptTypeOptions.filter(option => {
		return (
			option.value !== PromptTypeEnum.ChangeTone &&
			option.value !== PromptTypeEnum.Translate &&
			option.value !== PromptTypeEnum.TopicWriting
		)
	}),
	...ToneOptions.map(option => {
		option.label = `🎭 Change Tone - ${option.label}`
		return option
	}),
	...TopicOptions.map(option => {
		option.label = `📝 Topic - ${option.label}`
		return option
	}),
	...LanguageOptions.map(option => {
		option.label = `🌐 Translate - ${option.label}`
		return option
	}),
]

export default function ContextMenuComponent() {
	const [query, setQuery] = useAtom(queryTextAtom)
	const [selectedPrompt, setSelectedPrompt] = useAtom(selectedPromptAtom)
	const setIsShowElement = useSetAtom(isShowElementAtom)

	const filteredOptions =
		query === ""
			? Options
			: Options.filter(option => {
					return option.label
						.toLowerCase()
						.includes(query.toLowerCase())
			  })

	return (
		<Combobox
			as="button"
			value={selectedPrompt}
			onChange={e => {
				startTransition(() => {
					setIsShowElement(true)
					setSelectedPrompt(e)
				})
			}}
			className="w-full"
		>
			<div className="relative">
				<div className="flex flex-row items-center space-x-1">
					<Combobox.Button
						as="div"
						className="relative items-center flex-1"
					>
						<Combobox.Input
							className="w-full h-8 py-[6px] text-sm pl-3 pr-10 bg-white border-0 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
							onChange={event =>
								startTransition(() =>
									setQuery(event.target.value)
								)
							}
							placeholder="What do you want to write?"
							displayValue={(option: PromptType) => option?.label}
						/>
						<span className="absolute right-2 bottom-2">
							<ChevronUpDownIcon className="w-3 h-3 text-gray-400 origin-center stroke-current" />
						</span>
					</Combobox.Button>
				</div>

				{filteredOptions.length > 0 && (
					<Combobox.Options className="box-border absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredOptions.map(option => (
							<Combobox.Option
								key={option.value}
								value={option}
								className={({ active }) =>
									classNames(
										"relative cursor-default select-none py-2 pl-3 pr-9",
										active
											? "bg-indigo-600 text-white"
											: "text-gray-900"
									)
								}
							>
								{({ active, selected }) => (
									<>
										<div className="flex items-center">
											<span
												className={classNames(
													"ml-3 truncate",
													selected && "font-semibold"
												)}
											>
												{option.label}
											</span>
										</div>

										{selected && (
											<span
												className={classNames(
													"absolute inset-y-0 right-0 flex items-center pr-4",
													active
														? "text-white"
														: "text-indigo-600"
												)}
											>
												<CheckIcon
													className="w-5 h-5"
													aria-hidden="true"
												/>
											</span>
										)}
									</>
								)}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</div>
		</Combobox>
	)
}
