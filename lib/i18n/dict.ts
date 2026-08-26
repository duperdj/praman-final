// Dictionary shape + registry. hi.ts is the source of truth for the key shape;
// en.ts is type-checked against it, so a missing translation fails the build.
import type { Lang } from "@/lib/contracts";
import hi from "./hi";
import en from "./en";

export type Dict = typeof hi;

export const dictionaries: Record<Lang, Dict> = { hi, en };

export function getDict(lang: Lang): Dict {
  return dictionaries[lang] ?? dictionaries.hi;
}
