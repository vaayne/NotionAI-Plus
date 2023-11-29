import browser from "webextension-polyfill"

export const streamPort = browser.runtime.connect({ name: "stream" })
