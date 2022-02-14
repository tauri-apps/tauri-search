[@tauri-apps/api](../README.md) / [Exports](../modules.md) / dialog

# Namespace: dialog

Native system dialogs for opening and saving files.

This package is also accessible with `window.__TAURI__.dialog` when `tauri.conf.json > build > withGlobalTauri` is set to true.

The APIs must be allowlisted on `tauri.conf.json`:
```json
{
  "tauri": {
    "allowlist": {
      "dialog": {
        "all": true, // enable all dialog APIs
        "open": true, // enable file open API
        "save": true // enable file save API
      }
    }
  }
}
```
It is recommended to allowlist only the APIs you use for optimal bundle size and security.

## Table of contents

### Interfaces

- [DialogFilter](../interfaces/dialog.DialogFilter.md)
- [OpenDialogOptions](../interfaces/dialog.OpenDialogOptions.md)
- [SaveDialogOptions](../interfaces/dialog.SaveDialogOptions.md)

### Functions

- [ask](dialog.md#ask)
- [confirm](dialog.md#confirm)
- [message](dialog.md#message)
- [open](dialog.md#open)
- [save](dialog.md#save)

## Functions

### ask

▸ **ask**(`message`, `title?`): `Promise`<`boolean`\>

Shows a question dialog with `Yes` and `No` buttons.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The message to show. |
| `title?` | `string` | The dialog's title. Defaults to the application name. |

#### Returns

`Promise`<`boolean`\>

A promise resolving to a boolean indicating whether `Yes` was clicked or not.

#### Defined in

[dialog.ts:133](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L133)

___

### confirm

▸ **confirm**(`message`, `title?`): `Promise`<`boolean`\>

Shows a question dialog with `Ok` and `Cancel` buttons.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The message to show. |
| `title?` | `string` | The dialog's title. Defaults to the application name. |

#### Returns

`Promise`<`boolean`\>

A promise resolving to a boolean indicating whether `Ok` was clicked or not.

#### Defined in

[dialog.ts:152](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L152)

___

### message

▸ **message**(`message`): `Promise`<`void`\>

Shows a message dialog with an `Ok` button.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The message to show. |

#### Returns

`Promise`<`void`\>

A promise indicating the success or failure of the operation.

#### Defined in

[dialog.ts:115](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L115)

___

### open

▸ **open**(`options?`): `Promise`<`string` \| `string`[]\>

Open a file/directory selection dialog

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`OpenDialogOptions`](../interfaces/dialog.OpenDialogOptions.md) |

#### Returns

`Promise`<`string` \| `string`[]\>

A promise resolving to the selected path(s)

#### Defined in

[dialog.ts:73](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L73)

___

### save

▸ **save**(`options?`): `Promise`<`string`\>

Open a file/directory save dialog.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`SaveDialogOptions`](../interfaces/dialog.SaveDialogOptions.md) |

#### Returns

`Promise`<`string`\>

A promise resolving to the selected path.

#### Defined in

[dialog.ts:94](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L94)
