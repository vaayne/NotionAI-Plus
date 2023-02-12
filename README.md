# NotionAI
Unofficial NotionAI API

https://github.com/Vaayne/NotionAI

## NotionAI Chrome Extension

 [notionai-chrome](./notionai-chrome)

The NotionAI Chrome Extension is an open-source tool that provides a simple way to access the NotionAI API. It allows you to use NotionAI in any input field in Chrome with ease.


## NotionAI Python SDK

NotionAI Python SDK, a wrapper for the NotionAI APIs with Python bindings. It simplifies integrating NotionAI solutions into your projects.


### Feature

- Full APIs from Notion AI
- Support stream response

### API

We support all NotionAI's functionalites. You can find all the APIs in [NotionAI.py](./notionai/notionai.py)

#### Basic API Shortcuts

APIs like blog_post, help_me_write, help_me_edit, summarize ... are shortcuts for the basic APIs.

#### Advanced APIs

Some times we don't want to call apis one by one, we want to dispatch by parameters, these are advanced APIs.

We support these advanced APIs:


1. `writing_with_topic`
    ```
    Writing for special topic
    Args:
        topic (TopicEnum): the special topic
        prompt (str): prompt for writing
    Example:
        ao = NotionAI(token)
        ai.writing_with_topic(TopicEnum.blog_post, "Please help to introduce Notion")
    ```
2. `writing_with_prompt`
    ```
    Writing with special prompt, like summarize, explain_this, improve_writing

    Args:
        prompt_type (PromptTypeEnum): special prompt
        context (str): the context for your writing

    Example:
        ai = NotionAI(token)
        ai.writing_with_prompt(PromptTypeEnum.summarize, "I am a student")
    ```
3. `translate`
    ```
    Translate the text
    Args:
        language (TranslateLanguageEnum): target language
        context (str): context to translate

    Example:
        ai = NotionAI(token)
        ai.translate(TranslateLanguageEnum.Chinese, "I am a student")
    ```


### Usage

#### Install

```
pip install --upgrade notionai-py
```

#### Get Notion Token

1. Open Chrome / Firefix DevTools
2. Find Cookies and copy value for `token_v2`

![](./docs/images/get_notion_token.png)

#### Example

Please checkout [examples](./examples/)

1. Basic

```python
import os
from notionai import NotionAI

TOKEN = os.getenv("NOTION_TOKEN")

def main():
    ai = NotionAI(TOKEN)
    res = ai.blog_post("write a blog about the meaning of life")
    print(res)

if __name__ == "__main__":
    main()

```

2. Stream API

```python
import os
import sys
from notionai import NotionAI

TOKEN = os.getenv("NOTION_TOKEN")

def main():
    ai = NotionAIStream(TOKEN)
    res = ai.blog_post("write a blog about the meaning of life")
    for item in res:
        sys.stdout.write(item)


if __name__ == "__main__":
    main()
```


3. WebUI

[webui](./examples/webui/README.md)
