export const getPageXYFromEvent = (e: MouseEvent | TouchEvent) => {
  // including scroll offset
  const res: {x: number, y: number} = { x: 0, y: 0 };
  if (e instanceof MouseEvent) {
    res.x = e.pageX;
    res.y = e.pageY;
  }
  if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
    res.x = (e.touches ? e.touches[0].pageX : e.changedTouches ? e.changedTouches[0].pageX : 0);
    res.y = (e.touches ? e.touches[0].pageY : e.changedTouches ? e.changedTouches[0].pageY : 0);
  }
  return res;
}

export const getScrollXY = () => {
  const x = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;
  const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  return { x, y }
}

/** get the position of the container relative to the document’s edge, regardless of any scrolling that has occurred */
export const getAbsolutePosition = (container: HTMLElement) => {
  const {x: scrollX, y: scrollY } = getScrollXY();

  const rect = container.getBoundingClientRect();
  return {
    x: rect.left + scrollX,
    y: rect.top + scrollY
  }
}

export const resolveArrowDirection = (e: KeyboardEvent) => {
  if (e.code === 'ArrowUp' || e.keyCode === 38) {
    return 'up';
  }
  if (e.code === 'ArrowDown' || e.keyCode === 40) {
    return 'down';
  }
  if (e.code === 'ArrowLeft' || e.keyCode === 37) {
    return 'left';
  }
  if (e.code === 'ArrowRight' || e.keyCode === 39) {
    return 'right';
  }
  return null;
}