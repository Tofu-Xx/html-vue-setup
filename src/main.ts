/*  */
const TOPO_VUE = (window as any).Vue;
const FUN_CONVEYOR: { [key: string]: any[][] } = {};
const LIFECYCLES = [
  "onMounted",
  "onUpdated",
  "onUnmounted",
  "onBeforeMount",
  "onBeforeUpdate",
  "onBeforeUnmount",
];
/*  */
if (!TOPO_VUE) {
  console.error(
    "Vue is not found, please import Vue first!\nVue can be imported from https://unpkg.com/vue@3/dist/vue.global.js",
  );
}
if (Number(TOPO_VUE.version.split(".")[0]) < 3) {
  console.error("setup-in-html requires Vue 3");
}
/*  */
/*  */
Object.entries(TOPO_VUE).forEach(([k, v]) => window[k] = v);
/*  */
[...LIFECYCLES /* more */].forEach((k) => window[k] = transport(k));
/*  */
/*  */
document.addEventListener("DOMContentLoaded", () => {
  const scriptElement = document.querySelector("script[setup]");
  const setupContent = scriptElement?.textContent || "";
  const mountPointSelector = scriptElement?.getAttribute("setup") ||
    (document.querySelector("#app") ? "#app" : "body>*");

  const exposedList = getExposedName(setupContent);

  TOPO_VUE.createApp({
    setup: () => {
      Object.entries(FUN_CONVEYOR).map(([vueFnName, argsArr]) => {
        argsArr.forEach((args) => {
          TOPO_VUE[vueFnName](...args);
        });
      });

      return Object.fromEntries(
        exposedList.map((a) => [a, eval(a)]),
      );
    },
  }).mount(mountPointSelector);
});

/*  */
/*  */
function getExposedName(scriptContent) {
  // 正则表达式匹配 let、const、function 声明
  const globalVarRegex =
    /(?:let|const|function)\s+\[?\{?\s*([a-zA-Z_$][\w$,\s]*)\b/g;

  // 提取所有匹配项并将它们扁平化到一个数组中
  return [...scriptContent.matchAll(globalVarRegex)]
    .flatMap((match) => match[1].split(",").map((v) => v.trim()))
    .filter(Boolean); // 过滤掉空字符串
}
/*  */
function transport(fnStr: string) {
  FUN_CONVEYOR[fnStr] = [];
  eval(`${fnStr} = (...args) => FUN_CONVEYOR[fnStr].push(args)`);
  return eval(fnStr);
}
