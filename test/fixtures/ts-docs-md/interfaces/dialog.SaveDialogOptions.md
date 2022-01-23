[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [dialog](../modules/dialog.md) / SaveDialogOptions

# Interface: SaveDialogOptions

[dialog](../modules/dialog.md).SaveDialogOptions

Options for the save dialog.

## Table of contents

### Properties

- [defaultPath](dialog.SaveDialogOptions.md#defaultpath)
- [filters](dialog.SaveDialogOptions.md#filters)

## Properties

### defaultPath

• `Optional` **defaultPath**: `string`

Initial directory or file path.
If it's a directory path, the dialog interface will change to that folder.
If it's not an existing directory, the file name will be set to the dialog's file name input and the dialog will be set to the parent folder.

#### Defined in

[dialog.ts:65](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L65)

___

### filters

• `Optional` **filters**: [`DialogFilter`](dialog.DialogFilter.md)[]

The filters of the dialog.

#### Defined in

[dialog.ts:59](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/dialog.ts#L59)
