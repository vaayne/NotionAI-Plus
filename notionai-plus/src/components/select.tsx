import {
  LanguageOptions,
  PromptTypeEnum,
  PromptTypeOptions,
  ToneOptions,
  TopicOptions
} from "~lib/enums"

export const SelectComponent = ({
  selectedPrompt,
  setSelectedPrompt,
  prompt,
  setPrompt
}) => {
  const handleSelect = (value: string) => {
    // clear select
    setPrompt("")
    setSelectedPrompt(value)
  }

  const promptOptions = () => {
    if (
      selectedPrompt == PromptTypeEnum.HelpMeWrite ||
      selectedPrompt == PromptTypeEnum.ChatGPT
    ) {
      return (
        <input
          type="text"
          placeholder="Please input you custom prompt"
          className="input input-bordered input-primary w-full box-border px-2"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      )
    }
  }

  return (
    <div className="flex flex-row items-center mx-2">
      <select
        className="select select-primary w-1/3"
        value={selectedPrompt}
        onChange={(e) => handleSelect(e.target.value)}>
        {PromptTypeOptions.map((option) => {
          if (
            option.value === PromptTypeEnum.ChatGPT ||
            option.value === PromptTypeEnum.ChangeTone ||
            option.value === PromptTypeEnum.Translate ||
            option.value === PromptTypeEnum.TopicWriting
          ) {
          } else {
            return <option value={option.value}>{option.label}</option>
          }
        })}
        <option disabled>--- 📝 Topic Writing ---</option>
        {TopicOptions.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
        <option disabled>--- 🎭 Change Tone ---</option>
        {ToneOptions.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
        <option disabled>--- 🌐 Translate ---</option>
        {LanguageOptions.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className="flex-1">{promptOptions()}</div>
    </div>
  )
}
