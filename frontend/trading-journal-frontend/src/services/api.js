const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Trade API functions
export const tradeAPI = {
  // Fetch trades with pagination
  getTrades: (limit = 500, offset = 0) =>
    apiRequest(`/trades?limit=${limit}&offset=${offset}`),

  // Get single trade
  getTrade: (tradeId) => apiRequest(`/trades/${tradeId}`),

  // Create new trade
  createTrade: (tradeData) =>
    apiRequest('/trades', {
      method: 'POST',
      body: JSON.stringify({
        ...tradeData,
        // Only set entry_time if not provided (for manual trade creation)
        entry_time: tradeData.entry_time || new Date().toISOString(),
      }),
    }),

  // Update trade
  updateTrade: (tradeId, tradeData) =>
    apiRequest(`/trades/${tradeId}`, {
      method: 'PUT',
      body: JSON.stringify(tradeData),
    }),

  // Delete trade
  deleteTrade: (tradeId) =>
    apiRequest(`/trades/${tradeId}`, {
      method: 'DELETE',
    }),
}
