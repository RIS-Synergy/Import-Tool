# Custom Functions

## Hello World

Trivial example function.

```js
return 'Hello, world!';
```

## getIdentifier

```json
"identifiers": [
    {
      "type": "CROSSREF_GRANTID",
      "value": "10.55776/12345"
    },
    {
      "type": "PROJECT_NUMBER",
      "value": "ID 12345"
    }
  ]
```

```js
const type = args[0] || 'PROJECT_NUMBER';
return input.identifiers
  .find(i => i.type === type)
  .value
```

## getPersonUUID

(Has been replaced by `settings.person`.)

## grantAmount

```js
const type = 'GRANT'

for (let i = 0; i < input.funded.length; i++) {
  const _as = input.funded[i].as
  if (!_as) {
    continue
  }
  if (_as.type && _as.type === type) {
    const amount = _as.amount.amount
    return amount.toString()
  }
}
return ''
```

## keywords

```js
// Function to get the locale string based on the language code
function getLocale(lang) {
  return lang === 'en' ? 'en_GB' : 'de_DE';
}

// The main export function
const { keyword } = input;

// Initialize an object to store texts categorized by language
const data = {};

// Organize keywords by language
keyword.forEach((k) => {
  if (!data[k.lang]) {
    data[k.lang] = [];
  }
  data[k.lang].push(k.text);
});

// Convert the data object into an array of results
return result = Object.entries(data).map(([lang, texts]) => ({
  locale: getLocale(lang),
  freeKeywords: texts
}));
```

## oefos2012

The `oefosValue` is a hardcoded function.

```
const { subjects } = input

const result = subjects.map((subject) => {
  const { value } = subject

  const de = oefosValue(value, 'DE')
  const en = oefosValue(value, 'EN')

  return {
    uri: `/dk/atira/pure/core/oefos2012/${value[0]}/${value}`,
  }
})

return result
```

## getByLang

```
const pass = args[0]
const lang = args[1]

var title = input[pass].find(t => t.lang === lang);

if (!title || !title.text) {
  return 'Title not found';
}

// replace title with \r\n with <br>
title = title.text.replace(/\r\n/g, '<br/>');

return title
```

# Templates

An example of a template that just sends the input  itself as it is (of the RIS Data).

```
output: "!<fn>literallyInput"
```

and a trivial function for it: `return input`.
