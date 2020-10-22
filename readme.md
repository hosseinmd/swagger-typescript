[![NPM](https://nodei.co/npm/swagger-typescript.png)](https://nodei.co/npm/swagger-typescript/)

[![install size](https://packagephobia.now.sh/badge?p=swagger-typescript)](https://packagephobia.now.sh/result?p=swagger-typescript) [![dependencies](https://david-dm.org/hosseinmd/swagger-typescript.svg)](https://david-dm.org/hosseinmd/swagger-typescript.svg)

Support OpenApi v3

An auto typescript/javascript code generator from swagger.
Each endpoint will be constructed as a function, full type base.

For Example:
Get method of '/Account' path will be this code in services.ts

```js
import { getAccount } from "./services";

const response = await getAccount({ id: 1234 });
```

## install

`$ yarn add swagger-typescript`

## get start

Before running, add your config to swagger.config.json

#### swagger.config.json

```json
{
  "url": "http://example.com/api/swagger.json",
  "dir": "./test"
}
```

#### run

```
yarn swag-ts
```

#### config.ts

This file automatically will be create after first run. You could change this file for customization. Don't change other files, if you want another config create Issue or PR.

getBaseConfig

```ts
async function getBaseConfig(): Promise<AxiosRequestConfig> {
  return {
    baseURL: "http://your_base_url.com",
    headers: {
      Authorization: `Bearer ${token}`, // <---- authorization
    },
  };
}
```

## swagger.config.json

For Example:

```json
{
  "url": "http://example.com/api/swagger.json",
  "dir": "./test",
  "prettierPath": ".prettierrc",
  "language": "typescript",
  "ignore": {
    "headerParams": ["terminalId"]
  }
}
```

| [`Key`]      | [`default`]      | Comment                                                                                |
| ------------ | ---------------- | -------------------------------------------------------------------------------------- |
| `url`        | Required         | Address of swagger.json                                                                |
| `dir`        | Required         | Address of output                                                                      |
| `language`   | `typescript`     | export to "javascript" or "typescript"                                                 |
| `methodName` | `{method}{path}` | Supported mixed of "{method}{path}{operationId}". for Example: 'service{method}{path}' |
| `ignore`     | Optional         | Ignore headers from type for Example: `"ignore": { "headerParams": ["terminalId"]} `   |

## config.ts

This file automatically will be create after first run. You could change this file for customization. Don't change other files, if you want another config create Issue or PR.

### responseWrapper

For create custom response change responseWrapper function in config. You could do something like this.

```js
export type SwaggerResponse<R> = R & { counter: number };

const counter = 0;

async function responseWrapper(
  response: AxiosResponse<any>,
): Promise<SwaggerResponse<any>> {
  return { ...response.data, counter: counter + 1 };
}
```

### getBaseConfig

```ts
async function getBaseConfig(): Promise<AxiosRequestConfig> {
  return {
    baseURL: "http://your_base_url.com",
    headers: {
      // any headers you want to assign for all request
      "Content-Encoding": "UTF-8",
      Accept: "application/json",
      "Content-Type": "application/json-patch+json",
    },
  };
}
```

### errorCatch

```ts
function errorCatch(error: AxiosError): any {
  // any things you want
  throw error;
}
```

## Stories

[why-you-should-use-swagger-typescript-for-generate-apis-code](https://medium.com/@hosseinm.developer/why-you-should-use-swagger-typescript-for-generate-apis-code-63eb8623fef8?source=friends_link&sk=2aa0e2d30b3be158d18c1feb4e12d4a6)
