import { RISImport, RISPerson, Settings, LangText } from '../types';

// Function to get the locale string based on the language code
function getLocale(lang: string): string {
  return lang === 'en' ? 'en_GB' : 'de_DE';
}

// The main export function
export default function (ris: RISImport, settings: Settings): any[] {
  const { keyword } = ris;

  // Initialize an object to store texts categorized by language
  const data: { [lang: string]: string[] } = {};

  // Organize keywords by language
  keyword.forEach((k: LangText) => {
    if (!data[k.lang]) {
      data[k.lang] = [];
    }
    data[k.lang].push(k.text);
  });

  // Convert the data object into an array of results
  const result = Object.entries(data).map(([lang, texts]) => ({
    locale: getLocale(lang),
    freeKeywords: texts
  }));

  return result;
}
