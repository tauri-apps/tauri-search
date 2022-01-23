[@tauri-apps/api](../README.md) / [Exports](../modules.md) / app

# Namespace: app

Get application metadata.

This package is also accessible with `window.__TAURI__.app` when `tauri.conf.json > build > withGlobalTauri` is set to true.

## Table of contents

### Functions

- [getName](app.md#getname)
- [getTauriVersion](app.md#gettauriversion)
- [getVersion](app.md#getversion)

## Functions

### getName

▸ **getName**(): `Promise`<`string`\>

Gets the application name.

#### Returns

`Promise`<`string`\>

A promise resolving to application name.

#### Defined in

[app.ts:33](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/app.ts#L33)

___

### getTauriVersion

▸ **getTauriVersion**(): `Promise`<`string`\>

Gets the tauri version.

#### Returns

`Promise`<`string`\>

A promise resolving to tauri version.

#### Defined in

[app.ts:47](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/app.ts#L47)

___

### getVersion

▸ **getVersion**(): `Promise`<`string`\>

Gets the application version.

#### Returns

`Promise`<`string`\>

A promise resolving to the application version.

#### Defined in

[app.ts:19](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/app.ts#L19)
