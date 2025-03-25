# 🎨 Vue Color v3.0

<p>
  <a href="https://www.npmjs.com/package/vue-color"><img src="https://img.shields.io/npm/v/vue-color.svg?label=npm" alt="NPM version" /></a>
  <a href="https://www.npmjs.com/package/vue-color/v/next"><img src="https://img.shields.io/npm/v/vue-color/next?label=npm%20@next&color=orange" alt="NPM next version" /></a>
  <img src="https://img.shields.io/badge/Vue-3.0-brightgreen" alt="Vue 3" />
</p>

![GitHub stars](https://img.shields.io/github/stars/linx4200/vue-color?style=social)
![size](https://img.shields.io/bundlephobia/minzip/vue-color)
![Downloads](https://img.shields.io/npm/dm/vue-color.svg)

A collection of efficient and customizable color pickers built with [Vue 3](https://vuejs.org/), designed for modern web development.

<!-- ## [Live demo](http://xiaokaike.github.io/vue-color/) -->

<img src="./docs/pickers.png" style="width: 800px;">

## ✨ Features

- **Modular & Tree-Shakable** – Only import what you need.

- **TypeScript Ready** – Full typings for better DX.

<!-- - SSR-Friendly – Works seamlessly with server-side rendering frameworks. -->

- **Optimized for Accessibility** – Built with keyboard navigation and screen readers in mind.

## 📦 Installation

```bash
npm install vue-color@next
# or
yarn add vue-color@next
```

## 🔧 Usage

### Step 1: Import the stylesheet

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// import stylesheet
import 'vue-color/style.css';

createApp(App).mount('#app')
```

### Step 2: Import the components

```vue
<template>
  <ChromePicker v-model="color" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ChromePicker } from 'vue-color'

const color = defineModel({
  default: () => reactive({r: 0, g: 0, b: 255, a: 1})
});
</script>
```

## 📚 Documentation

> Coming soon...

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests as needed.

## 📄 License

[MIT](./LICENSE)
