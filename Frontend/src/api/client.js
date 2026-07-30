const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || 'Ocurrió un error inesperado.')
  }

  return data
}

async function uploadFile(path, file, token) {
  const headers = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || 'Ocurrió un error inesperado.')
  }

  return data
}

export const api = {
  get: (path, token) => request(path, { token }),
  post: (path, body, token) => request(path, { method: 'POST', body, token }),
  put: (path, body, token) => request(path, { method: 'PUT', body, token }),
  patch: (path, body, token) => request(path, { method: 'PATCH', body, token }),
  delete: (path, token) => request(path, { method: 'DELETE', token }),
  uploadFile,
}
