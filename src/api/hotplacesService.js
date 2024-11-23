import axios from '../axios.js'

export const fetchHotPlaces = async params => {
  const response = await axios.get('/api/attractions/hotplace', { params })
  return response.data.data
}
