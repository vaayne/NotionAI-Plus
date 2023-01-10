from enum import Enum


class ExtendedEnum(Enum):
    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))

    @classmethod
    def set(cls):
        return set(cls.list())


class TopicEnum(ExtendedEnum):
    brainsteam = "brainsteam"
    blogPost = "blogPost"
    outline = "outline"
    socialMediaPost = "socialMediaPost"
    creativeStory = "creativeStory"
    poem = "poem"
    essay = "essay"
    meetingAgenda = "meetingAgenda"
    pressRelease = "pressRelease"
    jobDescription = "jobDescription"
    salesEmail = "salesEmail"
    recruitingEmail = "recruitingEmail"


class TranslateLanguageEnum(ExtendedEnum):
    english = "english"
    korean = "korean"
    chinese = "chinese"
    japanese = "japanese"
    spanish = "spanish"
    russiab = "russia"
    french = "frence"
    german = "german"
    italian = "italian"
    portuguese = "portuguese"
    dutch = "dutch"
    indonesia = "indonesia"
    tagalog = "tagalog"
    vietnamese = "vietnamese"


class ActionTypeEnum(ExtendedEnum):
    helpMeWrite = "helpMeWrite"
    continueWriting = "continueWriting"
    summarize = "summarize"
    improveWriting = "improveWriting"
    fixSpellingGrammar = "fixSpellingGrammar"
    translate = "translate"
    explainThis = "explainThis"
    makeLonger = "makeLonger"
    makeShorter = "makeShorter"
    findActionItems = "findActionItems"
    simplifyLanguage = "simplifyLanguage"
    helpMeEdit = "helpMeEdit"
