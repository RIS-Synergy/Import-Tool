export default {
  read: {
    name: 'function1',
    code: "function hello() {\nreturn 'Hello, world!'\n}",
  },

  createOrUpdate: {
    name: 'function1',
    code: "function hello() {\nreturn 'Hello, world!'\n}",
  },

  all: [
    {
      name: 'getByLang',
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
    },
    {
    name: 'function1',
    code: "function hello() {\nreturn 'Hello, world!'\n}",
    language: 'javascript',
  },
  {
    name: 'getByLang',
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
  },
  {
    name: 'getIdentifier',
    code: 'const type = args[0]\n' +
      'return input.identifiers\n' +
      '  .find(i => i.type === type)\n' +
      '  .value',
  },
  {
    name: 'grantAmount',
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
  },
  {
    name: 'hello',
    code: "return input.startDate // 'world'",
    language: 'javascript',
  },
  {
    name: 'keywords',
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
  },
  {
    name: 'literallyInput',
    code: 'return input',
  },
  {
    name: 'oefos2012',
    code: "//import { getValue } from '@/views/oefos'\n" +
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
  }]
}
