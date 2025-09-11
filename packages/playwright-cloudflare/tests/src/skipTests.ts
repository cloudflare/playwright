export const skipTests: string[][] = [
  ['library/har.spec.ts', 'should include content @smoke'],
  ['page/wheel.spec.ts', 'should dispatch wheel events @smoke'],
  ['page/wheel.spec.ts', 'should dispatch wheel events after popup was opened @smoke'],
  ['page/workers.spec.ts', 'Page.workers @smoke'],
];

export const skipErrorMessages: Array<string | RegExp> = [
  'Cloudflare Workers does not support',
  '__filename is not defined',
  '__dirname is not defined',
  `\\(\\) => {}`, // Cloudflare serializes empty arrow function with new lines
  'createHttp2Server is not defined',
  /\[unenv\] .* is not implemented yet!/,
  /Received string:\s+"Cloudflare-Workers"/,
  '.rendering.cfdata.org',
];
