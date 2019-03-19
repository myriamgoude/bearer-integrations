import axios from 'axios'

export default function(token: string, type: string) {
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'Bearer',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  return axios.create({
    baseURL: `https://api.hubapi.com/${type}/v1/${type}`,
    timeout: 5000,
    headers
  })
}
