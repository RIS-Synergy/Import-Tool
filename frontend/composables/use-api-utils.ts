export const useApiUtils = () => {
  const getTemplates = async (type) => {
    const result = await $fetch(`/api/templates/${type}`);
    return result;
  };

  const getTemplateId = async (type, id) => {
    return await $fetch(`/api/templates/${type}/${id}`);
  };

  const createTemplate = async (templateType, name, description) => {
    return await $fetch(`/api/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, templateType }),
    });
  };

  const updateTemplate = async (id, text) => {
    return await $fetch(`/api/templates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
  };

  const verifyTemplate = async (text) => {
    return await $fetch(`/api/templates/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
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
      const data = await $fetch(`/api/fa/projects/${id}`);
      store.risData = data.risData;
      store.crisId = data.crisId;
      store.crisUUID = data.crisUUID;
    }
  };

  const getProjectsList = async ({ page, itemsPerPage, sortBy, filters }) => {
    const result = await $fetch(
      '/api/fa/projects',
      {
        query: { page, itemsPerPage, sortBy, filters }
      });
    return result;
  };

  const loadTransformation = async (store, templateId) => {
    if (!templateId) {
      return;
    }

    console.log("loadTransformation", templateId);

    // const ris = store.risData.value
    // const settings = store.settings.value

    const x = await $fetch("/api/transform/upload", {
      method: "POST",
      body: JSON.stringify({
        ris: store.risData,
        settings: store.settings,
        templateId,
      }),
    });

    store.template.data = x;
    // return x
    // result.value = x;
  };

  const getDiffs = async (risId) => {
    const result = await $fetch(`/api/diff/${risId}`);
    console.log("getDiffs", result);
    return result;
  }

  const submitLogin = async (username: string, password: string) => {
    const result = await $fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    return result;
  }

  return {
    getTemplates,
    getTemplateId,
    verifyTemplate,
    createTemplate,
    updateTemplate,
    setProjectId,
    getProjectsList,
    loadTransformation,
    getDiffs,
    submitLogin
  };
};
