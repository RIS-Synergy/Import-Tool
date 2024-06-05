import * as yaml from 'yaml';

/**
 * Function to replace placeholders in the form of ${path.to.value} with values from the provided object
 * @param yamlContent - The YAML content as a string
 * @param data - The object containing values to replace the placeholders
 * @returns - The processed object with placeholders replaced
 */
export function replacePlaceholders(yamlContent: string, data: any): any {
  // Parse the YAML content
  const parsedYaml = yaml.parse(yamlContent);

  /**
   * Recursive function to traverse the object and replace placeholders
   * @param obj - The object to traverse
   * @returns - The object with placeholders replaced
   */
  function traverseAndReplace(obj: any): any {
    if (typeof obj === 'string') {
      // Regex to match placeholders like ${path.to.value}
      const regex = /\${(.*?)}/g;
      // Replace each placeholder with the corresponding value from the data object
      return obj.replace(regex, (_, path) => {
        const keys = path.split('.');
        let value = data;
        for (const key of keys) {
          if (value[key] !== undefined) {
            value = value[key];
          } else {
            return `\${${path}}`; // Return the original placeholder if the path is not found
          }
        }
        return value;
      });
    } else if (Array.isArray(obj)) {
      // If the object is an array, traverse each element
      return obj.map(item => traverseAndReplace(item));
    } else if (typeof obj === 'object' && obj !== null) {
      // If the object is a non-null object, traverse each property
      for (const key in obj) {
        obj[key] = traverseAndReplace(obj[key]);
      }
    }
    return obj;
  }

  return traverseAndReplace(parsedYaml);
}
