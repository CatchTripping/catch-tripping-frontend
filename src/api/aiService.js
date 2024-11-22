import axios from 'axios'

export const fetchAITravelList = async params => {
  const response = await axios.post(
    '/api/recommendations/travel-destinations',
    params,
  )
  return response.data.data
}
