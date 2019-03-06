export type File = {
  id: string
  '.tag': string
  name: string
  size: string
  path_lower: string
  preview_link: string
  path_display: string
}

export type NavigationItem = File

export type TAuthSavedPayload = {
  authId: string
}
