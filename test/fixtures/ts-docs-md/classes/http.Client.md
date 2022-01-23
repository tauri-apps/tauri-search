[@tauri-apps/api](../README.md) / [Exports](../modules.md) / [http](../modules/http.md) / Client

# Class: Client

[http](../modules/http.md).Client

## Table of contents

### Properties

- [id](http.Client.md#id)

### Methods

- [delete](http.Client.md#delete)
- [drop](http.Client.md#drop)
- [get](http.Client.md#get)
- [patch](http.Client.md#patch)
- [post](http.Client.md#post)
- [put](http.Client.md#put)
- [request](http.Client.md#request)

## Properties

### id

• **id**: `number`

#### Defined in

[http.ts:158](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L158)

## Methods

### delete

▸ **delete**<`T`\>(`url`, `options?`): `Promise`<[`Response`](http.Response.md)<`T`\>\>

Makes a DELETE request.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The request URL. |
| `options?` | [`RequestOptions`](../modules/http.md#requestoptions) | The request options. |

#### Returns

`Promise`<[`Response`](http.Response.md)<`T`\>\>

A promise resolving to the response.

#### Defined in

[http.ts:302](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L302)

___

### drop

▸ **drop**(): `Promise`<`void`\>

Drops the client instance.

#### Returns

`Promise`<`void`\>

#### Defined in

[http.ts:169](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L169)

___

### get

▸ **get**<`T`\>(`url`, `options?`): `Promise`<[`Response`](http.Response.md)<`T`\>\>

Makes a GET request.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The request URL. |
| `options?` | [`RequestOptions`](../modules/http.md#requestoptions) | The request options. |

#### Returns

`Promise`<[`Response`](http.Response.md)<`T`\>\>

A promise resolving to the response.

#### Defined in

[http.ts:230](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L230)

___

### patch

▸ **patch**<`T`\>(`url`, `options?`): `Promise`<[`Response`](http.Response.md)<`T`\>\>

Makes a PATCH request.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The request URL. |
| `options?` | [`RequestOptions`](../modules/http.md#requestoptions) | The request options. |

#### Returns

`Promise`<[`Response`](http.Response.md)<`T`\>\>

A promise resolving to the response.

#### Defined in

[http.ts:287](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L287)

___

### post

▸ **post**<`T`\>(`url`, `body?`, `options?`): `Promise`<[`Response`](http.Response.md)<`T`\>\>

Makes a POST request.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The request URL. |
| `body?` | [`Body`](http.Body.md) | The body of the request. |
| `options?` | [`RequestOptions`](../modules/http.md#requestoptions) | The request options. |

#### Returns

`Promise`<[`Response`](http.Response.md)<`T`\>\>

A promise resolving to the response.

#### Defined in

[http.ts:246](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L246)

___

### put

▸ **put**<`T`\>(`url`, `body?`, `options?`): `Promise`<[`Response`](http.Response.md)<`T`\>\>

Makes a PUT request.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The request URL. |
| `body?` | [`Body`](http.Body.md) | The body of the request. |
| `options?` | [`RequestOptions`](../modules/http.md#requestoptions) | Request options. |

#### Returns

`Promise`<[`Response`](http.Response.md)<`T`\>\>

A promise resolving to the response.

#### Defined in

[http.ts:267](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L267)

___

### request

▸ **request**<`T`\>(`options`): `Promise`<[`Response`](http.Response.md)<`T`\>\>

Makes an HTTP request.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`HttpOptions`](../interfaces/http.HttpOptions.md) | The request options. |

#### Returns

`Promise`<[`Response`](http.Response.md)<`T`\>\>

A promise resolving to the response.

#### Defined in

[http.ts:185](https://github.com/ksnyde/tauri/blob/3a04c036/tooling/api/src/http.ts#L185)
