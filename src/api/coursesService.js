import axios from 'axios'

export const fetchCoursesList = async params => {
  const response = await axios.get('/api/tourcourses', { params })
  return response.data.data
}
