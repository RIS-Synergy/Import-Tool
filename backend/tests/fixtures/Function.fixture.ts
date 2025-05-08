export default {
  read: {
    name: 'function1',
    // description: '',
    code: "function hello() {\nreturn 'Hello, world!'\n}",
    // language: 'javascript',
  },

  createOrUpdate: {
    name: 'function1',
    // description: '',
    code: "function hello() {\nreturn 'Hello, world!'\n}",
    // language: 'javascript',
  },

  // so far 'all' it is only used in the test file: transform.test.ts
  all: []

  /*
    {
    id: 1759,
    name: 'function1',
    description: '',
    code: "function hello() {\nreturn 'Hello, world!'\n}",
    language: 'javascript',
  },
  {
    id: 1748,
    name: 'getByLang',
    description: '',
    code: 'const pass = args[0]\n' +
      'const lang = args[1]\n' +
      '\n' +
      'var title = input[pass].find(t => t.lang === lang);\n' +
      '\n' +
      'if (!title || !title.text) {\n' +
      "  return 'Title not found';\n" +
      '}\n' +
      '\n' +
      '// replace title with \\r\\n with <br>\n' +
      "title = title.text.replace(/\\r\\n/g, '<br/>');\n" +
      '\n' +
      'return title',
    language: 'javascript',
  },
  {
    id: 83,
    name: 'getIdentifier',
    description: '',
    code: 'const type = args[0]\n' +
      'return input.identifiers\n' +
      '  .find(i => i.type === type)\n' +
      '  .value',
    language: 'javascript',
  },
  {
    id: 85,
    name: 'grantAmount',
    description: '',
    code: 'for (let i = 0; i < input.funded.length; i++) {\n' +
      '  const _as = input.funded[i].as\n' +
      '  if (!_as) {\n' +
      '    continue\n' +
      '  }\n' +
      "  if (_as.type && _as.type === 'GRANT') {\n" +
      '    const amount = _as.amount.amount\n' +
      '    return amount\n' +
      '  }\n' +
      '}\n' +
      "return ''",
    language: 'javascript',
  },
  {
    id: 1776,
    name: 'hello',
    description: '',
    code: "return input.startDate // 'world'",
    language: 'javascript',
  },
  {
    id: 86,
    name: 'keywords',
    description: '',
    code: '// Function to get the locale string based on the language code\n' +
      'function getLocale(lang) {\n' +
      "  return lang === 'en' ? 'en_GB' : 'de_DE';\n" +
      '}\n' +
      '\n' +
      '// The main export function\n' +
      'const { keyword } = input;\n' +
      '\n' +
      '// Initialize an object to store texts categorized by language\n' +
      'const data = {};\n' +
      '\n' +
      '// Organize keywords by language\n' +
      'keyword.forEach((k) => {\n' +
      '  if (!data[k.lang]) {\n' +
      '    data[k.lang] = [];\n' +
      '  }\n' +
      '  data[k.lang].push(k.text);\n' +
      '});\n' +
      '\n' +
      '// Convert the data object into an array of results\n' +
      'return result = Object.entries(data).map(([lang, texts]) => ({\n' +
      '  locale: getLocale(lang),\n' +
      '  freeKeywords: texts\n' +
      '}));',
    language: 'javascript',
  },
  {
    id: 1751,
    name: 'literallyInput',
    description: '',
    code: 'return input',
    language: 'javascript',
  },
  {
    id: 87,
    name: 'oefos2012',
    description: '',
    code: "//import { getValue } from '../views/oefos'\n" +
      '\n' +
      'const { subjects } = input\n' +
      '\n' +
      'const result = subjects.map((subject) => {\n' +
      '  const { value } = subject\n' +
      '\n' +
      "  const de = oefosValue(value, 'DE')\n" +
      "  const en = oefosValue(value, 'EN')\n" +
      '\n' +
      '  // log(de)\n' +
      '  return {\n' +
      '    uri: `/dk/atira/pure/core/oefos2012/${value[0]}/${value}`,\n' +
      '  }\n' +
      '})\n' +
      '\n' +
      'return result',
    language: 'javascript',
  }
  */
}
