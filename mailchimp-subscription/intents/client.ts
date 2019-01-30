import axios from 'axios'

export default function(token: string) {
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Bearer',
    'Authorization': `Basic ${token}`
  }
  //datacenter is encoded with the api key so extract it...
  const datacenter = token.split('-').reverse()[0]
  //TODO: should we validate the datacenter?
  return axios.create({
    baseURL: `https://${datacenter}.api.mailchimp.com/3.0`,
    timeout: 5000,
    headers
  })
}