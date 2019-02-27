export type File = {
  id: string
  kind: string
  name: string
  mimeType: string
  size: string
  webViewLink: string
  path: string[]
  parents: string[]
}

export type TAuthSavedPayload = {
  authId: string
}
