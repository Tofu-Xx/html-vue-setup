export function getExposedName(scriptContent: string) {
  const globalVarRegex =
    /(?:let|const|function)\s+\[?\{?\s*([a-zA-Z_$][\w$,\s]*)\b/g;
  return [...scriptContent.matchAll(globalVarRegex)]
    .flatMap((match) => match[1].split(",").map((v) => v.trim()))
    .filter(Boolean);
}
/*  */

export const FUN_CONVEYOR: { [key: string]: any[][] } = {};
export function transport(fnStr: string) {
  FUN_CONVEYOR[fnStr] = [];
  eval(`${fnStr} = (...args) => FUN_CONVEYOR[fnStr].push(args)`);
  return eval(fnStr);
}
