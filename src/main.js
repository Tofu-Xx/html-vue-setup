// @ts-ignore
if (!Vue) {
  console.error('Vue is not found, please import Vue first!\nVue can be imported from https://unpkg.com/vue@3/dist/vue.global.js');
}
// @ts-ignore
if (Number(Vue.version.split('.')[0]) < 3) {
  console.warn('setup-in-html requires Vue 3');
}
// @ts-ignore
!(() => {
  // @ts-ignore
  Object.entries(Vue).forEach(([k, v]) => window[k] = v);
  const gotoSetupMap = {};
  // @ts-ignore
  const gotoSetup = (fnStr) => {
    gotoSetupMap[fnStr] = [];
    eval(`${fnStr} = (...args) => gotoSetupMap[fnStr].push(args)`);
    return eval(fnStr);
  };
  // @ts-ignore
  const lifecycles = Object.keys(Vue).filter(k=>/^on[A-Z][a-zA-Z]*/.test(k))
  lifecycles.forEach(k=>window[k] = gotoSetup(k));
  document.addEventListener('DOMContentLoaded', () => {
    let globalVars = [], g;
    // @ts-ignore
    const scriptElement = document.querySelector('script[setup]'), setupContent = scriptElement?.innerText || '';
    const mountPointSelector = scriptElement?.getAttribute('setup') || (document.querySelector('#app') ? '#app' : 'body>*');
    const globalVarRegex = /(?:let|const|function)\s+\[?\{?\s*([a-zA-Z_$][\w$,\s]*)\b/g;
    
    while ((g = globalVarRegex.exec(setupContent)) !== null) {
      // @ts-ignore
      const t = g[1];
      globalVars = [...globalVars, ...(t.includes(',') ? t.split(',').map(i => i.trim()) : [t])];
    }
    // @ts-ignore
    createApp({
      // @ts-ignore
      setup: () => {
        // @ts-ignore
        Object.entries(gotoSetupMap).map(([vueFnName, argsArr]) => {
          // @ts-ignore
          argsArr.forEach(args => {
            // @ts-ignore
            Vue[vueFnName](...args);
          });
          // @ts-ignore
          eval(`${vueFnName} = Vue.${vueFnName}`);
        });
        // @ts-ignore
        return Object.fromEntries(globalVars.map((a) => {
          try {
            return [a, eval(a)];
          } catch { }
        }).filter(Boolean));
      }
    }).mount(mountPointSelector);
  });

})();

