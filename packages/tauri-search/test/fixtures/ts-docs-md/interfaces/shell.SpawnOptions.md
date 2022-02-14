[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [shell](../modules/shell.md) / SpawnOptions

# Interface: SpawnOptions

[shell](../modules/shell.md).SpawnOptions

## Table of contents

### Properties

- [cwd](shell.SpawnOptions.md#cwd)
- [env](shell.SpawnOptions.md#env)

## Properties

### cwd

• `Optional` **cwd**: `string`

Current working directory.

#### Defined in

[shell.ts:34](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/shell.ts#L34)

___

### env

• `Optional` **env**: `Object`

Environment variables. set to `null` to clear the process env.

#### Index signature

▪ [name: `string`]: `string`

#### Defined in

[shell.ts:36](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/shell.ts#L36)
