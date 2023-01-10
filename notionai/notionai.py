import json
import uuid

import requests

from notionai.enums import ActionTypeEnum, TopicEnum, TranslateLanguageEnum

MODEL = "openai-1.1"
URL = "https://www.notion.so/api/v3/getCompletion"
PAGE_TITLE = "NotionAI Page"


class NotionAI(object):
    stream = False

    def __init__(
        self,
        token: str,
        model: str = MODEL,
        page_title: str = PAGE_TITLE,
    ) -> None:
        """Init NotionAI
        Args:
            token (str): Notion token_v2
            model (str, optional): AI model. Default to openai-1.1
            stream (bool, optional): use stream result. Defaults to False.
            pageTitle (str, optional): Title for your content. Defaults to PAGE_TITLE.
        """
        self.token = token
        self.model = model
        self.is_space_permission = False
        self.url = URL
        self.page_title = page_title

    def _write_topic(self, topic: TopicEnum, prompt: str) -> str:
        content = {"type": topic.value, "topic": prompt}
        return self._post(content)

    def _common_writing(self, action_type: ActionTypeEnum, context: str) -> str:
        content = {
            "type": action_type.value,
            "pageTitle": self.page_title,
            "selectedText": context,
        }
        return self._post(content)

    def _request(self, content: dict) -> str:
        payload = {
            "id": self._get_id(),
            "model": self.model,
            "spaceId": str(uuid.uuid4()),
            "isSpacePermission": self.is_space_permission,
            "context": content,
        }

        cookies = [
            "token_v2=" + self.token,
        ]

        headers = {
            "Cookie": "; ".join(cookies),
            "Content-Type": "application/json",
        }
        print(f"is stream: {self.stream}")

        return requests.post(
            self.url, json=payload, headers=headers, stream=self.stream
        )

    def _post(self, content: dict) -> str:
        r = self._request(content)
        data = r.text.split("\n")
        res = [self._parse_resp_line(d) for d in data]
        return "".join(res).strip("\n")

    def _parse_resp_line(self, line):
        if line:
            try:
                data = json.loads(line)
                if data["type"] == "success":
                    return data["completion"]
            except Exception as e:
                print(f"data: {line}, error: {e}")
        return ""

    def _get_id(self) -> str:
        return str(uuid.uuid4())

    def set_stream(self, stream: bool):
        self.stream = stream

    def help_me_write(self, prompt: str, context: str) -> str:
        content = {
            "type": ActionTypeEnum.helpMeWrite.value,
            "prompt": prompt,
            "pageTitle": self.page_title,
            "previousContent": context,
            "restContent": "",
        }
        return self._post(content)

    def continue_write(self, context: str) -> str:
        content = {
            "type": ActionTypeEnum.continueWriting.value,
            "pageTitle": self.page_title,
            "previousContent": context,
            "restContent": "",
        }
        return self._post(content)

    def help_me_edit(self, prompt: str, context: str) -> str:
        content = {
            "type": ActionTypeEnum.helpMeEdit.value,
            "pageTitle": self.page_title,
            "prompt": prompt,
            "selectedText": context,
        }
        return self._post(content)

    def translate(self, language: TranslateLanguageEnum, context: str) -> str:
        content = {
            "type": ActionTypeEnum.translate.value,
            "text": context,
            "language": language.value,
        }
        return self._post(content)

    def summarize(self, context: str) -> str:
        return self._common_writing(ActionTypeEnum.summarize, context)

    def improve_writing(self, context: str) -> str:
        return self._common_writing(ActionTypeEnum.improveWriting, context)

    def fix_spelling_grammar(self, context: str) -> str:
        return self._common_writing(ActionTypeEnum.fixSpellingGrammar, context)

    def explain_this(self, context: str) -> str:
        return self._common_writing(ActionTypeEnum.explainThis, context)

    def make_longer(self, context: str) -> str:
        return self._common_writing(ActionTypeEnum.makeLonger, context)

    def make_shorter(self, context: str) -> str:
        return self._common_writing(ActionTypeEnum.makeShorter, context)

    def find_action_items(self, context: str) -> str:
        return self._common_writing(ActionTypeEnum.findActionItems, context)

    def simplify_language(self, context: str) -> str:
        return self._common_writing(ActionTypeEnum.simplifyLanguage, context)

    def blog_post(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.blogPost, prompt)

    def brainsteam(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.brainsteam, prompt)

    def outline(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.outline, prompt)

    def socialMediaPost(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.socialMediaPost, prompt)

    def creativeStory(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.creativeStory, prompt)

    def poem(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.poem, prompt)

    def essay(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.essay, prompt)

    def meetingAgenda(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.meetingAgenda, prompt)

    def pressRelease(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.pressRelease, prompt)

    def jobDescription(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.jobDescription, prompt)

    def salesEmail(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.salesEmail, prompt)

    def recruitingEmail(self, prompt: str) -> str:
        return self._write_topic(TopicEnum.recruitingEmail, prompt)


class NotionAIStream(NotionAI):
    stream = True

    def _post(self, content: dict) -> str:
        r = self._request(content)
        for line in r.text.splitlines():
            yield self._parse_resp_line(line)
