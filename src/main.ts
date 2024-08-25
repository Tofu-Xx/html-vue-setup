const TOPO_VUE = (window as any).Vue;
if (!TOPO_VUE) {
  console.error(
    "Vue is not found, please import Vue first!\nVue can be imported from https://unpkg.com/vue@3/dist/vue.global.js",
  );
}

if (Number(TOPO_VUE.version.split(".")[0]) < 3) {
  console.error("setup-in-html requires Vue 3");
}

Object.entries(TOPO_VUE).forEach(([k, v]) => window[k] = v);
const gotoSetupMap = {};

const gotoSetup = (fnStr: string) => {
  gotoSetupMap[fnStr] = [];
  eval(`${fnStr} = (...args) => gotoSetupMap[fnStr].push(args)`);
  return eval(fnStr);
};

const lifecycles = Object.keys(TOPO_VUE).filter((k) =>
  /^on[A-Z][a-zA-Z]*/.test(k)
);
lifecycles.forEach((k) => window[k] = gotoSetup(k));

document.addEventListener("DOMContentLoaded", () => {
  let globalVars = [], g;

  const scriptElement = document.querySelector("script[setup]");
  const setupContent = scriptElement?.textContent || "";
  const mountPointSelector = scriptElement?.getAttribute("setup") ||
    (document.querySelector("#app") ? "#app" : "body>*");

    const exposedList = getExposedName(setupContent)
  // const globalVarRegex =
  //   /(?:let|const|function)\s+\[?\{?\s*([a-zA-Z_$][\w$,\s]*)\b/g;

  // while ((g = globalVarRegex.exec(setupContent)) !== null) {
  //   console.log(g)
  //   const t = g[1];
  //   globalVars = [
  //     ...globalVars,
  //     ...(t.includes(",") ? t.split(",").map((i) => i.trim()) : [t]),
  //   ];
  // }

  // const variableAndFunctionNames = setupContent.match(/(?:var|let|const|function)\s+([a-zA-Z_$][\w$]*)|([a-zA-Z_$][\w$]*)\s*[:=]\s*(?:function|\()/g)!
  // .map(match => match.replace(/(?:var|let|const|function)\s+|[:=]\s*(?:function|\().*/g, ''));

  // console.log(variableAndFunctionNames)

  // console.log(globalVars)

  TOPO_VUE.createApp({
    setup: () => {
      Object.entries(gotoSetupMap).map(([vueFnName, argsArr]) => {
        argsArr.forEach((args) => {
          TOPO_VUE[vueFnName](...args);
        });

        eval(`${vueFnName} = Vue.${vueFnName}`);
      });

      return Object.fromEntries(
        exposedList.map((a) => {
          try {
            return [a, eval(a)];
          } catch {}
        }).filter(Boolean),
      );
    },
  }).mount(mountPointSelector);
});



/*  */
function getExposedName(scriptContent) {
  // 正则表达式匹配 let、const、function 声明
  const globalVarRegex = /(?:let|const|function)\s+\[?\{?\s*([a-zA-Z_$][\w$,\s]*)\b/g;
  
  // 提取所有匹配项并将它们扁平化到一个数组中
  return [...scriptContent.matchAll(globalVarRegex)]
    .flatMap(match => match[1].split(',').map(v => v.trim()))
    .filter(Boolean); // 过滤掉空字符串
}