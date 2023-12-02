import { Combobox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { useAtom, useSetAtom } from "jotai"
import {
	isShowElementAtom,
	queryTextAtom,
	selectedPromptAtom,
} from "~lib/atoms"

import {
	type PromptType,
	PromptOptions,
	PromptTypeMappings,
	getPromptTypeLabel,
} from "~lib/enums"

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(" ")
}

export default function ContextMenuComponent() {
	const [query, setQuery] = useAtom(queryTextAtom)
	const [selectedPrompt, setSelectedPrompt] = useAtom(selectedPromptAtom)

	const filteredOptions =
		query === ""
			? PromptOptions
			: PromptOptions.filter(option => {
					return option.label
						.toLowerCase()
						.includes(query.toLowerCase())
			  })

	return (
		<Combobox
			as="button"
			value={PromptTypeMappings.get(selectedPrompt)}
			onChange={e => {
				setSelectedPrompt(e.value)
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
							className="w-full h-8 py-[6px] text-sm pl-3 pr-10 bg-white border-0 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							onChange={event => setQuery(event.target.value)}
							placeholder="What do you want to write?"
							displayValue={(option: PromptType) =>
								getPromptTypeLabel(option)
							}
						/>
						<span className="absolute right-2 bottom-2">
							<ChevronUpDownIcon className="w-3 h-3 text-gray-400 origin-center stroke-current" />
						</span>
					</Combobox.Button>
				</div>

				{filteredOptions.length > 0 && (
					<Combobox.Options className="box-border absolute z-10 py-1 mt-1 overflow-auto text-sm bg-white rounded-md shadow-lg min-w-64 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
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
													"ml-1 truncate",
													selected && "font-semibold"
												)}
											>
												{getPromptTypeLabel(option)}
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
