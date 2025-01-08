export const getPageXYFromEvent = (e: MouseEvent | TouchEvent, type: 'x' | 'y' = 'x') => {
  const keyName = type === 'x' ? 'pageX' : 'pageY';
  let value = 0;
  if (e instanceof MouseEvent) {
    value = e[keyName];
  }
  if (e instanceof TouchEvent) {
    value = (e.touches ? e.touches[0][keyName] : e.changedTouches ? e.changedTouches[0][keyName] : 0);
  }
  return value;
}