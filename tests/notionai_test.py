import os
import time

import pytest

from notionai import NotionAI
from notionai.enums import PromptTypeEnum, ToneEnum, TopicEnum, TranslateLanguageEnum

ai = NotionAI(token=os.getenv("NOTION_TOKEN"))


@pytest.fixture(autouse=True)
def wait_for_ratelimit():
    yield
    time.sleep(10)


def test_translate():
    prompt = "test translate prompt, 测试翻译"
    for lang in TranslateLanguageEnum.list():
        res = ai.translate(context=prompt, language=TranslateLanguageEnum(lang))
        assert res != "", f"lang:{lang}\t prompt:{prompt}\t res:{res}"


def test_writing_with_topic():
    prompt = "test writing with topic prompt"
    for topic in TopicEnum.list():
        res = ai.writing_with_topic(topic=TopicEnum(topic), prompt=prompt)
        assert res != "", f"topic: {topic}\t prompt:{prompt}\t res: {res}"


def test_writing_with_prompt():
    prompt = "using pytest to test writing with prompt"
    for prompt_type in PromptTypeEnum.list():
        if prompt_type in {
            PromptTypeEnum.translate.value,
            PromptTypeEnum.help_me_edit.value,
            PromptTypeEnum.change_tone.value,
            PromptTypeEnum.help_me_write.value,
        }:
            continue
        res = ai.writing_with_prompt(
            prompt_type=PromptTypeEnum(prompt_type), context=prompt
        )
        assert res != "", f"prompt_type: {prompt_type}\t prompt:{prompt}\t res: {res}"


def test_change_tone():
    prompt = "I dont like this tone"
    for tone in ToneEnum.list():
        res = ai.change_tone(context=prompt, tone=ToneEnum(tone))
        assert res != "", f"tone: {tone}\t prompt:{prompt}\t res: {res}"


def test_help_me_edit():
    prompt = "write something for me about NotionAI"
    context = "I am using NotionAI to write something"
    res = ai.help_me_edit(prompt=prompt, context=context, page_title="NotionAI")
    assert res != "", f"prompt: {prompt}\t res: {res}"


def test_help_me_write():
    prompt = "write something for me about NotionAI"
    context = "I am using NotionAI to write something"
    res = ai.help_me_write(prompt=prompt, context=context, page_title="NotionAI")
    assert res != "", f"prompt: {prompt}\t res: {res}"
