import {Pathnames} from 'next-intl/navigation';

export const locales = ['en', 'zh'] as const;

export const languages = [
  {
    code: "en-US",
    lang: "en",
    language: "English",
    languageInChineseSimple: "英语"
  },
  {
    code: "zh-CN",
    lang: "zh",
    language: "简体中文",
    languageInChineseSimple: "简体中文"
  }
]

export const languagesEn = [
  {
    code: "en-US",
    lang: "en",
    language: "English",
    languageInChineseSimple: "英语"
  }
]

export const pathnames = {
  '/': '/',
} satisfies Pathnames<typeof locales>;

// Use the default: `always`，设置为 as-needed可不显示默认路由
export const localePrefix = 'as-needed';

export type AppPathnames = keyof typeof pathnames;



export const langCode = ['en', 'zh'];
