[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [shell](../modules/shell.md) / ChildProcess

# Interface: ChildProcess

[shell](../modules/shell.md).ChildProcess

## Table of contents

### Properties

- [code](shell.ChildProcess.md#code)
- [signal](shell.ChildProcess.md#signal)
- [stderr](shell.ChildProcess.md#stderr)
- [stdout](shell.ChildProcess.md#stdout)

## Properties

### code

• **code**: ``null`` \| `number`

Exit code of the process. `null` if the process was terminated by a signal on Unix.

#### Defined in

[shell.ts:46](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/shell.ts#L46)

___

### signal

• **signal**: ``null`` \| `number`

If the process was terminated by a signal, represents that signal.

#### Defined in

[shell.ts:48](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/shell.ts#L48)

___

### stderr

• **stderr**: `string`

The data that the process wrote to `stderr`.

#### Defined in

[shell.ts:52](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/shell.ts#L52)

___

### stdout

• **stdout**: `string`

The data that the process wrote to `stdout`.

#### Defined in

[shell.ts:50](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/shell.ts#L50)
