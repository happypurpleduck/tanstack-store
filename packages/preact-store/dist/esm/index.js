import { signal, effect } from "@preact/signals";
export * from "@tanstack/store";
function useStore(store, selector = (d) => d) {
  const slice = signal(selector(store.state));
  effect(() => {
    const unsub = store.subscribe(() => {
      const data = selector(store.state);
      if (shallow(slice.value, data)) {
        return;
      }
      slice.value = data;
    });
    return () => {
      unsub();
    };
  });
  return slice.value;
}
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k, v] of objA) {
      if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v of objA) {
      if (!objB.has(v)) return false;
    }
    return true;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
export {
  shallow,
  useStore
};
//# sourceMappingURL=index.js.map
