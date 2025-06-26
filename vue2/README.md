# Vue 2.7 Compatibility Layer

This folder provides backward compatibility for Vue 2.7.
It acts as a separate project but reuses the same `vue-color` source components.

## Build

Vue 2.7 and Vue 3 have different APIs, so a standalone build process is required.

We use **Vite** with the [`@vitejs/plugin-vue2`](https://www.npmjs.com/package/@vitejs/plugin-vue2) plugin.

- **Output directory**: `./dist/vue2`

## Testing

**Vitest** does not work well with Vue 2.7 in this project and was primarily designed for Vue 3.

Therefore, we use **Jest**, which requires **Babel** setup.

This folder includes only essential test cases to validate `v-model` behavior for Vue 2.7 components.
