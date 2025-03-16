"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const signals = require("@preact/signals");
const store = require("@tanstack/store");
function useStore(store2, selector = (d) => d) {
  const slice = signals.signal(selector(store2.state));
  signals.effect(() => {
    const unsub = store2.subscribe(() => {
      const data = selector(store2.state);
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
exports.shallow = shallow;
exports.useStore = useStore;
Object.keys(store).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => store[k]
  });
});
//# sourceMappingURL=index.cjs.map
