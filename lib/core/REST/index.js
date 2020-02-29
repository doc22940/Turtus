import axios from 'axios'
import ROUTES from './endpoints'

/**
 * Controls some RESTful operations
 */
class RestController {
  constructor(options={}){
    const { 
      storeToken = true,
      baseURL = 'https://localhost'
    } = options
    this.axios = axios.create({
      timeout : 10 * 1000,
      baseURL
    })
    this.storeToken = storeToken
    this._token = null
    // TODO: Un-hardcode this url
  }

  set baseUrl(url){
    this.axios.defaults.baseURL = url
  }

  get baseURL(){
    return this.axios.defaults.baseURL
  }

  get token(){
    if(this.storeToken){
      return localStorage.getItem('turtus_jwt')
    }
    return this._token
  }

  set token(token){
    if(this.storeToken){
      if(token){
        localStorage.setItem('turtus_jwt', token)
      }else{
        localStorage.removeItem('turtus_jwt')
      }
    }
    // update axios headers
    this.axios.defaults.headers.common = {
      'Authorization': token ? `bearer ${token}` : null
    }
    this._token = token
  }

  _normalize(...paths){
    let path = paths.join('/').replace(/\/+/, '/')
    if(!path.startsWith('/')){
      path = `/${path}`
    }
    return path
  }

  /**
   * Request and return response object
   * @param {*} url 
   * @param {string} method 
   * @param {*} opts
   * @deprecated
   */
  async _requestResponse(url, method='get', opts={}){
    if(typeof method === 'object'){
      opts = { ...opts, ...method }
    } else {
      opts = { method, ...opts }
    }
    if(url.$get){
      url = url.$get(method||opts.method||'get')
    }

    const reqData = {
      withCredentials : true,
      url : this._normalize(url),
      responseType : 'json',
      ...opts
    }
    try {
      const result = await this.axios(reqData)
      return result
    }catch(e){
      throw e.response.data 
    }
  }

  /**
   * @param  {...any} args 
   * @deprecated
   */
  async _request(...args){
    const response = await this._requestResponse(...args)
    return response.data
  }

  request(...args){
    return this._request(...args)
  }

  ping(){
    return this._request('')
  }
}

export { ROUTES, RestController }
export default new RestController()