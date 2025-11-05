import { apiCall } from '../use-api-utils'

const getTemplates = async (type: string) => {
  const result = await apiCall(`templates/${type}`)
  console.log('👉frontend/composables/api/template.ts getTemplates')
  console.log(result)
  return result;
};

const getTemplateId = async (type: string, id: string) => {
  const result = await apiCall(`templates/${type}/${id}`);
  console.log('👉frontend/composables/api/template.ts getTemplateId')
  console.log(result)
  return result;
};

const updateTemplateDetails = async (id: string, templateType: string, name: string, description: string) => {
  const result = await apiCall(`templates/${id}`, 'PUT', {
    body: JSON.stringify({ name, description, templateType })
  })
  console.log('👉frontend/composables/api/template.ts updateTemplateDetails')
  console.log(result)
  return result;
};

const updateTemplateYaml = async (id: string, yamlTemplate: string) => {
  const result = await apiCall(`templates/${id}/yaml`, 'PUT', {
    body: JSON.stringify({ yamlTemplate })
  })
  console.log('👉frontend/composables/api/template.ts updateTemplateYaml')
  console.log(result)
  return result;
};

const createTemplate = async (templateType: string, name: string, description: string) => {
  const result = await apiCall('templates', 'POST', {
    body: JSON.stringify({ name, description, templateType, yamlTemplate: 'output:\n' })
  })
  console.log('👉frontend/composables/api/template.ts createTemplate')
  console.log(result)
  return result;
};

const verifyTemplate = async (yamlTemplate: string) => {
  const snackbar = useSnackbar()
  try {
    const result = await apiCall('templates/verify', 'POST', {
      body: JSON.stringify({ yamlTemplate })
    })
    console.log('👉frontend/composables/api/template.ts verifyTemplate')
    console.log(result)
    return result;
  } catch (error) {
    snackbar.error('Error verifying template: ' + (error instanceof Error ? error.message : String(error)));
  }
};

export default {
  updateTemplateDetails,
  updateTemplateYaml,
  getTemplates,
  getTemplateId,
  verifyTemplate,
  createTemplate,
}
