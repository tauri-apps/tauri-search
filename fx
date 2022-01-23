[
  {
    id: 'module::app::app.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'app',
    name: 'app',
    fileName: 'app.ts',
    comments: 'This package is also accessible with `window.__TAURI__.app` when `tauri.conf.json > build > withGlobalTauri` is set to true.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/app'
  },
  {
    id: 'module::cli::cli.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'cli',
    name: 'cli',
    fileName: 'cli.ts',
    comments: 'This package is also accessible with `window.__TAURI__.cli` when `tauri.conf.json > build > withGlobalTauri` is set to true.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/cli'
  },
  {
    id: 'module::clipboard::clipboard.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'clipboard',
    name: 'clipboard',
    fileName: 'clipboard.ts',
    comments: 'This package is also accessible with `window.__TAURI__.clipboard` when `tauri.conf.json > build > withGlobalTauri` is set to true.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/clipboard'
  },
  {
    id: 'module::dialog::dialog.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'dialog',
    name: 'dialog',
    fileName: 'dialog.ts',
    comments: 'This package is also accessible with `window.__TAURI__.dialog` when `tauri.conf.json > build > withGlobalTauri` is set to true.\n' +
      '\n' +
      'The APIs must be allowlisted on `tauri.conf.json`:\n' +
      '```json\n' +
      '{\n' +
      '  "tauri": {\n' +
      '    "allowlist": {\n' +
      '      "dialog": {\n' +
      '        "all": true, // enable all dialog APIs\n' +
      '        "open": true, // enable file open API\n' +
      '        "save": true // enable file save API\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}\n' +
      '```\n' +
      'It is recommended to allowlist only the APIs you use for optimal bundle size and security.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/dialog'
  },
  {
    id: 'module::event::event.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'event',
    name: 'event',
    fileName: 'event.ts',
    comments: 'This package is also accessible with `window.__TAURI__.event` when `tauri.conf.json > build > withGlobalTauri` is set to true.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/event'
  },
  {
    id: 'module::fs::fs.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'fs',
    name: 'fs',
    fileName: 'fs.ts',
    comments: 'This package is also accessible with `window.__TAURI__.fs` when `tauri.conf.json > build > withGlobalTauri` is set to true.\n' +
      '\n' +
      'The APIs must be allowlisted on `tauri.conf.json`:\n' +
      '```json\n' +
      '{\n' +
      '  "tauri": {\n' +
      '    "allowlist": {\n' +
      '      "fs": {\n' +
      '        "all": true, // enable all FS APIs\n' +
      '        "readTextFile": true,\n' +
      '        "readBinaryFile": true,\n' +
      '        "writeFile": true,\n' +
      '        "writeBinaryFile": true,\n' +
      '        "readDir": true,\n' +
      '        "copyFile": true,\n' +
      '        "createDir": true,\n' +
      '        "removeDir": true,\n' +
      '        "removeFile": true,\n' +
      '        "renameFile": true\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}\n' +
      '```\n' +
      'It is recommended to allowlist only the APIs you use for optimal bundle size and security.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/fs'
  },
  {
    id: 'module::globalShortcut::globalShortcut.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'globalShortcut',
    name: 'globalShortcut',
    fileName: 'globalShortcut.ts',
    comments: 'This package is also accessible with `window.__TAURI__.globalShortcut` when `tauri.conf.json > build > withGlobalTauri` is set to true.\n' +
      '\n' +
      'The APIs must be allowlisted on `tauri.conf.json`:\n' +
      '```json\n' +
      '{\n' +
      '  "tauri": {\n' +
      '    "allowlist": {\n' +
      '      "globalShortcut": {\n' +
      '        "all": true // enable all global shortcut APIs\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}\n' +
      '```\n' +
      'It is recommended to allowlist only the APIs you use for optimal bundle size and security.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/globalShortcut'
  },
  {
    id: 'module::http::http.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'http',
    name: 'http',
    fileName: 'http.ts',
    comments: 'This package is also accessible with `window.__TAURI__.http` when `tauri.conf.json > build > withGlobalTauri` is set to true.\n' +
      '\n' +
      'The APIs must be allowlisted on `tauri.conf.json`:\n' +
      '```json\n' +
      '{\n' +
      '  "tauri": {\n' +
      '    "allowlist": {\n' +
      '      "http": {\n' +
      '        "all": true, // enable all http APIs\n' +
      '        "request": true // enable HTTP request API\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}\n' +
      '```\n' +
      'It is recommended to allowlist only the APIs you use for optimal bundle size and security.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/http'
  },
  {
    id: 'module::notification::notification.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'notification',
    name: 'notification',
    fileName: 'notification.ts',
    comments: 'This package is also accessible with `window.__TAURI__.notification` when `tauri.conf.json > build > withGlobalTauri` is set to true.\n' +
      '\n' +
      'The APIs must be allowlisted on `tauri.conf.json`:\n' +
      '```json\n' +
      '{\n' +
      '  "tauri": {\n' +
      '    "allowlist": {\n' +
      '      "notification": {\n' +
      '        "all": true // enable all notification APIs\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}\n' +
      '```\n' +
      'It is recommended to allowlist only the APIs you use for optimal bundle size and security.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/notification'
  },
  {
    id: 'module::os::os.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'os',
    name: 'os',
    fileName: 'os.ts',
    comments: 'This package is also accessible with `window.__TAURI__.fs` when `tauri.conf.json > build > withGlobalTauri` is set to true.\n' +
      '\n' +
      'The APIs must be allowlisted on `tauri.conf.json`:\n' +
      '```json\n' +
      '{\n' +
      '  "tauri": {\n' +
      '    "allowlist": {\n' +
      '      "os": {\n' +
      '        "all": true, // enable all Os APIs\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}\n' +
      '```\n' +
      'It is recommended to allowlist only the APIs you use for optimal bundle size and security.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/os'
  },
  {
    id: 'module::path::path.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'path',
    name: 'path',
    fileName: 'path.ts',
    comments: undefined,
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/path'
  },
  {
    id: 'module::process::process.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'process',
    name: 'process',
    fileName: 'process.ts',
    comments: undefined,
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/process'
  },
  {
    id: 'module::shell::shell.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'shell',
    name: 'shell',
    fileName: 'shell.ts',
    comments: undefined,
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/shell'
  },
  {
    id: 'module::tauri::tauri.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'tauri',
    name: 'tauri',
    fileName: 'tauri.ts',
    comments: 'This package is also accessible with `window.__TAURI__.tauri` when `tauri.conf.json > build > withGlobalTauri` is set to true.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/tauri'
  },
  {
    id: 'module::updater::updater.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'updater',
    name: 'updater',
    fileName: 'updater.ts',
    comments: 'This package is also accessible with `window.__TAURI__.updater` when `tauri.conf.json > build > withGlobalTauri` is set to true.',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/updater'
  },
  {
    id: 'module::window::window.ts',
    language: 'typescript',
    kind: 'Namespace',
    module: 'window',
    name: 'window',
    fileName: 'window.ts',
    comments: 'This package is also accessible with `window.__TAURI__.window` when `tauri.conf.json > build > withGlobalTauri` is set to true.\n' +
      '\n' +
      'The APIs must be allowlisted on `tauri.conf.json`:\n' +
      '```json\n' +
      '{\n' +
      '  "tauri": {\n' +
      '    "allowlist": {\n' +
      '      "window": {\n' +
      '        "all": true, // enable all window APIs\n' +
      '        "create": true // enable window creation\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}\n' +
      '```\n' +
      'It is recommended to allowlist only the APIs you use for optimal bundle size and security.\n' +
      '\n' +
      '# Window events\n' +
      '\n' +
      'Events can be listened using `appWindow.listen`:\n' +
      '```typescript\n' +
      "import { appWindow } from '@tauri-apps/api/window'\n" +
      "appWindow.listen('tauri://move', ({ event, payload }) => {\n" +
      '  const { x, y } = payload // payload here is a `PhysicalPosition`\n' +
      '})\n' +
      '```\n' +
      '\n' +
      'Window-specific events emitted by the backend:\n' +
      '\n' +
      "#### 'tauri://resize'\n" +
      'Emitted when the size of the window has changed.\n' +
      '*EventPayload*:\n' +
      '```typescript\n' +
      'type ResizePayload = PhysicalSize\n' +
      '```\n' +
      '\n' +
      "#### 'tauri://move'\n" +
      'Emitted when the position of the window has changed.\n' +
      '*EventPayload*:\n' +
      '```typescript\n' +
      'type MovePayload = PhysicalPosition\n' +
      '```\n' +
      '\n' +
      "#### 'tauri://close-requested'\n" +
      'Emitted when the user requests the window to be closed.\n' +
      "If a listener is registered for this event, Tauri won't close the window so you must call `appWindow.close()` manually.\n" +
      '\n' +
      "#### 'tauri://focus'\n" +
      'Emitted when the window gains focus.\n' +
      '\n' +
      "#### 'tauri://blur'\n" +
      'Emitted when the window loses focus.\n' +
      '\n' +
      "#### 'tauri://scale-change'\n" +
      "Emitted when the window's scale factor has changed.\n" +
      'The following user actions can cause DPI changes:\n' +
      "- Changing the display's resolution.\n" +
      "- Changing the display's scale factor (e.g. in Control Panel on Windows).\n" +
      '- Moving the window to a display with a different scale factor.\n' +
      '*Event payload*:\n' +
      '```typescript\n' +
      'interface ScaleFactorChanged {\n' +
      '  scaleFactor: number\n' +
      '  size: PhysicalSize\n' +
      '}\n' +
      '```\n' +
      '\n' +
      "#### 'tauri://menu'\n" +
      'Emitted when a menu item is clicked.\n' +
      '*EventPayload*:\n' +
      '```typescript\n' +
      'type MenuClicked = string\n' +
      '```\n',
    tags: undefined,
    url: 'https://tauri.studio/docs/api/js/modules/window'
  }
]
