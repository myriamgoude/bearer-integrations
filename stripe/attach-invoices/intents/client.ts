import axios from 'axios'

export default function(token: string) {
  let baseURL = 'https://api.stripe.com/v1/';

  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Bearer',
    'Authorization': `Bearer ${token}`
  };

  return axios.create({
    baseURL,
    timeout: 5000,
    headers
  })
}
