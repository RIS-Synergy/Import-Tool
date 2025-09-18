export default () => {
  const isAdmin = () => {
    const { user } = useUserSettingsStore()
    const { permission, username } = user
    const isAdmin = permission &&
      Array.isArray(permission) &&
      permission.includes('admin')
    // console.log(`User '${username}' is admin: ${isAdmin}`)
    return !!isAdmin
  }

  return {
    isAdmin
  }
}
