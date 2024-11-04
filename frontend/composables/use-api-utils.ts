// const { token } = useUserSettingsStore();

export async function apiCall(url = '', method = 'GET', data: any = {}) {
  const router = useRouter();
  const store = useUserSettingsStore();
  var result: any;
  try {
    result = await $fetch(
      `/api/${url}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${store.token}`
        },
        ...data
      });
  } catch (e: any) {
    if (e.status === 401) {
      router.push({ name: "login" });
    } else {
      console.warn(e, result);
    }
  }
  // store.token = result.token
  // debugger
  if (result && result.token) {
    store.setToken(result.token)
  }
  return result;
}

export const useApiUtils = () => {
  const getTemplates = async (type: string) => {
    const result = await apiCall(`templates/${type}`)
    return result;
  };

  const getTemplateId = async (type: string, id: string) => {
    // return await $fetch(`/api/templates/${type}/${id}`);
    return await apiCall(`templates/${type}/${id}`);
  };

  const createTemplate = async (templateType, name, description) => {
    return await apiCall('templates', 'POST', {
      body: JSON.stringify({ name, description, templateType })
    })
    // return await $fetch(`/api/templates`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ name, description, templateType }),
    // });
  };

  const updateTemplate = async (id, text) => {
    return await apiCall(`templates/${id}`, 'PUT', {
      body: JSON.stringify({ text })
    })
    // return await $fetch(`/api/templates/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ text }),
    // });
  };

  const verifyTemplate = async (text) => {
    return await apiCall('templates/verify', 'POST', {
      body: JSON.stringify({ text })
    })
    // return await $fetch(`/api/templates/verify`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ text }),
    // });
  };

  const setProjectId = async (store, route) => {
    const risId = store.risData && store.risData.id;

    if (route.params.id !== risId) {
      store.resetSettings();
      store.risData = null;
      store.crisId = null;
      store.crisUUID = null;
      store.crisData = null;
    }

    const { id } = route.params;
    if (!id) {
      // console.log('no id', route.params.id)
    } else {
      // console.log('id', id)
      // const data: any = await $fetch(`/api/fa/projects/${id}`);
      const data: any = await apiCall(`fa/projects/${id}`)
      store.risData = data.risData;
      store.crisId = data.crisId;
      store.crisUUID = data.crisUUID;
    }
  };

  const getProjectsList = async ({ page, itemsPerPage, sortBy, filters }) => {
    // const router = useRouter();
    // const { token } = useUserSettingsStore();
    // var result
    // try {
    //   result = await $fetch(
    //     '/api/fa/projects',
    //     {
    //       query: { page, itemsPerPage, sortBy, filters },
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     });
    // } catch (e: any) {
    //   console.error(e, result);
    //   if (e.status === 401) {
    //     console.error("Unauthorized")
    //     router.push({ name: "login" });
    //   }
    // }
    const data = { page, itemsPerPage, sortBy, filters };
    const result = await apiCall('fa/projects', 'GET', { query: data })
    return result;
  };

  const loadTransformation = async (store, templateId) => {
    if (!templateId) {
      return;
    }

    console.log("loadTransformation", templateId);

    // const ris = store.risData.value
    // const settings = store.settings.value

    const x = await apiCall("transform/upload", "POST", {
      ris: store.risData,
      settings: store.settings,
      templateId,
    });

    // const x = await $fetch("/api/transform/upload", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     ris: store.risData,
    //     settings: store.settings,
    //     templateId,
    //   }),
    // });

    store.template.data = x;
    // return x
    // result.value = x;
  };

  const getDiffs = async (risId: string) => {
    const result = await apiCall(`diff/${risId}`)
    return result;
  }

  const submitLogin = async (username: string, password: string) => {
    const result = await apiCall("auth/login", "POST", {
      body: JSON.stringify({ username, password }),
    });
    // const result = await $fetch("/api/auth/login", {
    //   method: "POST",
    //   body: JSON.stringify({ username, password }),
    // });
    return result;
  }

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    const result = await apiCall("auth/update_password", "POST", {
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    // redirect
    if (result.success) {
      const router = useRouter();
      router.push({ name: "login" });
      return true
    } else {
      console.log("Password update failed", result)
      return false
    }
  }

  const searchApi = async (str: string, entity: string) => {
    const result = await apiCall("ri/search", "POST", {
      body: JSON.stringify({
        searchString: str,
        entity
      }),
    });
    return result;
  }

  const riReference = async (systemName: string, uuid: string) => {
    const result = await apiCall(`ri/reference/${systemName}/${uuid}`)
    return result;
  }

  const getProjectUUID = async (id: string) => {
    const item = `ris:FWF:project:${id}`;
    try {
      // try to find the ID as a search in the RI API
      const item = `ris:FWF:project:${id}`;
      const result = await apiCall(`ri/project/${item}`);
      return result
    } catch(error) {
      // unknown error
      return { uuid: null }
    }
  }

  const loadProject = async (risId: string) => {
    const store = useProjectStore()
    const { item, count } = await getProjectUUID(risId)
    store.crisData = item
  }

  const uploadToPure = async (ris, settings, uuid, templateData) => {
    var template = {
      ...templateData,
    }
    delete template.data

    const result = await apiCall("ri/upload", "POST", {
      body: JSON.stringify({
        ris,
        settings,
        uuid,
        template
      }),
    })
    return result
  }

  return {
    // apiCall,
    getTemplates,
    getTemplateId,
    verifyTemplate,
    createTemplate,
    updateTemplate,
    setProjectId,
    getProjectsList,
    loadTransformation,
    getDiffs,
    submitLogin,
    updatePassword,
    searchApi,
    riReference,
    getProjectUUID,
    loadProject,
    uploadToPure
  };
};
