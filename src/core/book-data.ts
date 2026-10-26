import type { BookId, Language } from "./types";

/** [full name, short name, ...extra aliases]. Full and short names are aliases too. */
export type BookNames = readonly [full: string, short: string, ...aliases: string[]];

export interface BookData {
  id: BookId;
  /** Chapter count under standard Protestant (English) versification. */
  chapters: number;
  names: Record<Language, BookNames>;
}

// prettier-ignore
export const BOOK_DATA: readonly BookData[] = [
  { id: "GEN", chapters: 50, names: {
    "zh-TW": ["創世記", "創"],
  } },
  { id: "EXO", chapters: 40, names: {
    "zh-TW": ["出埃及記", "出"],
  } },
  { id: "LEV", chapters: 27, names: {
    "zh-TW": ["利未記", "利"],
  } },
  { id: "NUM", chapters: 36, names: {
    "zh-TW": ["民數記", "民"],
  } },
  { id: "DEU", chapters: 34, names: {
    "zh-TW": ["申命記", "申"],
  } },
  { id: "JOS", chapters: 24, names: {
    "zh-TW": ["約書亞記", "書"],
  } },
  { id: "JDG", chapters: 21, names: {
    "zh-TW": ["士師記", "士"],
  } },
  { id: "RUT", chapters: 4, names: {
    "zh-TW": ["路得記", "得"],
  } },
  { id: "1SA", chapters: 31, names: {
    "zh-TW": ["撒母耳記上", "撒上"],
  } },
  { id: "2SA", chapters: 24, names: {
    "zh-TW": ["撒母耳記下", "撒下"],
  } },
  { id: "1KI", chapters: 22, names: {
    "zh-TW": ["列王紀上", "王上"],
  } },
  { id: "2KI", chapters: 25, names: {
    "zh-TW": ["列王紀下", "王下"],
  } },
  { id: "1CH", chapters: 29, names: {
    "zh-TW": ["歷代志上", "代上"],
  } },
  { id: "2CH", chapters: 36, names: {
    "zh-TW": ["歷代志下", "代下"],
  } },
  { id: "EZR", chapters: 10, names: {
    "zh-TW": ["以斯拉記", "拉"],
  } },
  { id: "NEH", chapters: 13, names: {
    "zh-TW": ["尼希米記", "尼"],
  } },
  { id: "EST", chapters: 10, names: {
    "zh-TW": ["以斯帖記", "斯"],
  } },
  { id: "JOB", chapters: 42, names: {
    "zh-TW": ["約伯記", "伯"],
  } },
  { id: "PSA", chapters: 150, names: {
    "zh-TW": ["詩篇", "詩"],
  } },
  { id: "PRO", chapters: 31, names: {
    "zh-TW": ["箴言", "箴"],
  } },
  { id: "ECC", chapters: 12, names: {
    "zh-TW": ["傳道書", "傳"],
  } },
  { id: "SNG", chapters: 8, names: {
    "zh-TW": ["雅歌", "歌"],
  } },
  { id: "ISA", chapters: 66, names: {
    "zh-TW": ["以賽亞書", "賽"],
  } },
  { id: "JER", chapters: 52, names: {
    "zh-TW": ["耶利米書", "耶"],
  } },
  { id: "LAM", chapters: 5, names: {
    "zh-TW": ["耶利米哀歌", "哀"],
  } },
  { id: "EZK", chapters: 48, names: {
    "zh-TW": ["以西結書", "結"],
  } },
  { id: "DAN", chapters: 12, names: {
    "zh-TW": ["但以理書", "但"],
  } },
  { id: "HOS", chapters: 14, names: {
    "zh-TW": ["何西阿書", "何"],
  } },
  { id: "JOL", chapters: 3, names: {
    "zh-TW": ["約珥書", "珥"],
  } },
  { id: "AMO", chapters: 9, names: {
    "zh-TW": ["阿摩司書", "摩"],
  } },
  { id: "OBA", chapters: 1, names: {
    "zh-TW": ["俄巴底亞書", "俄"],
  } },
  { id: "JON", chapters: 4, names: {
    "zh-TW": ["約拿書", "拿"],
  } },
  { id: "MIC", chapters: 7, names: {
    "zh-TW": ["彌迦書", "彌"],
  } },
  { id: "NAM", chapters: 3, names: {
    "zh-TW": ["那鴻書", "鴻"],
  } },
  { id: "HAB", chapters: 3, names: {
    "zh-TW": ["哈巴谷書", "哈"],
  } },
  { id: "ZEP", chapters: 3, names: {
    "zh-TW": ["西番雅書", "番"],
  } },
  { id: "HAG", chapters: 2, names: {
    "zh-TW": ["哈該書", "該"],
  } },
  { id: "ZEC", chapters: 14, names: {
    "zh-TW": ["撒迦利亞書", "亞"],
  } },
  { id: "MAL", chapters: 4, names: {
    "zh-TW": ["瑪拉基書", "瑪"],
  } },
  { id: "MAT", chapters: 28, names: {
    "zh-TW": ["馬太福音", "太"],
  } },
  { id: "MRK", chapters: 16, names: {
    "zh-TW": ["馬可福音", "可"],
  } },
  { id: "LUK", chapters: 24, names: {
    "zh-TW": ["路加福音", "路"],
  } },
  { id: "JHN", chapters: 21, names: {
    "zh-TW": ["約翰福音", "約"],
  } },
  { id: "ACT", chapters: 28, names: {
    "zh-TW": ["使徒行傳", "徒"],
  } },
  { id: "ROM", chapters: 16, names: {
    "zh-TW": ["羅馬書", "羅"],
  } },
  { id: "1CO", chapters: 16, names: {
    "zh-TW": ["哥林多前書", "林前"],
  } },
  { id: "2CO", chapters: 13, names: {
    "zh-TW": ["哥林多後書", "林後"],
  } },
  { id: "GAL", chapters: 6, names: {
    "zh-TW": ["加拉太書", "加"],
  } },
  { id: "EPH", chapters: 6, names: {
    "zh-TW": ["以弗所書", "弗"],
  } },
  { id: "PHP", chapters: 4, names: {
    "zh-TW": ["腓立比書", "腓"],
  } },
  { id: "COL", chapters: 4, names: {
    "zh-TW": ["歌羅西書", "西"],
  } },
  { id: "1TH", chapters: 5, names: {
    "zh-TW": ["帖撒羅尼迦前書", "帖前"],
  } },
  { id: "2TH", chapters: 3, names: {
    "zh-TW": ["帖撒羅尼迦後書", "帖後"],
  } },
  { id: "1TI", chapters: 6, names: {
    "zh-TW": ["提摩太前書", "提前"],
  } },
  { id: "2TI", chapters: 4, names: {
    "zh-TW": ["提摩太後書", "提後"],
  } },
  { id: "TIT", chapters: 3, names: {
    "zh-TW": ["提多書", "多"],
  } },
  { id: "PHM", chapters: 1, names: {
    "zh-TW": ["腓利門書", "門"],
  } },
  { id: "HEB", chapters: 13, names: {
    "zh-TW": ["希伯來書", "來"],
  } },
  { id: "JAS", chapters: 5, names: {
    "zh-TW": ["雅各書", "雅"],
  } },
  { id: "1PE", chapters: 5, names: {
    "zh-TW": ["彼得前書", "彼前"],
  } },
  { id: "2PE", chapters: 3, names: {
    "zh-TW": ["彼得後書", "彼後"],
  } },
  { id: "1JN", chapters: 5, names: {
    "zh-TW": ["約翰一書", "約壹", "約一", "約翰壹書"],
  } },
  { id: "2JN", chapters: 1, names: {
    "zh-TW": ["約翰二書", "約貳", "約二", "約翰貳書"],
  } },
  { id: "3JN", chapters: 1, names: {
    "zh-TW": ["約翰三書", "約參", "約三", "約翰參書"],
  } },
  { id: "JUD", chapters: 1, names: {
    "zh-TW": ["猶大書", "猶"],
  } },
  { id: "REV", chapters: 22, names: {
    "zh-TW": ["啟示錄", "啟"],
  } },
];
