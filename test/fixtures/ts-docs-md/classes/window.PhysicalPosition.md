[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [window](../modules/window.md) / PhysicalPosition

# Class: PhysicalPosition

[window](../modules/window.md).PhysicalPosition

A position represented in physical pixels.

## Table of contents

### Constructors

- [constructor](window.PhysicalPosition.md#constructor)

### Properties

- [type](window.PhysicalPosition.md#type)
- [x](window.PhysicalPosition.md#x)
- [y](window.PhysicalPosition.md#y)

### Methods

- [toLogical](window.PhysicalPosition.md#tological)

## Constructors

### constructor

• **new PhysicalPosition**(`x`, `y`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[window.ts:148](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L148)

## Properties

### type

• **type**: `string` = `'Physical'`

#### Defined in

[window.ts:144](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L144)

___

### x

• **x**: `number`

#### Defined in

[window.ts:145](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L145)

___

### y

• **y**: `number`

#### Defined in

[window.ts:146](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L146)

## Methods

### toLogical

▸ **toLogical**(`scaleFactor`): [`LogicalPosition`](window.LogicalPosition.md)

Converts the physical position to a logical one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scaleFactor` | `number` |

#### Returns

[`LogicalPosition`](window.LogicalPosition.md)

#### Defined in

[window.ts:154](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L154)
