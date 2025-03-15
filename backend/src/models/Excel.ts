import * as XLSX from "xlsx";
import * as fs from "fs";

/**
 * Flattens a nested JSON object, dynamically expanding arrays of objects.
 * @param obj - The object to flatten.
 * @param prefix - The key prefix (used internally for recursion).
 * @param result - The accumulator for flattened key-value pairs.
 * @returns A flattened object.
 */
export function flattenObject(obj: any, prefix = "", result: any = {}): any {
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (Array.isArray(value)) {
      if (value.every((v) => typeof v === "object" && v !== null)) {
        // If the array contains objects, expand them into separate numbered columns
        value.forEach((item, index) => {
          flattenObject(item, `${fullKey}[${index}]`, result);
        });
      } else {
        // Convert simple arrays into a comma-separated string
        result[fullKey] = value;
      }
    } else if (typeof value === "object" && value !== null) {
      // Recursively flatten objects
      flattenObject(value, fullKey, result);
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

/**
 * Converts an array of JSON objects to an Excel file.
 * @param data - Array of JSON objects.
 * @param fileName - Name of the output Excel file.
 */
export function jsonToExcel(data: any[]) {
  // Flatten each JSON object in the array
  const flattenedData = data.map((item) => flattenObject(item));

  // Get all unique keys to ensure correct column mapping
  const allKeys = Array.from(
    new Set(flattenedData.flatMap((obj) => Object.keys(obj)))
  );

  // Rebuild objects with all keys to ensure proper Excel formatting
  const normalizedData = flattenedData.map((obj) =>
    allKeys.reduce((acc, key) => ({ ...acc, [key]: obj[key] ?? "" }), {})
  );

  // Create a worksheet from JSON
  const worksheet = XLSX.utils.json_to_sheet(normalizedData);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  return workbook;
}

export class Excel {
  constructor() {
  }

  static async write(data: any[], fileName: string) {
    const workbook = jsonToExcel(data);

    // Write the workbook to a file
    XLSX.writeFile(workbook, fileName);
  }
}
