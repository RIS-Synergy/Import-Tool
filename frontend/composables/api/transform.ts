import { apiCall } from '../use-api-utils'

const loadTransformation = async (store, templateId: number, templateType: string) => {
  if (!templateId) {
    console.log("no templateId provided", templateId)
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

export default {
  loadTransformation
}
