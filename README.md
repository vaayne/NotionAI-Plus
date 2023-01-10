# NotionAI
Unofficial NotionAI API

https://github.com/Vaayne/NotionAI

## Feature

- Full APIs from Notion AI
- Support stream response

## Usage

### Install

```
pip install --upgrade notionai-py
```

### Get Notion Token

1. Open Chrome / Firefix DevTools
2. Find Cookies and copy value for `token_v2`

![](./docs/images/get_notion_token.png)

### Example

#### Basic

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

#### Stream API

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
