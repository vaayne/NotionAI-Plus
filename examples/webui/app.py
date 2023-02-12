import os

import gradio as gr
from notionai import NotionAI
from notionai.enums import PromptTypeEnum, TopicEnum, TranslateLanguageEnum

TOKEN = os.getenv("NOTION_TOKEN")
ai = NotionAI(TOKEN)

TOPIC_MAPPING = {item.name: item for item in TopicEnum}
LANGUAGE_MAPPING = {item.name: item for item in TranslateLanguageEnum}
ACTION_TYPE_MAPPING = {item.name: item for item in PromptTypeEnum}


def write_by_topic(topic, prompt):
    res = ai.writing_with_topic(TOPIC_MAPPING[topic], prompt)
    return res


def translate(language, text):
    return ai.translate(TranslateLanguageEnum[language], text)


def summarize(action_type, context, prompt):
    return ai.writing_with_prompt(ACTION_TYPE_MAPPING[action_type], context, prompt)


app = gr.Blocks()

with app:
    gr.Markdown("Notion AI is here to serve your every need and make your life easier.")
    with gr.Tabs():
        with gr.TabItem("Write with Tpoics"):
            with gr.Column():
                topic_type = gr.Dropdown(
                    choices=[item.name for item in TopicEnum],
                    value=TopicEnum.brainsteam.value,
                    label="Topic",
                )
                topic_prompt = gr.Textbox(
                    lines=2, placeholder="What do you want ?", label="Prompt"
                )
                topic_output = gr.Markdown(
                    label="AI response", visible=True, value="Notion AI Says..."
                )
            topic_button = gr.Button("Write", label="Write")
        with gr.TabItem("Translate"):
            with gr.Column():
                translate_language = gr.Dropdown(
                    choices=[item.value for item in TranslateLanguageEnum],
                    label="Target Language",
                    value=TranslateLanguageEnum.english.value,
                )
                translate_text = gr.Textbox(
                    lines=2, placeholder="Translate texts", label="Text"
                )
                translate_output = gr.Markdown(
                    label="Translate response", visible=True, value="Translating..."
                )
            translate_button = gr.Button("Translate", label="Translate")
        with gr.TabItem("Summarize"):
            with gr.Column():
                summary_type = gr.Dropdown(
                    choices=[
                        item.name
                        for item in PromptTypeEnum
                        if item != PromptTypeEnum.translate
                    ],
                    label="Summary Type",
                    value="summarize",
                )
                summarize_text = gr.Textbox(
                    lines=2, placeholder="Summarize texts", label="Summary Text"
                )
                summarize_rompt = gr.Textbox(
                    lines=2,
                    placeholder="Only for help_me_write and help_me_edit",
                    label="Prompt",
                    value="",
                )

                summarize_output = gr.Markdown(
                    label="Summarize response", visible=True, value="Summarizing..."
                )
            summarize_button = gr.Button("Summarize", label="Summarize")

    topic_button.click(
        write_by_topic, inputs=[topic_type, topic_prompt], outputs=topic_output
    )
    translate_button.click(
        translate, inputs=[translate_language, translate_text], outputs=translate_output
    )
    summarize_button.click(
        summarize,
        inputs=[summary_type, summarize_text, summarize_rompt],
        outputs=summarize_output,
    )

app.launch(debug=True)
