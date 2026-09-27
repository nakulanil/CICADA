const API_BASE = ''

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  let data = null

  try {
    data = await response.json()
  } catch {
    // Some successful responses do not contain JSON.
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.error ||
      'Request failed. Please try again.'

    throw new Error(message)
  }

  return data
}

export async function loginUser(identifier, password) {
  return apiRequest('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      username: identifier,
      password,
    }),
  })
}

export async function getCurrentUser(token) {
  return apiRequest('/api/auth/me/', {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

export async function logoutUser(token) {
  return apiRequest('/api/auth/logout/', {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

export async function getDocument(documentId, token) {
  return apiRequest(`/documents/${documentId}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

export async function getProcessingResult(versionId, token) {
  return apiRequest(`/documents/version/${versionId}/processing-result/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

export async function downloadDocument(versionId, token) {
  const response = await fetch(`/documents/version/${versionId}/download/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    let message = 'Document download failed.'
    try {
      const data = await response.json()
      message = data?.detail || data?.error || message
    } catch {
      // Response may not be JSON.
    }
    throw new Error(message)
  }

  return response.blob()
}

export async function verifyDocument(versionId, token) {
  return apiRequest(`/documents/version/${versionId}/verify/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

export async function searchDocuments(caseNumber, token) {
  const params = new URLSearchParams({
    case_number: caseNumber,
  })

  return apiRequest(`/documents/search/?${params.toString()}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}