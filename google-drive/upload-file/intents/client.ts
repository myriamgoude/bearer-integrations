import axios from 'axios'

export default function(token: string, type?: string) {
  let baseURL = 'https://www.googleapis.com/drive/v3/files'

  const headers = {
    Accept: 'application/json',
    'User-Agent': 'Bearer',
    Authorization: `Bearer ${token}`
  }

  if (type === 'upload') {
    baseURL = 'https://www.googleapis.com/upload/drive/v3/files'
  }

  return axios.create({
    baseURL,
    timeout: 5000,
    headers
  })
}
