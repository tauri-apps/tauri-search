[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [fs](../modules/fs.md) / FileEntry

# Interface: FileEntry

[fs](../modules/fs.md).FileEntry

## Table of contents

### Properties

- [children](fs.FileEntry.md#children)
- [name](fs.FileEntry.md#name)
- [path](fs.FileEntry.md#path)

## Properties

### children

• `Optional` **children**: [`FileEntry`](fs.FileEntry.md)[]

Children of this entry if it's a directory; null otherwise

#### Defined in

[fs.ts:88](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/fs.ts#L88)

___

### name

• `Optional` **name**: `string`

Name of the directory/file
can be null if the path terminates with `..`

#### Defined in

[fs.ts:86](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/fs.ts#L86)

___

### path

• **path**: `string`

#### Defined in

[fs.ts:81](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/fs.ts#L81)
