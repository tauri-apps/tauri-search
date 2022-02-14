[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [dialog](../modules/dialog.md) / DialogFilter

# Interface: DialogFilter

[dialog](../modules/dialog.md).DialogFilter

Extension filters for the file dialog.

## Table of contents

### Properties

- [extensions](dialog.DialogFilter.md#extensions)
- [name](dialog.DialogFilter.md#name)

## Properties

### extensions

• **extensions**: `string`[]

Extensions to filter, without a `.` prefix.

**`example`**
```typescript
extensions: ['svg', 'png']
```

#### Defined in

[dialog.ts:41](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L41)

___

### name

• **name**: `string`

Filter name.

#### Defined in

[dialog.ts:33](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L33)
