import axios from 'axios'

export const fetchAttractionDetails = async contentId => {
  const response = await axios.get(`/api/attractions/${contentId}/details`)
  return response.data.data
}
