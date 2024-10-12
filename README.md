<h1 align="center">html-vue-setup</h1>

<p align="center">❗本项目停止维护，建议使用<a href="https://github.com/tofu-xx/setupin">setupin</a>代替本项目❗</p>

## 什么是html-vue-setup

html-vue-setup 是一个用于在 HTML 中使用 Vue 3 的工具。它允许你在 HTML
文件中直接使用类似 Vue 3 setup 语法糖的语法

## 快速上手

1. **必须**先在 HTML 文件中引入 [Vue3](https://cn.vuejs.org/) 的 CDN 链接

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

2. 在 HTML 文件中引入 html-vue-setup

```html
<script src="https://unpkg.com/html-vue-setup/dist/main.umd.js"></script>
```

3. 在 HTML 文件中使用 setup 语法糖

```html
<script setup>
  const count = ref(0)
</script>
```

## 基本特性

### 1.自动挂载

1. 不使用 html-vue-setup 时，我们需要手动调用 createApp
   函数，并传入一个对象，然后在对象中定义 setup 函数,并返回需要暴露的数据

```html
<script>
  const { createApp } = Vue;
  createApp({
    setup: () => {
      /* 您的代码逻辑 */
      return {
        /* 需要暴露的数据 */
      };
    }
  }).mount('#app');
</script>
```

2. 使用 html-vue-setup 后，爽

```html
<script setup>
  /* 您的代码逻辑 */
</script>
```

#### 挂载位置

1. 默认挂载

> 默认挂载到#app上 _(id为app的元素)_ 若没有则挂载到body下的第一个元素上

所以你可以这样写

```html
<script setup>
  const count = ref(0)
</script>
<main>
  <div>{{ count }}</div>
</main>
```

浏览器会将`<main>`标签挂载到`<body>`下
然后html-vue-setup会把vue实例挂载到`<main>`上

> _这种写法是为了更接近vue的SFC格式，也是本人的习惯写法_

2. 自定义挂载

```html
<script setup="#my-app">
  const count = ref(0)
</script>
```

**setup属性值最终会传参到mount函数中**

#### 暴露数据

setup函数中需要手动return需要暴露的数据，这个十分影响开发体验，所以html-vue-setup会自动将setup函数中定义的变量，自动return出去，不需要手动return

> _暂不支持命名解构_

```html
<script setup>
  const count = ref(0)
</script>
<main>
  <div>{{ count }}</div>
</main>
```

### 2.自动导入

1. 不使用 html-vue-setup 时，我们需要手动解构 Vue 3 的函数，或者都带上 Vue 前缀

```html
<script>
const { ref, createApp } = Vue;
  createApp({
    setup: () => {
      const count = ref(0);
      return {
        count,
      };
    }
  }).mount('#app');
</script>
```

2. 使用 html-vue-setup 后，我们可以直接使用，不需要手动解构，或者都带上 Vue 前缀

```html
<script setup>
  const count = ref(0)
</script>
```

## 书写顺序

vue3三更建议 `<script setup>`写在`<template>`之前
所以html-vue-setup也支持了这种写法

```html
<!-- 可以写在视图前面 -->
<script setup>
  const count = ref(0)
</script>
<main>
  <div>{{ count }}</div>
</main>
```

## 更多示例

[示例](https://github.com/Tofu-Xx/html-vue-setup/tree/main/test)
