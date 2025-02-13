export const useSnackbar = () => {
  const nuxt = useNuxtApp()
  // Currently we only have a file here: components/Transform
  // that uses project.setError

  const error = async (details: string, area: string = 'default') => {
    nuxt.$event ("snackbar:error", {
      details,
      area
    })
  }

  const info = async (details: string, area: string = 'default') => {
    nuxt.$event ("snackbar:info", {
      details,
      area
    })
  }

  return {
    error,
    info
  };
};
