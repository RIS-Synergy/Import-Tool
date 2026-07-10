import { apiCall } from '../use-api-utils'

const listAll = async () => {
  const result = await apiCall('user')
  return result
}

const updatePermission = async (id: number, permission: string[]) => {
  const result = await apiCall(`user/${id}/permission`, 'PATCH', {
    body: JSON.stringify({ permission })
  })
  return result
}

export default {
  listAll,
  updatePermission
}
