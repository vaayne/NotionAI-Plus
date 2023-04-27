// fetch with retry
export async function rfetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let message = ""
  for (let i = 0; i < 3; i++) {
    try {
      return await ifetch(input, init)
    } catch (err) {
      console.error(err)
      message = err.message
    }
  }
  throw new Error(message)
}

async function ifetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const resp = await fetch(input, init)
  if (resp.status == 200) {
    return resp
  } else {
    throw new Error(`Fetch error, status: ${resp.status}`)
  }
}
