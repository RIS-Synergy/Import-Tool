import { apiCall } from '../use-api-utils'

const getFunctions = async () => {
  const result = await apiCall('functions/')
  return result;
}

const getFunction = async (name: string) => {
  const result = await apiCall('functions/' + name)
  return result;
}

const updateFunction = async (name: string, code: string, language: string = 'javascript', description: string = '') => {
  const result = await apiCall(`functions/${name}`, 'PUT', {
    body: JSON.stringify({
      code,
      language,
      description
    }),
  })
  return result;
}

const verifyFunction = async (
  name: string,
  code: string,
  input: object,
  settings: object) => {
  const result = await apiCall(`functions/${name}/verify`, 'PUT', {
    body: JSON.stringify({
      code,
      input,
      settings
    }),
  })
  return result;
}

const createFunction = async (name: string, code: string = '', language: string = 'javascript', description: string = '') => {
  const result = await apiCall(`functions/`, 'POST', {
    body: JSON.stringify({
      name,
    }),
  })
  return result;
}

const deleteFunction = async (name: string) => {
  const result = await apiCall(`functions/${name}`, 'DELETE')
  return result;
}

export default {
  getFunctions,
  getFunction,
  updateFunction,
  verifyFunction,
  createFunction,
  deleteFunction
}
