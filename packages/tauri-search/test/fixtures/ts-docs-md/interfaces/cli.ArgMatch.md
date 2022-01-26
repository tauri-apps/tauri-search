[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [cli](../modules/cli.md) / ArgMatch

# Interface: ArgMatch

[cli](../modules/cli.md).ArgMatch

## Table of contents

### Properties

- [occurrences](cli.ArgMatch.md#occurrences)
- [value](cli.ArgMatch.md#value)

## Properties

### occurrences

• **occurrences**: `number`

Number of occurrences

#### Defined in

[cli.ts:24](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/cli.ts#L24)

___

### value

• **value**: ``null`` \| `string` \| `boolean` \| `string`[]

string if takes value
boolean if flag
string[] or null if takes multiple values

#### Defined in

[cli.ts:20](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/cli.ts#L20)
