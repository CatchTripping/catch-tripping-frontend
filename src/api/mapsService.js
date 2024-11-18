import axios from 'axios'

export const fetchNearby = async params => {
  const response = await axios.get('/api/attractions/nearby', { params })
  return response.data
}
