import axios from 'axios';

export default function(token: string, path?: string, type?: string) {
  let baseURL = 'https://api.dropboxapi.com/2/';
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Bearer',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  if (type === 'upload') {
    baseURL = 'https://content.dropboxapi.com/2/files/upload';
    headers['Content-Type'] = 'application/octet-stream';
    headers['Dropbox-API-Arg'] = JSON.stringify({
      'path': path,
      'mode': 'add',
      'autorename': true,
      'mute': false
    })
  }

  return axios.create({
    baseURL,
    timeout: 5000,
    headers
  })
}
