import axios from '../axios.js'

export const fetchCoursesList = async params => {
  const response = await axios.get('/api/tourcourses', { params })
  return response.data.data
}

export const fetchCoursesDetail = async contentId => {
  const response = await axios.get(`/api/tourcourses/${contentId}/details`)
  return response.data.data
}
