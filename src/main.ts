import { getExposedName, transport } from "./tools";
/*  */
const SETUP_VUE = (window as any).Vue;
const LIFECYCLES = [
  "onMounted",
  "onUpdated",
  "onUnmounted",
  "onBeforeMount",
  "onBeforeUpdate",
  "onBeforeUnmount",
];
/*  */
if (!SETUP_VUE) {
  console.error(
    'Vue is not found, please import Vue first!\nPlease insert ```<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>``` in front',
  );
}
if (Number(SETUP_VUE.version.split(".")[0]) < 3) {
  console.error("setup-in-html requires Vue 3");
}
/*  */
/*  */
Object.entries(SETUP_VUE).forEach(([k, v]) => window[k] = v);
/*  */
const funPocket = transport([...LIFECYCLES /* more */]);
/*  */
/*  */
document.addEventListener("DOMContentLoaded", () => {
  const scriptElement = document.querySelector("script[setup]");
  const setupContent = scriptElement?.textContent || "";
  const mountPointSelector = scriptElement?.getAttribute("setup") ||
    (document.querySelector("#app") ? "#app" : "body>*");

  const exposedList = getExposedName(setupContent);

  SETUP_VUE.createApp({
    setup: () => {
      Object.entries(funPocket).forEach(([vueFnName, argsArr]) => {
        argsArr.forEach((args) => {
          SETUP_VUE[vueFnName](...args);
        });
        window[vueFnName] = SETUP_VUE[vueFnName];
      });

      return Object.fromEntries(
        exposedList.map((a) => [a, eval(a)]),
      );
    },
  }).mount(mountPointSelector);
});

/*  */
/*  */
