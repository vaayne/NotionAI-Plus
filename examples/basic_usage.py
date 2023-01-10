from notionai.notionai import NotionAI, NotionAIStream
import sys
import os

TOKEN = os.getenv("NOTION_TOKEN")


def write_blog(prompt: str):
    ai = NotionAI(TOKEN)
    res = ai.blog_post(prompt)
    print(res)


def write_blog_stream(prompt: str):
    ai = NotionAIStream(TOKEN)
    res = ai.blog_post(prompt)
    for item in res:
        sys.stdout.write(item)


def main():
    prompt = "Introduce Notion"
    write_blog(prompt)
    write_blog_stream(prompt)


if __name__ == "__main__":
    main()
