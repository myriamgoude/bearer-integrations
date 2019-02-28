import axios from 'axios'

export default function(token: string) {
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'Bearer',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  return axios.create({
    baseURL: 'https://api.dropboxapi.com/2/',
    timeout: 5000,
    headers
  })
}
