[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [window](../modules/window.md) / Monitor

# Interface: Monitor

[window](../modules/window.md).Monitor

Allows you to retrieve information about a given monitor.

## Table of contents

### Properties

- [name](window.Monitor.md#name)
- [position](window.Monitor.md#position)
- [scaleFactor](window.Monitor.md#scalefactor)
- [size](window.Monitor.md#size)

## Properties

### name

• **name**: ``null`` \| `string`

Human-readable name of the monitor

#### Defined in

[window.ts:92](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L92)

___

### position

• **position**: [`PhysicalPosition`](../classes/window.PhysicalPosition.md)

the Top-left corner position of the monitor relative to the larger full screen area.

#### Defined in

[window.ts:96](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L96)

___

### scaleFactor

• **scaleFactor**: `number`

The scale factor that can be used to map physical pixels to logical pixels.

#### Defined in

[window.ts:98](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L98)

___

### size

• **size**: [`PhysicalSize`](../classes/window.PhysicalSize.md)

The monitor's resolution.

#### Defined in

[window.ts:94](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/window.ts#L94)
