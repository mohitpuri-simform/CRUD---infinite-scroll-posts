/**
 * @description this is a utility reusable method used for debouncing the search
 * @export
 * @template T
 * @param {T} func
 * @param {number} delay
 * @return {*}
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * @description this method is used to attach a className to the passed element
 * @export
 * @param {HTMLElement} element
 * @param {string} className
 */
export function attachClassName(element: HTMLElement, className: string) {
  element.className = className;
}
