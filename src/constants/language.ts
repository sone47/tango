import { invert } from 'lodash'

export enum LanguageEnum {
  ja = 'ja',
  en = 'en',
  zh = 'zh',
  fr = 'fr',
  de = 'de',
  es = 'es',
  it = 'it',
  pt = 'pt',
  ru = 'ru',
  ar = 'ar',
  ko = 'ko',
}

export const languageToNameMap = {
  [LanguageEnum.ja]: '日语',
  // [LanguageEnum.en]: '英语',
  // [LanguageEnum.zh]: '中文',
  // [LanguageEnum.fr]: '法语',
  // [LanguageEnum.de]: '德语',
  // [LanguageEnum.es]: '西班牙语',
  // [LanguageEnum.it]: '意大利语',
  // [LanguageEnum.pt]: '葡萄牙语',
  // [LanguageEnum.ru]: '俄语',
  // [LanguageEnum.ar]: '阿拉伯语',
  // [LanguageEnum.ko]: '韩语',
}

export const nameToLanguageMap = invert(languageToNameMap)

export enum PartOfSpeechEnum {
  unknown = 0,
  type1 = 1,
  type2 = 2,
  type3 = 3,
  type4 = 4,
  type5 = 5,
  type6 = 6,
  type7 = 7,
  type8 = 8,
  type9 = 9,
  type10 = 10,
  type11 = 11,
  type12 = 12,
}

export const partOfSpeechToLanguageMap: Partial<
  Record<LanguageEnum, Partial<Record<PartOfSpeechEnum, string>>>
> = {
  [LanguageEnum.ja]: {
    [PartOfSpeechEnum.unknown]: '未知',
    [PartOfSpeechEnum.type1]: '名词',
    [PartOfSpeechEnum.type2]: '代名词',
    [PartOfSpeechEnum.type3]: '动词',
    [PartOfSpeechEnum.type4]: '形容词',
    [PartOfSpeechEnum.type5]: '形容动词',
    [PartOfSpeechEnum.type6]: '副词',
    [PartOfSpeechEnum.type7]: '连体词',
    [PartOfSpeechEnum.type8]: '接续词',
    [PartOfSpeechEnum.type9]: '感叹词',
    [PartOfSpeechEnum.type10]: '助词',
    [PartOfSpeechEnum.type11]: '助动词',
    [PartOfSpeechEnum.type12]: '其他',
  },
} as const
