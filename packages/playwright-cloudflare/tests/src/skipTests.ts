export const skipTests: string[][] = [
  ["library/browsercontext-cookies.spec.ts", "should get a cookie @smoke"],
  [
    "library/browsercontext-credentials.spec.ts",
    "should work with correct credentials @smoke",
  ],
  ["library/browsercontext-device.spec.ts", "device", "should work @smoke"],
  ["library/capabilities.spec.ts", "should play webm video @smoke"],
  ["library/capabilities.spec.ts", "should support webgl @smoke"],
  ["library/capabilities.spec.ts", "should support webgl 2 @smoke"],
  ["page/frame-hierarchy.spec.ts", "should handle nested frames @smoke"],
  ["page/page-drag.spec.ts", "Drag and drop", "should work @smoke"],
  ["page/page-event-popup.spec.ts", "should work @smoke"],
  ["page/page-history.spec.ts", "page.goBack should work @smoke"],
  ["page/page-route.spec.ts", "should intercept @smoke"],
  [
    "[workers]",
    "proxyTests/library/capabilities.spec.ts",
    "should play audio @smoke",
  ],
];
