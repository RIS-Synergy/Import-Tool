import * as XLSX from "xlsx";
import _ from 'lodash';

const PRIORITIZED_KEYS = [
  "id",
  "acronym",
  "identifiers",
  "url",
  "type",
  "status",
  "startDate",
  "endDate",
  "title",
  "team",
  "funded",
  "abstractPR",
  "subjects",
  "keyword"
];

/**
 * Flattens a nested JSON object, preserving array indexes in a structured way.
 */
export function flattenObject(obj: any, prefix = "", result: any = {}): any {
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          flattenObject(item, `${fullKey}[${index}]`, result);
        } else {
          result[`${fullKey}[${index}]`] = item;
        }
      });
    } else if (typeof value === "object" && value !== null) {
      flattenObject(value, fullKey, result);
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

/**
 * Analyzes the data to determine the maximum array length for each key prefix.
 */
function getMaxArrayLengths(data: any[]): Record<string, number> {
  const maxLengths: Record<string, number> = {};

  for (const item of data) {
    const flatItem = flattenObject(item);
    for (const key of Object.keys(flatItem)) {
      const match = key.match(/^(.*)\[(\d+)\]/);
      if (match) {
        const baseKey = match[1];
        const index = parseInt(match[2], 10);
        maxLengths[baseKey] = Math.max(maxLengths[baseKey] || 0, index);
      }
    }
  }
  return maxLengths;
}

/**
 * Expands each row to ensure all array-based keys have consistent column headers.
 */
function normalizeFlattenedData(flattenedData: any[], maxArrayLengths: Record<string, number>) {
  const allKeys = new Set<string>();

  // Generate all required keys in advance
  for (const obj of flattenedData) {
    for (const key of Object.keys(obj)) {
      allKeys.add(key);
    }
  }

  // Ensure array-based keys have consistent structure
  for (const baseKey of Object.keys(maxArrayLengths)) {
    for (let i = 0; i <= maxArrayLengths[baseKey]; i++) {
      for (const key of Object.keys(flattenedData[0] || {})) {
        if (key.startsWith(`${baseKey}[0]`)) {
          const suffix = key.slice(`${baseKey}[0]`.length);
          allKeys.add(`${baseKey}[${i}]${suffix}`);
        }
      }
    }
  }

  // Convert Set to Array and sort naturally
  const sortedKeys = Array.from(allKeys).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // Normalize data
  return flattenedData.map((obj) =>
    sortedKeys.reduce((acc, key) => {
      acc[key] = obj[key] ?? "";
      return acc;
    }, {} as Record<string, any>)
  );
}

/**
 * Reorders columns to ensure prioritized keys (and their subkeys) appear first.
 */
function reorderColumns(data: any[], prioritizedKeys: string[]): any[] {
  if (data.length === 0) return data;

  const allKeys = Object.keys(data[0]);

  // Group columns based on whether they match a prioritized key
  const priorityGroups: Record<string, string[]> = {};
  const otherColumns: string[] = [];

  for (const key of allKeys) {
    const matchedPriority = prioritizedKeys.find((pKey) => key.startsWith(pKey));
    if (matchedPriority) {
      if (!priorityGroups[matchedPriority]) {
        priorityGroups[matchedPriority] = [];
      }
      priorityGroups[matchedPriority].push(key);
    } else {
      otherColumns.push(key);
    }
  }

  // Sort each group alphabetically (to preserve structure)
  for (const key in priorityGroups) {
    priorityGroups[key].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  // Build final ordered key list
  const orderedKeys = [
    ...prioritizedKeys.flatMap((key) => priorityGroups[key] || []), // Prioritized groups first
    ...otherColumns.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })), // Then everything else
  ];

  // Rebuild data with the new key order
  return data.map((obj) =>
    orderedKeys.reduce((acc, key) => {
      acc[key] = obj[key] ?? "";
      return acc;
    }, {} as Record<string, any>)
  );
}

// not regex
const onlyEssentialKeys = [
    "id",
    "identifiers[0].value",
    "identifiers[1].value",
    "type",
    "title[0].text",
    "title[1].text",
    "status",
    "team[0].person.electronicAddress",
    "team[0].person.personName.familyName",
    "team[0].person.personName.firstName",
    "team[0].person.identifiers[0].value",
    "funded[0].by.id",
    "funded[0].by.name.text",
    "funded[1].as.name.text",
    "funded[1].as.amount.currency",
    "funded[1].as.amount.amount",
    "funded[1].as.recipients[0].orgUnit.name[0].text",
    "startDate",
    "endDate",
    "funded[1].as.recipients[1].orgUnit.name[0].text",
    "funded[1].as.recipients[2].orgUnit.name[0].text"
  ];

export function onlyEssential(data: any[], keys: string[]) {
  return data.map((item) => {
    return _.pick(item, keys)
  });
}

/**
 * Converts an array of JSON objects to an Excel file with consistent column structure.
 */
export function jsonToExcel(data: any[], essentialKeys: string[]) {

  const workbook = XLSX.utils.book_new();

  // Create 'Essential List'
  const essentialList = onlyEssential(data, essentialKeys);
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(essentialList), "Essential List");

  // Create 'Complete List'
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data), "Complete List");

  return workbook;
}

export class Excel {
  constructor() {
  }

  static process(data: any[]) {
    const flattenedData = data.map((item) => flattenObject(item));
    const maxArrayLengths = getMaxArrayLengths(data);
    const normalizedData = normalizeFlattenedData(flattenedData, maxArrayLengths);
    const reorderedData = reorderColumns(normalizedData, PRIORITIZED_KEYS);
    return reorderedData;
  }

  // used in the 'json-to-excel' script
  static writeFile = (workbook: XLSX.WorkBook, fileName: string) => {
    XLSX.writeFile(workbook, fileName);
  }

  static write(data: any[]) {
    const processedData = Excel.process(data);
    const workbook = jsonToExcel(processedData, onlyEssentialKeys);
    return workbook;
  }
}
