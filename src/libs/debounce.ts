export function debounce(fn: Function, delay: number) {
  let t: number
  return function () {
    if (t) {
      clearTimeout(t)
    }
    t = setTimeout(() => {
      fn();
    }, delay);
  }
}