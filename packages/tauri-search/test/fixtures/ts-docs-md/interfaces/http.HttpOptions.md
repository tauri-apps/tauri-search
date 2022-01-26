[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [http](../modules/http.md) / HttpOptions

# Interface: HttpOptions

[http](../modules/http.md).HttpOptions

Options object sent to the backend.

## Table of contents

### Properties

- [body](http.HttpOptions.md#body)
- [headers](http.HttpOptions.md#headers)
- [method](http.HttpOptions.md#method)
- [query](http.HttpOptions.md#query)
- [responseType](http.HttpOptions.md#responsetype)
- [timeout](http.HttpOptions.md#timeout)
- [url](http.HttpOptions.md#url)

## Properties

### body

• `Optional` **body**: [`Body`](../classes/http.Body.md)

#### Defined in

[http.ts:116](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L116)

___

### headers

• `Optional` **headers**: `Record`<`string`, `any`\>

#### Defined in

[http.ts:114](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L114)

___

### method

• **method**: [`HttpVerb`](../modules/http.md#httpverb)

#### Defined in

[http.ts:112](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L112)

___

### query

• `Optional` **query**: `Record`<`string`, `any`\>

#### Defined in

[http.ts:115](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L115)

___

### responseType

• `Optional` **responseType**: [`ResponseType`](../enums/http.ResponseType.md)

#### Defined in

[http.ts:118](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L118)

___

### timeout

• `Optional` **timeout**: `number`

#### Defined in

[http.ts:117](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L117)

___

### url

• **url**: `string`

#### Defined in

[http.ts:113](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L113)
