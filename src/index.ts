import { sep, join } from 'path';
import { existsSync } from 'fs';
import { Plugin, PluginOption } from 'vite';

function resolveVue(source: string): string | void {
  const suffix = ['.vue', String.raw`${sep}index.vue`];
  for (const ext of suffix) {
    const retPath = source + ext;
    const exist = existsSync(retPath);
    if (exist) {
      return retPath;
    }
  }
}

export default function vitePluginResolveExtensionVue(): PluginOption {
  const resolvedMap: Record<string, string> = {};

  let config: Parameters<NonNullable<Plugin['configResolved']>>[0];
  let base: string;

  return {
    name: 'vite-plugin-resolve-extension-vue',
    config(config, env) {
      const { extensions = [] } = config.resolve || {};

      if (env.mode === 'development' && extensions.length) {
        extensions.splice(extensions.indexOf('.vue'), 1);
      }
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      // C:\\path\\to\\path -> /path/to/path
      base = config.root.replace(/^[A-Z]:/, '').replace(/\\+/g, '/');
    },
    resolveId(source, importer) {
      if (config.mode !== 'development' || !importer || /\.\w+$/.test(source)) return null;
      if (!source.startsWith(base) && !source.startsWith('/src') && !source.startsWith('.')) return null;
      if (source.startsWith(base) && !importer.endsWith('.html')) return null;

      const key = [source, importer].join(':');

      if (resolvedMap[key]) {
        return resolvedMap[key];
      }

      const resolved = resolveVue(
        (() => {
          if (source.startsWith('.')) {
            return join(importer, '../', source);
          }

          // importer ends with `.html`
          // source starts with base (apear on windows)
          if (source.startsWith(base)) {
            return join(config.root, source.substring(base.length));
          }

          // importer ends with `.html`
          // source starts with `/src` (apear on linux)
          return join(config.root, source);
        })(),
      );

      if (resolved) {
        resolvedMap[key] = resolved;
        return resolvedMap[key];
      }
    },
  };
};
