import { apiCall } from '../use-api-utils'

const getTemplates = async (type: string) => {
  const result = await apiCall(`templates/${type}`)
  console.log('👉frontend/composables/api/template.ts getTemplates result:', result)
  return result;
};

const getTemplateId = async (type: string, id: string) => {
  const result = await apiCall(`templates/${type}/${id}`);
  console.log('👉frontend/composables/api/template.ts getTemplateId result:', result)
  return result;
};

const updateTemplate = async (id: string, yamlTemplate: string) => {
  const result = await apiCall(`templates/${id}`, 'PUT', {
    body: JSON.stringify({ yamlTemplate })
  })
  console.log('👉frontend/composables/api/template.ts updateTemplate result:', result)
  return result;
};

const createTemplate = async (templateType: string, name: string, description: string) => {
  const result = await apiCall('templates', 'POST', {
    body: JSON.stringify({ name, description, templateType })
  })
  console.log('👉frontend/composables/api/template.ts createOrUpdateTemplate result:', result)
  return result;
};

const verifyTemplate = async (yamlTemplate: string) => {
  const result = await apiCall('templates/verify', 'POST', {
    body: JSON.stringify({ yamlTemplate })
  })
  console.log('👉frontend/composables/api/template.ts verifyTemplate result:', result)
  return result;
};

export default {
  updateTemplate,
  getTemplates,
  getTemplateId,
  verifyTemplate,
  createTemplate,
}
