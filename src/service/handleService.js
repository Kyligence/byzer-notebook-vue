


import axios from 'axios'
import store from '../store'
import { actionsTypes } from '../store'
import { accessToZenLogin } from '../util'
const { VUE_APP_API_URL } = process.env

var instance = axios.create({
  baseURL: window.location.origin + VUE_APP_API_URL,
  withCrendentials: true
})

instance.interceptors.request.use(function (config) {
  config.headers.common['Accept-Language'] = localStorage.getItem('kycloud_lang') || 'en'
  return config
})
instance.interceptors.response.use(
  response => {
    if (response.headers['content-disposition']) {
      return response
    } else {
      return response.data
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.commit(actionsTypes.HIDE_ALL_MODALS)
          accessToZenLogin()
      }
    }
    const result = error.response.data
    const message = result && result.msg || 'Unknow Error'
    window.NotebookVue.$message.error(message)
    return Promise.reject(error.response)
  }
)

export default instance
