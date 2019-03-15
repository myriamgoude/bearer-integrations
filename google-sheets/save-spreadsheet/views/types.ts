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

export type Sheet = {
  spreadsheetId: string;
  spreadsheetUrl: string;
  properties: {
    title: string
  }
}

export type NavigationItem = File

export type TAuthSavedPayload = {
  authId: string
}
