import { currentlyLoadingFileSuite } from "playwright/lib/common/globals";
import { playwrightTestConfig } from "../internal";

type Location = {
  file: string;
  line: number;
  column: number;
};

export const requireOrImport = (file: string) => {
  if (file === 'playwright.config.ts')
    return playwrightTestConfig;
  // do nothing
};

export const setTransformConfig = () => {
  // do nothing
};

export function transformConfig() {
  return {
    babelPlugins: [],
    external: [],
  };
}

export function wrapFunctionWithLocation<A extends any[], R>(func: (location: Location, ...args: A) => R): (...args: A) => R {
  return (...args) => {
    const location = {
      file: currentlyLoadingFileSuite()?._requireFile || '',
      line: 0,
      column: 0,
    };
    return func(location, ...args);
  };
}
