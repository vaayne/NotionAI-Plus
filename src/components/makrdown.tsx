import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import rehypeMathjax from "rehype-mathjax"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

type MarkdownComponentProps = {
	text: string
}

export function MarkdownComponent(props: MarkdownComponentProps) {
	return (
		<ReactMarkdown
			className="p-2 mx-2 prose max-w-none dark:prose-invert text-start rounded-xl"
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeMathjax]}
			components={{
				code({ node, inline, className, children, ...props }) {
					const match = /language-(\w+)/.exec(className || "")
					return !inline && match ? (
						<SyntaxHighlighter
							{...props}
							style={oneDark}
							language={match[1]}
							PreTag="div"
						>
							{String(children).replace(/\n$/, "")}
						</SyntaxHighlighter>
					) : (
						<code {...props} className={className}>
							{children}
						</code>
					)
				},
			}}
		>
			{props.text}
		</ReactMarkdown>
	)
}
