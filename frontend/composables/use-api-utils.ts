export async function apiCall(url = '', method = 'GET', data: any = {}) {
  const router = useRouter();
  const store = useUserSettingsStore();
  const snackbar = useSnackbar();
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
    const result = await apiCall('fa/projects', 'GET', { query: {
      page, itemsPerPage, sortBy, filters
    } })
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
        body: JSON.stringify({
          ris: store.risData,
          settings: store.settings,
          templateId,
        }),
    });

    store.template.data = x;
  };

  const getDiffs = async (risId: string) => {
    const result = await apiCall(`diff/${risId}`)
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
    const result = await apiCall(`diff/likelihood/${risId}`)
    return result;
  }

  const assignCluster = async (project: string, item) => {
    const result = await apiCall('ri/assignCluster', 'POST', {
      body: JSON.stringify({
        systemName: item.systemName,
        uuid: item.uuid,
        projectUUID: project,
      }),
    })
    return result;
  }

  const getFunction = async (id: string = '') => {
    const result = await apiCall('functions/' + id)
    return result;
  }

  return {
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
    getFunction
  };
};
