import json
import uuid

import requests

from notionai.enums import PromptTypeEnum, ToneEnum, TopicEnum, TranslateLanguageEnum

MODEL = "openai-3"
URL = "https://www.notion.so/api/v3/getCompletion"


class NotionAIBase(object):
    stream = False

    def __init__(
        self,
        token: str,
        space_id: str,
        model: str = MODEL,
    ) -> None:
        """Init NotionAI
        Args:
            token (str): Notion token_v2
            space_id (str): Notion workspace id
            model (str, optional): AI model. Default to openai-1.1
            stream (bool, optional): use stream result. Defaults to False.
            pageTitle (str, optional): Title for your content. Defaults to PAGE_TITLE.
        """
        self.token = token
        self.space_id = space_id
        self.model = model
        self.is_space_permission = False
        self.url = URL

    def _request(self, content: dict) -> str:
        payload = {
            "id": self._get_id(),
            "model": self.model,
            "spaceId": self.space_id,
            "isSpacePermission": self.is_space_permission,
            "context": content,
        }

        headers = self._build_headers(self.token)
        return requests.post(
            self.url, json=payload, headers=headers, stream=self.stream
        )

    @classmethod
    def _build_headers(cls, token: str):
        cookies = [
            "token_v2=" + token,
        ]

        return {
            "accept": "application/json",
            "Cookie": "; ".join(cookies),
            "Content-Type": "application/json",
        }

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


class NotionAI(NotionAIBase):
    @classmethod
    def get_spaces(cls, token: str) -> list[dict]:
        """Get all spaces
        Params:
            token (str): Notion token_v2

        Returns:
            list[dict]: list of spaces with id and name

        Example: [
            {"id": "space_id_1", "name": "space_name"},
            {"id": "space_id_2", "name": "space_name"}
        ]
        """
        url = "https://www.notion.so/api/v3/getSpaces"
        r = requests.post(url, headers=cls._build_headers(token))
        if r.status_code != 200:
            raise ValueError("Cannot get spaces")
        res = r.json()
        spaces = []
        for _, val in res.items():
            space = val.get("space")
            if space:
                for k, v in space.items():
                    space_id = k
                    space_name = v["value"]["name"]
                    spaces.append({"id": space_id, "name": space_name})
        return spaces

    def writing_with_topic(self, topic: TopicEnum, prompt: str) -> str:
        """Writing for special topic

        Args:
            topic (TopicEnum): the special topic
            prompt (str): prompt for writing

        Returns:
            str: Response from NotionAI
        """
        content = {"type": topic.value, "topic": prompt}
        return self._post(content)

    def writing_with_prompt(
        self,
        prompt_type: PromptTypeEnum,
        context: str,
        page_title: str = "",
    ) -> str:
        """Writing with special prompt, like summarize, explain_this, improve_writing

        Args:
            prompt_type (PromptTypeEnum): special prompt
            context (str): the context for your writing
            page_title (str, optional): I am not sure about this. Defaults to ""

        Returns:
            str: Response from NotionAI
        """
        if prompt_type == PromptTypeEnum.continue_writing:
            return self.continue_write(context, page_title)

        if prompt_type in {
            PromptTypeEnum.help_me_write,
            PromptTypeEnum.help_me_edit,
            PromptTypeEnum.translate,
            PromptTypeEnum.change_tone,
        }:
            raise ValueError("Please use the specific method for this prompt type")
        content = {
            "type": prompt_type.value,
            "pageTitle": page_title,
            "selectedText": context,
        }
        return self._post(content)

    def help_me_write(
        self, prompt: str, context: str, page_title: str = "", rest_content: str = ""
    ) -> str:
        """Help me write, ask AI to write for you

        Args:
            prompt (str): your prompt, could be anything
            context (str): context for your writing
            page_title (str, optional): not sure. Defaults to "".
            rest_content (str, optional): more context. Defaults to "".

        Returns:
            str: Response from NotionAI
        """
        content = {
            "type": PromptTypeEnum.help_me_write.value,
            "prompt": prompt,
            "pageTitle": page_title,
            "previousContent": context,
            "restContent": rest_content,
        }
        return self._post(content)

    def continue_write(
        self, context: str, page_title: str = "", rest_content: str = ""
    ) -> str:
        """Continue writing, generating more

        Args:
            context (str): context for continue
            page_title (str, optional): not sure. Defaults to "".
            rest_content (str, optional): more context. Defaults to "".

        Returns:
            str: Response from NotionAI
        """
        content = {
            "type": PromptTypeEnum.continue_writing.value,
            "pageTitle": page_title,
            "previousContent": context,
            "restContent": rest_content,
        }
        return self._post(content)

    def help_me_edit(self, prompt: str, context: str, page_title: str = "") -> str:
        """Help me edit somethings, it will change the current context

        Args:
            prompt (str): your prompt, could be anything
            context (str): context to edit
            page_title (str, optional): not sure. Defaults to "".

        Returns:
            str: Response from NotionAI
        """

        content = {
            "type": PromptTypeEnum.help_me_edit.value,
            "pageTitle": page_title,
            "prompt": prompt,
            "selectedText": context,
        }
        return self._post(content)

    def translate(self, language: TranslateLanguageEnum, context: str) -> str:
        """Use NotionAI to translate your context

        Args:
            language (TranslateLanguageEnum): target language
            context (str): context to translate

        Returns:
            str: translate result
        """
        content = {
            "type": PromptTypeEnum.translate.value,
            "text": context,
            "language": language.value,
        }
        return self._post(content)

    def change_tone(self, context: str, tone: ToneEnum) -> str:
        """Change the tone of your context

        Args:
            context (str): context to change
            tone (ToneEnum): target tone

        Returns:
            str: Response from NotionAI
        """
        content = {
            "type": "changeTone",
            "tone": tone.value,
            "text": context,
        }
        return self._post(content)

    def summarize(self, context: str, page_title: str = "") -> str:
        return self.writing_with_prompt(PromptTypeEnum.summarize, context)

    def improve_writing(self, context: str, page_title: str = "") -> str:
        return self.writing_with_prompt(PromptTypeEnum.improve_writing, context)

    def fix_spelling_grammar(self, context: str, page_title: str = "") -> str:
        return self.writing_with_prompt(
            PromptTypeEnum.fix_spelling_grammar,
            context,
            page_title=page_title,
        )

    def explain_this(self, context: str, page_title: str = "") -> str:
        return self.writing_with_prompt(
            PromptTypeEnum.explain_this, context, page_title=page_title
        )

    def make_longer(self, context: str, page_title: str = "") -> str:
        return self.writing_with_prompt(
            PromptTypeEnum.make_longer, context, page_title=page_title
        )

    def make_shorter(self, context: str, page_title: str = "") -> str:
        return self.writing_with_prompt(
            PromptTypeEnum.make_shorter, context, page_title=page_title
        )

    def find_action_items(self, context: str, page_title: str = "") -> str:
        return self.writing_with_prompt(
            PromptTypeEnum.find_action_items, context, page_title=page_title
        )

    def simplify_language(self, context: str, page_title: str = "") -> str:
        return self.writing_with_prompt(
            PromptTypeEnum.simplify_language, context, page_title=page_title
        )

    def blog_post(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.blog_post, prompt)

    def brainstorm_ideas(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.brainstorm_ideas, prompt)

    def outline(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.outline, prompt)

    def social_media_post(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.social_media_post, prompt)

    def creative_story(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.creative_story, prompt)

    def poem(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.poem, prompt)

    def essay(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.essay, prompt)

    def meeting_agenda(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.meeting_agenda, prompt)

    def press_release(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.press_release, prompt)

    def job_description(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.job_description, prompt)

    def sales_email(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.sales_email, prompt)

    def recruiting_email(self, prompt: str) -> str:
        return self.writing_with_topic(TopicEnum.recruiting_email, prompt)

    def pros_cons_list(self, prompt: str) -> str:
        self.writing_with_topic(TopicEnum.pros_cons_list, prompt)


class NotionAIStream(NotionAI):
    stream = True

    def _post(self, content: dict) -> str:
        r = self._request(content)
        for line in r.text.splitlines():
            yield self._parse_resp_line(line)
