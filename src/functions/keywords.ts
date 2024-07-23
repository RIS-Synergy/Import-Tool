import { RISImport, RISPerson, Settings } from '../types';

type Text = {
  lang: string;
  text: string;
  trans: string;
}

// TODO support more (or any) languages
function getLocale (lang: string): string {
  return lang === 'en' ? 'en_GB' : 'de_DE'
}

export default function (ris: RISImport, settings: Settings): any[] {
  const { keyword } = ris

  var data = {}
  keyword.forEach((k: Text) => {
    if (!data[k.lang]) {
      data[k.lang] = []
    }
    data[k.lang].push(k.text)
  })

  const result = Object.entries(data).map(([lang, texts]) => {
    return {
      locale: getLocale(lang),
      freeKeywords: texts
    }
  })

  return result
}
