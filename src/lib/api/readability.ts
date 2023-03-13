const HOST = "https://readability.theboys.tech/"

export type ParseResult = {
  title: string
  content: string
  author: string
  date_published: string
  lead_image_url: string
  dek: string
  next_page_url: string
  url: string
  domain: string
  excerpt: string
  word_count: number
  direction: string
  total_pages: number
  rendered_pages: number
}

async function Parse(url: string): Promise<ParseResult> {
  try {
    const path = "api/parser"
    const query = `?url=${url}`
    const encodedURL = encodeURI(HOST + path + query)
    const resp = await fetch(encodedURL)
    const data = await resp.json()
    // console.log(`readability response: ${JSON.stringify(data)}`)
    return data as ParseResult
  } catch (error) {
    console.log(`readability error: ${error}`)
    throw new Error(error)
  }
}

export { Parse }
