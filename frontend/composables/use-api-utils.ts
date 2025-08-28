export async function apiCall(url = '', method = 'GET', data: any = {}) {
  const snackbar = useSnackbar();
  const router = useRouter();
  const store = useUserSettingsStore();
  var result: any;
  try {
    result = await $fetch(
      `/api/${url}`,
      {
        method,
        headers: store.token ? {
          Authorization: `Bearer ${store.token}`
        } : {},
        ...data
      });
  } catch (e: any) {
    if (e.status === 401) {
      router.push({ name: "login" });
    }
    else if (e.status === 422) {
      snackbar.error(e.data, 'ResearchInstitutionError')
    } else {
      console.warn(e, result);
      snackbar.error(e, 'apiCallError')
    }
  }

  // debugger
  if (result && result.token) {
    store.setToken(result.token)
  }
  return result;
}

export function hasCRIS () {
  const config = useRuntimeConfig()
  return config.public.hasCRIS
}

export const useApiUtils = () => {
  const getTemplates = async (type: string) => {
    const result = await apiCall(`templates/${type}`)
    return result;
  };

  const getTemplateId = async (type: string, id: string) => {
    return await apiCall(`templates/${type}/${id}`);
  };

  const createOrUpdateTemplate = async (templateType, templateId, name, description) => {
    return await apiCall('templates', 'POST', {
      body: JSON.stringify({ name, description, templateId, templateType })
    })
  };

  const updateTemplate = async (id, text) => {
    return await apiCall(`templates/${id}`, 'PUT', {
      body: JSON.stringify({ text })
    })
  };

  const verifyTemplate = async (text) => {
    return await apiCall('templates/verify', 'POST', {
      body: JSON.stringify({ text })
    })
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
    const result = await apiCall('fa/projects', 'POST', { body: {
      page, itemsPerPage, sortBy, filters
    } })
    return result;
  };

  const loadTransformation = async (store, templateId, templateType: string) => {
    if (!templateId) {
      return;
    }

    const result = await apiCall("transform/upload", "POST", {
        body: JSON.stringify({
          ris: store.risData,
          settings: store.settings,
          templateId,
        }),
    });

    store.template.data = result;

    if (result.error) {
      const { error } = useSnackbar();
      error(result.error)
      return
    }

    // this is used for verifying custom Functions
    // for the last viewed template
    store.viewLastTemplate(store.risData, store.settings, templateType)
  };

  const getDiffs = async (risId: string, systemName: string, uuid: string, templateSelected: number) => {
    if (!hasCRIS()) return
    const result = await apiCall(`diff/${risId}`, "POST", {
      body: JSON.stringify({
        systemName,
        uuid,
        templateSelected
      }),
    });
    return result;
  }

  const submitLogin = async (username: string, password: string) => {
    const result = await apiCall("auth/login", "POST", {
      body: JSON.stringify({ username, password }),
    });
    return result;
  }

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    const result = await apiCall("auth/password", "POST", {
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

  const uploadToPure = async (ris, settings, uuid, templateData, entity) => {
    const snackbar = useSnackbar();

    if (!hasCRIS()) {
      snackbar.error("CRIS API is not available.")
      return
    }

    var template = {
      ...templateData,
    }
    delete template.data

    const result = await apiCall("ri/upload", "POST", {
      body: JSON.stringify({
        ris,
        settings,
        uuid,
        template,
        entity
      }),
    })

    if (result && !result.error) {
      snackbar.info('Upload successful')
    }
    return result
  }

  const searchRIApi = async (entityType: string, searchString: string, uuid: string, endpoint: string = "searchCluster") => {
    const result = await apiCall(`ri/${endpoint}`, "POST", {
      body: JSON.stringify({
        entityType,
        searchString,
        uuid
      }),
    });
    return result;
  }

  const searchAny = async (searchString: string, uuid: string, endpoint: string = "searchCluster") => {
    const result = await apiCall(`ri/searchAny`, "POST", {
      body: JSON.stringify({
        searchString,
      }),
    });
    return result;
  }

  const riEntityUUID = async (entityType: string, uuid: string) => {
    const result = await apiCall(`ri/${entityType}/${uuid}`)
    return result;
  }

  const faApi = async (str: string) => {
    const result = await apiCall(`fa/${str}`)
    return result;
  }

  const diffRILikelihood = async (risId: string) => {
    if (!hasCRIS()) return
    const result = await apiCall(`diff/likelihood/${risId}`)
    return result;
  }

  const assignCluster = async (project: string, item) => {
    const snackbar = useSnackbar();
    const result = await apiCall('ri/assignCluster', 'POST', {
      body: JSON.stringify({
        systemName: item.systemName,
        uuid: item.uuid,
        projectUUID: project
      }),
    })
    if (result && !result.error) {
      snackbar.info('Upload successful')
    } else {
      snackbar.error(result.error)
    }
    return result;
  }

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
    // same as setFunction, but with POST
    const result = await apiCall(`functions/`, 'PUT', {
      body: JSON.stringify({
        name,
      }),
    })
    return result;
  }

  return {
    apiCall,
    getTemplates,
    getTemplateId,
    verifyTemplate,
    createOrUpdateTemplate,
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
    uploadToPure,
    searchRIApi,
    searchAny,
    riEntityUUID,
    faApi,
    diffRILikelihood,
    assignCluster,
    getFunction,
    setFunction,
    createFunction,
    hasCRIS
  };
};
