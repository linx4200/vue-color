const isDebug = !!import.meta.env.VITE_DEBUG;

const _log = (category: string, ...msg: unknown[]) => {
  const prefix = `[${category.toUpperCase()}]`;
  console.log(prefix, msg);
}

function noop(): void {};

const log = isDebug ? _log : noop;

export { log };