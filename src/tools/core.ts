export function getExposedName(scriptContent: string) {
  const globalVarRegex =
    /(?:let|const|function)\s+\[?\{?\s*([a-zA-Z_$][\w$,\s]*)\b/g;
  return [...scriptContent.matchAll(globalVarRegex)]
    .flatMap((match) => match[1].split(",").map((v) => v.trim()))
    .filter(Boolean);
}
/*  */

export function transport(funs: string[], pseudoCallThis: object = window) {
  const funPocket: { [key: string]: any[][] } = {};
  function _transport(fnStr: string) {
    funPocket[fnStr] = [];
    eval(`${fnStr} = (...args) => FUN_CONVEYOR[fnStr].push(args)`);
    return eval(fnStr);
  }
  funs.forEach((k) => pseudoCallThis[k] = _transport(k));
  return funPocket;
}
