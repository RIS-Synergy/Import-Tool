export default () => {
  const isAdmin = () => {
    const { user } = useUserSettingsStore()
    if (!user) return false

    const { permission, username } = user
    const isAdmin = permission &&
      Array.isArray(permission) &&
      permission.includes('admin')
    // console.log(`User '${username}' is admin: ${isAdmin}`)
    return !!isAdmin
  }

  const isSuperuser = () => {
    const { user } = useUserSettingsStore()
    if (!user) return false

    const { permission } = user
    return !!(permission && Array.isArray(permission) && permission.includes('superuser'))
  }

  return {
    isAdmin,
    isSuperuser
  }
}
