import axios from 'axios'
import { Message } from '@alifd/next'

axios.interceptors.response.use((res) => {
  return res.data
}, (err) => {
  let errorMessage = '服务异常'
  try {
    errorMessage = err.response.data.errorMessage
  } catch (error) {
    console.log(error)
  }
  Message.error(errorMessage)

  return Promise.reject(err)
})

export default axios
