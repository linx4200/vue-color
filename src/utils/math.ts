export function getFractionDigit(data: number | string) {
  const str = data.toString();
  if (str.indexOf('.') !== -1) {
    return str.split('.')[1].length;
  }
  return 0;
}