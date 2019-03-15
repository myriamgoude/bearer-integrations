import axios from 'axios';

export default function(token: string, type?: string) {
  let baseURL = 'https://www.googleapis.com/drive/v3/files';
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Bearer',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  if (type) {
    baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/'
  }

  return axios.create({
    baseURL,
    timeout: 5000,
    headers
  })
}
