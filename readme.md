[![NPM](https://nodei.co/npm/swagger-typescript.png)](https://nodei.co/npm/swagger-typescript/)

[![install size](https://packagephobia.now.sh/badge?p=swagger-typescript)](https://packagephobia.now.sh/result?p=swagger-typescript) [![dependencies](https://david-dm.org/hosseinmd/swagger-typescript.svg)](https://david-dm.org/hosseinmd/swagger-typescript.svg)

:star::star::star: If you would like to contribute, please refer to [To do list](https://github.com/hosseinmd/swagger-typescript/projects/1) and a list of [open tasks](https://github.com/hosseinmd/swagger-typescript/issues?q=is%3Aopen).:star::star::star:

[Migrate Swagger-Typescript v3 to Swagger-Typescript v4](https://github.com/hosseinmd/swagger-typescript/blob/master/migrateToV4.md)

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

baseConfig

```ts
const baseConfig: AxiosRequestConfig = {
  baseURL: "", // <--- Add your base url
  //other static configs
};
```

Now you can use APIs, So for advanced config read below.

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

This file automatically will be created after first run. You could change this file for customization. Don't change other files, if you want another config create Issue or PR.

#### getAxiosInstance

getAxiosInstance used for create an instance of axios request you can customize that for what you needed

#### baseConfig

baseConfig used for get static configs and headers. if you need some dynamic configs like add authentication to headers use `requestConfig.headers.authorization` into of `axiosInstance.interceptors.request.use` function.

## run by node

```js
const { generate } = require("../lib");

generate(config);
// or
generate(); // will be use ./swagger.config.json
```

## Stories

[why-you-should-use-swagger-typescript-for-generate-apis-code](https://medium.com/@hosseinm.developer/why-you-should-use-swagger-typescript-for-generate-apis-code-63eb8623fef8?source=friends_link&sk=2aa0e2d30b3be158d18c1feb4e12d4a6)
