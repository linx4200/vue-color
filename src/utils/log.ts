const _log = (category: string, ...msg: unknown[]) => {
  const prefix = `[${category.toUpperCase()}]`;
  console.log(prefix, msg);
}

function noop(): void {};

const log = __IS_DEBUG__ ? _log : noop;

export { log };