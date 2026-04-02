import { plugin } from 'bun'

// Features enabled for interactive Mythos TUI development.
// In production, the Bun bundler resolves these at compile time.
const ENABLED_FEATURES = new Set([
  'AUTO_THEME',
  'QUICK_SEARCH',
  'MESSAGE_ACTIONS',
])

plugin({
  name: 'bun-bundle-polyfill',
  setup(build) {
    const filter = /^bun:bundle$|^bundle$/
    build.onResolve({ filter }, () => ({
      path: 'bun-bundle-polyfill',
      namespace: 'bun-bundle-ns',
    }))
    build.onLoad({ filter: /.*/, namespace: 'bun-bundle-ns' }, () => ({
      contents: `export function feature(name) { return ${JSON.stringify([...ENABLED_FEATURES])}.includes(name) }`,
      loader: 'js',
    }))
  },
})
