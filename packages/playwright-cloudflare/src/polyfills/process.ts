if (!process || !process.env)
  throw new Error('process is not defined, ensure cloudflare worker has nodejs_compat compatibility flag enabled');

const noop = () => {};

const polyfillProcess = {
  versions: {
    node: '22.15.0',
  },
  version: 'v22.15.0',
  argv: [],
  stdout: {
    isTTY: false,
  },
  on: noop,
  addListener: noop,
  once: noop,
  off: noop,
  removeListener: noop,
  removeAllListeners: noop,
  emit: noop,
  prependListener: noop,
  prependOnceListener: noop,
};

function merge(target: any, source: any) {
  for (const key in source) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key]))
      target[key] = merge(target[key] || {}, source[key]);
    else if (!target[key])
      target[key] = source[key];
  }
  return target;
}

merge(process, polyfillProcess);
