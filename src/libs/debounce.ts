export function debounce<T>(fn: Function, delay: number) {
  let t: number
  return function (n: T) {
    if (t) {
      clearTimeout(t)
    }
    t = setTimeout(() => {
      fn(n);
    }, delay);
  }
}