export const isFn = (fn) => typeof fn === 'function'
export const runIfIsFn = (fn, ...args) => {
  if (isFn(fn)) fn(...args)
}
