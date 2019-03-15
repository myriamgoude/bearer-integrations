import axios from 'axios'

export default function(username: string, password: string) {
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Bearer',
  }

  return axios.create({
    baseURL: 'https://api.mailjet.com/v3/REST/contactslist/',
    timeout: 5000,
    auth: { username, password },
    headers
  })
}
