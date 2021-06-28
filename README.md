# vite-plugin-resolve-extension-vue [![npm](https://img.shields.io/npm/v/vite-plugin-resolve-extension-vue.svg)](https://npmjs.com/package/vite-plugin-resolve-extension-vue)

A temporary workaround for issue `No loader is configured for ".vue"`, original issue [#3532](https://github.com/vitejs/vite/issues/3532).

```js
// vite.config.js
import resolveExtensionVue from 'vite-plugin-resolve-extension-vue';

export default {
  plugins: [resolveExtensionVue()],
};
```

## License

MIT
