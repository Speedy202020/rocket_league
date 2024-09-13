import axios from 'axios'
import { Promise } from 'core-js'

export function getAxiosResponse (options) {
  return new Promise((resolve, reject) => {
    options = {
      ...options,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    axios.request(options)
      .then(function (response) {
        if (response != undefined) {
          resolve(response.data)
        }
        resolve(response)
      }).catch(function (error) {
        reject(error)
      })
  })
}
