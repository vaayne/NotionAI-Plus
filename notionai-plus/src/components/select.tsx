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
          className="input-xs input-bordered input-primary w-full box-border px-2 text-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      )
    }
  }

  return (
    // <div className="flex flex-row items-center mx-2">
    <select
      className="flex-1 select-xs select-primary w-1/3 text-sm dark:bg-info-content dark:text-white"
      value={selectedPrompt}
      // defaultValue="default"
      onChange={(e) => handleSelect(e.target.value)}>
      <option value="default" key="default">
        --- 📝 Select your prompt ---
      </option>
      {TopicOptions.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
      {PromptTypeOptions.map((option) => {
        if (
          option.value === PromptTypeEnum.ChatGPT ||
          option.value === PromptTypeEnum.ChangeTone ||
          option.value === PromptTypeEnum.Translate ||
          option.value === PromptTypeEnum.TopicWriting ||
          option.value === PromptTypeEnum.HelpMeWrite
        ) {
        } else {
          return (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          )
        }
      })}
      <option disabled value="TopicWriting" key="TopicWriting">
        --- 📝 Topic Writing ---
      </option>
      {TopicOptions.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
      <option disabled value="ChangeTone" key="ChangeTone">
        --- 🎭 Change Tone ---
      </option>
      {ToneOptions.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
      <option disabled value="Translate" key="Translate">
        --- 🌐 Translate ---
      </option>
      {LanguageOptions.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    //<div className="flex-1">{promptOptions()}</div>
    // </div>
  )
}
