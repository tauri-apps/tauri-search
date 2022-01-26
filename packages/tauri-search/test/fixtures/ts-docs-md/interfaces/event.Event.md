[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [event](../modules/event.md) / Event

# Interface: Event<T\>

[event](../modules/event.md).Event

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [event](event.Event.md#event)
- [id](event.Event.md#id)
- [payload](event.Event.md#payload)

## Properties

### event

• **event**: `string`

Event name

#### Defined in

[event.ts:19](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/event.ts#L19)

___

### id

• **id**: `number`

Event identifier used to unlisten

#### Defined in

[event.ts:21](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/event.ts#L21)

___

### payload

• **payload**: `T`

Event payload

#### Defined in

[event.ts:23](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/event.ts#L23)
