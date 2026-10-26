import { createInMemorySource, LocalProvider } from "../src/providers/local-provider";
import type { TranslationInfo } from "../src/core/types";

// Fixtures for exercising the code. CUV holds one real excerpt (1 Peter 1:24-25, public domain
// text); SAMPLE is a synthetic translation with obviously fake text, used to test multi-translation
// behavior without bundling anything.

export const CUV: TranslationInfo = {
  id: "cuv",
  name: "和合本",
  abbreviation: "和合本",
  language: "zh-TW",
};

export const SAMPLE: TranslationInfo = {
  id: "sample",
  name: "範例譯本",
  abbreviation: "範例",
  language: "zh-TW",
};

const sampleJohn3 = Array.from({ length: 36 }, (_, i) => `範例 約 3:${i + 1}`);

export function createFixtureProvider(): LocalProvider {
  return new LocalProvider([
    createInMemorySource(CUV, {
      "1PE": [
        Array.from({ length: 23 }, (_, i) => `(彼前 1:${i + 1})`).concat([
          "因為凡有血氣的，盡都如草，他的美榮都像草上的花。草必枯乾，花必凋謝；",
          "惟有主的道是永存的。所傳給你們的福音就是這道。",
        ]),
      ],
    }),
    createInMemorySource(SAMPLE, {
      GEN: [["範例 創 1:1", "範例 創 1:2", "範例 創 1:3"]],
      JHN: [[], [], sampleJohn3],
    }),
  ]);
}
