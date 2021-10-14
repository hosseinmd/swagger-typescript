[![NPM](https://nodei.co/npm/swagger-typescript.png)](https://nodei.co/npm/swagger-typescript/)

[![install size](https://packagephobia.now.sh/badge?p=swagger-typescript)](https://packagephobia.now.sh/result?p=swagger-typescript) [![dependencies](https://david-dm.org/hosseinmd/swagger-typescript.svg)](https://david-dm.org/hosseinmd/swagger-typescript.svg)

:star::star::star: If you would like to contribute, please refer to [To do list](https://github.com/hosseinmd/swagger-typescript/projects/1) and a list of [open tasks](https://github.com/hosseinmd/swagger-typescript/issues?q=is%3Aopen).:star::star::star:

# Swagger-Typescript: Generate ts/js code from swagger/openApi JSON

Support OpenApi v3 and swagger v2

An auto typescript/javascript code generator from swagger.
Each endpoint will be created as a function, full type base.
Supported

- Generating a function for every apis
- Generating all types, interfaces and enums whitch used in apis
- React hooks.
- SignalR hub.
- Generating mock data.

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
  "dir": "./services",
  "prefix": "/api"
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
  "dir": "./services",
  "prettierPath": ".prettierrc",
  "language": "typescript"
}
```

| [`Key`]             | [`default`]      | Comment                                                                                                                                                            |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `url`               | Required         | Address of swagger.json                                                                                                                                            |
| `dir`               | Required         | Address of output                                                                                                                                                  |
| `language`          | `typescript`     | export to "javascript" or "typescript"                                                                                                                             |
| `methodName`        | `{method}{path}` | Supported mixed of "{method}{path}{operationId}". for Example: 'service{method}{path}'                                                                             |
| `prefix`            | Optional         | prefix value will be removed from method name For example your endpoints is like "/api/v2/users", If you don't want add "/api/v2" to method name, add it to prefix |
| `ignore`            | Optional         | Ignore headers from type for Example: `"ignore": { "headerParams": ["terminalId"]}`                                                                                |
| `methodParamsByTag` | false            | add add a tag insteadOf params name to generated method name (example: getUserP1P2 insteadOf getUserConnectionIdAccountId)              |
| `mock`              | false            | For generate response mocks                                                                                                                                        |
| `keepJson`          | false            | This code will keep previous JSON for updating partially. change it to true then generate service for creating your first json file then you can update a tag for example `$ yarn swag-ts User` will update your user APIs which have User tag                                                                                    |
| `reactHooks`        | false            | For generate react hooks of all APIs (using react-query under the hood)                                                                                                                           |
| `useQuery`          | []               | List of apis which is get but developed with post methods (Is useful for rest apis) for Example: ["postTicketsGetall"] (Needed to enable `reactHooks`)             |

## config.ts

This file automatically will be created after first run. You could change this file for customization. Don't change other files, if you want another config create Issue or PR.

#### getAxiosInstance

getAxiosInstance used for create an instance of axios request you can customize that for what you needed

#### baseConfig

baseConfig used for get static configs and headers. if you need some dynamic configs like add authentication to headers use `requestConfig.headers.authorization` into of `axiosInstance.interceptors.request.use` function.

## run by node

```js
const { generate } = require("swagger-typescript");

generate(config);
// or
generate(); // will be use ./swagger.config.json
```

## Stories

[why-you-should-use-swagger-typescript-for-generate-apis-code](https://medium.com/@hosseinm.developer/why-you-should-use-swagger-typescript-for-generate-apis-code-63eb8623fef8?source=friends_link&sk=2aa0e2d30b3be158d18c1feb4e12d4a6)
