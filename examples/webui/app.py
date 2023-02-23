import os

import gradio as gr
from notionai import (
    NotionAI,
    PromptTypeEnum,
    TopicEnum,
    TranslateLanguageEnum,
    ToneEnum,
)

TOKEN = os.getenv("NOTION_TOKEN")
SPACE_ID = os.getenv("NOTION_SPACE_ID")
ai = NotionAI(TOKEN, SPACE_ID)

TOPIC_MAPPING = {item.name: item for item in TopicEnum}
LANGUAGE_MAPPING = {item.name: item for item in TranslateLanguageEnum}
PROMPT_TYPE_MAPPING = {item.name: item for item in PromptTypeEnum}
TONE_MAPPING = {item.name: item for item in ToneEnum}


def write_by_topic(topic, prompt):
    res = ai.writing_with_topic(TOPIC_MAPPING[topic], prompt)
    return res


def translate(language, text):
    return ai.translate(LANGUAGE_MAPPING[language], text)


def summarize(prompt_type, context):
    return ai.writing_with_prompt(PROMPT_TYPE_MAPPING[prompt_type], context)


def change_tone(tone, text):
    return ai.change_tone(text, TONE_MAPPING[tone])


def help_me_write(prompt, context):
    return ai.help_me_write(prompt, context)


app = gr.Blocks()

with app:
    gr.Markdown("Notion AI is here to serve your every need and make your life easier.")
    with gr.Tabs():
        with gr.TabItem("Help me Write"):
            with gr.Column():
                help_me_write_context = gr.Textbox(
                    lines=3,
                    placeholder="Let me help you write on the context.",
                    label="Context",
                )
                help_me_write_prompt = gr.Textbox(
                    lines=3,
                    placeholder="Please inpout your prompt here",
                    label="Prompt",
                )
                help_me_write_output = gr.Markdown(
                    label="AI response", visible=True, value="Notion AI Says..."
                )
            help_me_write_button = gr.Button("Help me Write", label="Help me Write")
        with gr.TabItem("Write with Tpoics"):
            with gr.Column():
                topic_type = gr.Dropdown(
                    choices=list(TOPIC_MAPPING.keys()),
                    value=TopicEnum.blog_post.name,
                    label="Topic",
                )
                topic_prompt = gr.Textbox(
                    lines=3,
                    placeholder="Let me help you write on the topic.",
                    label="Prompt",
                )
                topic_output = gr.Markdown(
                    label="AI response", visible=True, value="Notion AI Says..."
                )
            topic_button = gr.Button("Write", label="Write")
        with gr.TabItem("Translate"):
            with gr.Column():
                translate_language = gr.Dropdown(
                    choices=list(LANGUAGE_MAPPING.keys()),
                    label="Target Language",
                    value=TranslateLanguageEnum.japanese.name,
                )
                translate_text = gr.Textbox(
                    lines=2, placeholder="Translate texts", label="Text"
                )
                translate_output = gr.Markdown(
                    label="Translate response", visible=True, value="Translating..."
                )
            translate_button = gr.Button("Translate", label="Translate")
        with gr.TabItem("ChangeTone"):
            with gr.Column():
                tone = gr.Dropdown(
                    choices=list(TONE_MAPPING.keys()),
                    label="Which tone do you want to change to?",
                    value=ToneEnum.professional.name,
                )
                tone_text = gr.Textbox(lines=2, placeholder="Your texts", label="Text")
                tone_output = gr.Markdown(
                    label="Tone Response", visible=True, value="processing..."
                )
            change_tone_button = gr.Button("ChangeTone", label="change_tone")
        with gr.TabItem("More..."):
            with gr.Column():
                summary_type = gr.Dropdown(
                    choices=[
                        item
                        for item in PROMPT_TYPE_MAPPING.keys()
                        if item != PromptTypeEnum.translate.name
                        and item != PromptTypeEnum.change_tone.name
                        and item != PromptTypeEnum.help_me_edit.name
                        and item != PromptTypeEnum.help_me_write.name
                    ],
                    label="Prompt Type",
                    value=PromptTypeEnum.improve_writing.name,
                )
                summarize_text = gr.Textbox(
                    lines=2, placeholder="How to process your text?", label="Texts"
                )
                summarize_output = gr.Markdown(
                    label="Summarize response", visible=True, value="Processing..."
                )
            summarize_button = gr.Button("Summarize", label="Summarize")

    help_me_write_button.click(
        help_me_write,
        inputs=[help_me_write_prompt, help_me_write_context],
        outputs=help_me_write_output,
    )
    topic_button.click(
        write_by_topic, inputs=[topic_type, topic_prompt], outputs=topic_output
    )
    translate_button.click(
        translate, inputs=[translate_language, translate_text], outputs=translate_output
    )
    change_tone_button.click(change_tone, inputs=[tone, tone_text], outputs=tone_output)
    summarize_button.click(
        summarize,
        inputs=[summary_type, summarize_text],
        outputs=summarize_output,
    )

app.launch(debug=True)
