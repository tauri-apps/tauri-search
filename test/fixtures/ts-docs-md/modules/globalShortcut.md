[@tauri-apps/api](../README.md) / [Exports](../modules.md) / globalShortcut

# Namespace: globalShortcut

Register global shortcuts.

This package is also accessible with `window.__TAURI__.globalShortcut` when `tauri.conf.json > build > withGlobalTauri` is set to true.

The APIs must be allowlisted on `tauri.conf.json`:
```json
{
  "tauri": {
    "allowlist": {
      "globalShortcut": {
        "all": true // enable all global shortcut APIs
      }
    }
  }
}
```
It is recommended to allowlist only the APIs you use for optimal bundle size and security.

## Table of contents

### Type aliases

- [ShortcutHandler](globalShortcut.md#shortcuthandler)

### Functions

- [isRegistered](globalShortcut.md#isregistered)
- [register](globalShortcut.md#register)
- [registerAll](globalShortcut.md#registerall)
- [unregister](globalShortcut.md#unregister)
- [unregisterAll](globalShortcut.md#unregisterall)

## Type aliases

### ShortcutHandler

Ƭ **ShortcutHandler**: (`shortcut`: `string`) => `void`

#### Type declaration

▸ (`shortcut`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `shortcut` | `string` |

##### Returns

`void`

#### Defined in

[globalShortcut.ts:29](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/globalShortcut.ts#L29)

## Functions

### isRegistered

▸ **isRegistered**(`shortcut`): `Promise`<`boolean`\>

Determines whether the given shortcut is registered by this application or not.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shortcut` | `string` | Array of shortcut definitions, modifiers and key separated by "+" e.g. CmdOrControl+Q |

#### Returns

`Promise`<`boolean`\>

A promise resolving to the state.

#### Defined in

[globalShortcut.ts:79](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/globalShortcut.ts#L79)

___

### register

▸ **register**(`shortcut`, `handler`): `Promise`<`void`\>

Register a global shortcut.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shortcut` | `string` | Shortcut definition, modifiers and key separated by "+" e.g. CmdOrControl+Q |
| `handler` | [`ShortcutHandler`](globalShortcut.md#shortcuthandler) | Shortcut handler callback - takes the triggered shortcut as argument |

#### Returns

`Promise`<`void`\>

#### Defined in

[globalShortcut.ts:38](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/globalShortcut.ts#L38)

___

### registerAll

▸ **registerAll**(`shortcuts`, `handler`): `Promise`<`void`\>

Register a collection of global shortcuts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shortcuts` | `string`[] | Array of shortcut definitions, modifiers and key separated by "+" e.g. CmdOrControl+Q |
| `handler` | [`ShortcutHandler`](globalShortcut.md#shortcuthandler) | Shortcut handler callback - takes the triggered shortcut as argument |

#### Returns

`Promise`<`void`\>

#### Defined in

[globalShortcut.ts:59](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/globalShortcut.ts#L59)

___

### unregister

▸ **unregister**(`shortcut`): `Promise`<`void`\>

Unregister a global shortcut.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shortcut` | `string` | shortcut definition, modifiers and key separated by "+" e.g. CmdOrControl+Q |

#### Returns

`Promise`<`void`\>

#### Defined in

[globalShortcut.ts:95](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/globalShortcut.ts#L95)

___

### unregisterAll

▸ **unregisterAll**(): `Promise`<`void`\>

Unregisters all shortcuts registered by the application.

#### Returns

`Promise`<`void`\>

#### Defined in

[globalShortcut.ts:110](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/globalShortcut.ts#L110)
