// Create a Http Client using Fetch API

const baseUrl = process.env['REACT_APP_API_BASE_URL']
const fetchError = response => {
  if (!response.ok) {
    if(response.status === 401) {
      // TODO-- redirect properly
    }
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
  return response
}

const post = (url = '', data = '', headers = {}) => {
  if( !(data instanceof FormData) ) {
    data = JSON.stringify(data)
  }
  return fetch(baseUrl + url, {
    method: 'POST',
    body: data,
    headers: headers
  }).then(fetchError).then(res => res.json())
}

const get = (url, headers = {}) => {
  return fetch(baseUrl + url, {
    headers: headers
  }).then(fetchError).then(res => res.json())
}

//Cannot define a delete method - Cause delete is a keyword.
const del = (url = '', headers = {}) => {
  return fetch(baseUrl + url, {
    method: 'DELETE',
    headers: headers
  }).then(fetchError).then(res => {
    return res.text().then(function(text) {
      return text ? JSON.parse(text) : {}
    })
  })
}

//Encapsulating in a JSON object

const HttpClient = {
  post,
  get,
  delete: del
}

export default HttpClient
