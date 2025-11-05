import { apiCall } from '../use-api-utils'

const getFunction = async (id: string = '') => {
  const result = await apiCall('functions/' + id)
  return result;
}

const setFunction = async (name: string, code: string, input: object, settings: object) => {
  const result = await apiCall(`functions/${name}`, 'PUT', {
    body: JSON.stringify({
      code,
      input,
      settings
    }),
  })
  return result;
}

const createFunction = async (name: string) => {
  const result = await apiCall(`functions/`, 'POST', {
    body: JSON.stringify({
      name,
    }),
  })
  return result;
}

export default {
  getFunction,
  setFunction,
  createFunction
}
