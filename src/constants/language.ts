import { invert } from 'lodash'

export enum LanguageEnum {
  japanese = 'ja',
  english = 'en',
  chinese = 'zh',
  france = 'fr',
  germany = 'de',
  spanish = 'es',
  italian = 'it',
  portuguese = 'pt',
  russian = 'ru',
  arab = 'ar',
  korean = 'ko',
}

export const languageToNameMap = {
  [LanguageEnum.japanese]: '日语',
  // [LanguageEnum.english]: '英语',
  // [LanguageEnum.chinese]: '中文',
  // [LanguageEnum.france]: '法语',
  // [LanguageEnum.germany]: '德语',
  // [LanguageEnum.spanish]: '西班牙语',
  // [LanguageEnum.italian]: '意大利语',
  // [LanguageEnum.portuguese]: '葡萄牙语',
  // [LanguageEnum.russian]: '俄语',
  // [LanguageEnum.arab]: '阿拉伯语',
  // [LanguageEnum.korean]: '韩语',
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
  [LanguageEnum.japanese]: {
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
