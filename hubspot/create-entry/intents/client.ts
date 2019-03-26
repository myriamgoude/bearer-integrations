import axios from 'axios'

export default function(token: string, type: string) {
  let baseURL = '';
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'Bearer',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  switch (type) {
    case 'company':
      baseURL = 'https://api.hubapi.com/companies/v2/companies';
      break;
    case 'deal':
      baseURL = 'https://api.hubapi.com/deals/v1/deal';
      break;
    case 'contact':
      baseURL = 'https://api.hubapi.com/contacts/v1/contact';
  }

  return axios.create({
    baseURL,
    timeout: 5000,
    headers
  })
}
