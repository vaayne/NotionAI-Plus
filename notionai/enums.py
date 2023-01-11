from enum import Enum


class ExtendedEnum(Enum):
    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))

    @classmethod
    def list_name(cls):
        return list(map(lambda c: c.name, cls))


class TopicEnum(ExtendedEnum):
    brainsteam = "brainsteam"
    blog_post = "blogPost"
    outline = "outline"
    social_media_post = "socialMediaPost"
    creative_story = "creativeStory"
    poem = "poem"
    essay = "essay"
    meeting_agenda = "meetingAgenda"
    press_release = "pressRelease"
    job_description = "jobDescription"
    sales_email = "salesEmail"
    recruiting_email = "recruitingEmail"


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


class PromptTypeEnum(ExtendedEnum):
    help_me_write = "helpMeWrite"
    continue_writing = "continueWriting"
    summarize = "summarize"
    improve_writing = "improveWriting"
    fix_spelling_grammar = "fixSpellingGrammar"
    translate = "translate"
    explain_this = "explainThis"
    make_longer = "makeLonger"
    make_shorter = "makeShorter"
    find_action_items = "findActionItems"
    simplify_language = "simplifyLanguage"
    help_me_edit = "helpMeEdit"
