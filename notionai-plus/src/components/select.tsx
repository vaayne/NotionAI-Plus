import {
  LanguageOptions,
  PromptTypeEnum,
  PromptTypeOptions,
  ToneOptions,
  TopicOptions
} from "~lib/enums"

export const SelectComponent = ({
  isFullMode,
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
    if (selectedPrompt == PromptTypeEnum.HelpMeWrite) {
      return (
        <input
          type="text"
          placeholder="Please input you custom prompt"
          className={` ${
            isFullMode ? "input-sm" : "input-xs"
          } input-bordered input-primary w-full box-border px-2 text-sm rounded-lg`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      )
    }
  }

  return (
    <div className="flex-1 flex flex-row items-center mx-1">
      <select
        className={` ${
          isFullMode ? "text select" : "text-xs select-xs"
        } shrink  select-primary w-1/2  dark:bg-info-content dark:text-white rounded-lg`}
        value={selectedPrompt}
        onChange={(e) => handleSelect(e.target.value)}>
        <option value="default" key="default">
          📝 Select your prompt
        </option>
        {PromptTypeOptions.map((option) => {
          if (
            option.value === PromptTypeEnum.ChangeTone ||
            option.value === PromptTypeEnum.Translate ||
            option.value === PromptTypeEnum.TopicWriting
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
      <div className="w-full mx-1">{promptOptions()}</div>
    </div>
  )
}
