const apiBase = import.meta.env.VITE_MANAGER_API || 'http://localhost:4001'

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string | null) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Request failed')
  }

  return (await response.json()) as T
}

export async function apiUpload<T>(path: string, file: File, token: string) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Upload failed')
  }

  return (await response.json()) as T
}

export { apiBase }
