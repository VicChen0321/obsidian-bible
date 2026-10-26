import { LocalProvider } from "../providers/local-provider";
import { cuvSource } from "./cuv";

export function createBundledProvider(): LocalProvider {
  return new LocalProvider([cuvSource]);
}
