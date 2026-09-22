import axios, { type AxiosResponse } from 'axios'
import { csrfCookieName } from '@/constants'
// import { assertAxiosResponseIsJson, rejectAxiosHtmlError } from '@/utils/apiResponseGuard'
import { findCookieByName } from '@/utils/findCookieByName'

export type AxiosRequestType = {
  url: string
  method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH'
  data?: Record<any, any>
  params?: Record<string, any>
}

export function useAxios() {
  const csrfCookie = findCookieByName(csrfCookieName)
  const axiosInstance = axios.create({
    baseURL: '', // `${viteApiUrlV2}`,
    headers: {
      'X-CSRF-Token': csrfCookie,
    },
    withCredentials: true,
  })

  // axiosInstance.interceptors.response.use(assertAxiosResponseIsJson, rejectAxiosHtmlError)

  const singleApiRequest = async (request: AxiosRequestType, headers?: Record<string, any>) => {
    return await apiResponse(request, headers)
  }

  const multipleApiRequests = async (requests: AxiosRequestType[], headers?: Record<string, any>) => {
    return await axios.all(requests.map((req) => apiResponse(req, headers)))
  }

  const apiResponse = async (request: AxiosRequestType, headers = {}) => {
    const { url, method, data = {}, params = {} } = request
    const config: Record<string, any> = {}
    if (Object.entries(params || {}).length > 0) config.params = params
    if (Object.entries(headers || {}).length > 0) config.headers = headers
    let response: AxiosResponse

    switch (method) {
      case 'GET':
        response = await axiosInstance.get(url, config)
        break
      case 'POST':
        response = await axiosInstance.post(url, data, config)
        break
      case 'PUT':
        response = await axiosInstance.put(url, data, config)
        break
      case 'PATCH':
        response = await axiosInstance.patch(url, data, config)
        break
      case 'DELETE':
        if (Object.entries(data || {}).length > 0) config.data = data
        response = await axiosInstance.delete(url, config)
        break
    }
    return response
  }

  return {
    axiosInstance,
    singleApiRequest,
    multipleApiRequests,
  }
}
