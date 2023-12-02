[![NPM](https://nodei.co/npm/swagger-typescript.png)](https://nodei.co/npm/swagger-typescript/)

[![install size](https://packagephobia.now.sh/badge?p=swagger-typescript)](https://packagephobia.now.sh/result?p=swagger-typescript) [![dependencies](https://david-dm.org/hosseinmd/swagger-typescript.svg)](https://david-dm.org/hosseinmd/swagger-typescript.svg)

:star::star::star: If you would like to contribute, please refer to [To do list](https://github.com/hosseinmd/swagger-typescript/projects/1) and a list of [open tasks](https://github.com/hosseinmd/swagger-typescript/issues?q=is%3Aopen).:star::star::star:

# Swagger-Typescript: Generate ts/js code from swagger/openApi JSON

Support OpenApi v3, swagger v2 and postman collection

An auto typescript/javascript/kotlin code generator from APIs doc.
Each endpoint will be created as a function, full type base.
Supported

- Generating a function for every apis
- Generating all types, interfaces and enums which used in apis
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

`$ yarn add swagger-typescript prettier -D && yarn add axios`

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

[more](#config)

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
  "$schema": "https://raw.githubusercontent.com/hosseinmd/swagger-typescript/master/schema/v6.json",
  "url": "http://example.com/api/swagger.json",
  "dir": "./services",
  "prettierPath": ".prettierrc",
  "language": "typescript"
}
```

| [`Key`]              | [`default`]            | Comment                                                                                                                                                                                                                                        |
| -------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`                | Required               | swagger or postman collection Address. can be online or local (json/yaml) ([specific branch](#specific-branch))                                                                                                                                |
| `dir`                | Required               | Address of output                                                                                                                                                                                                                              |
| `language`           | `typescript`           | export to "javascript", "typescript" or "kotlin"                                                                                                                                                                                               |
| `methodName`         | `{method}{path}`       | Supported mixed of "{method}{path}{operationId}". for Example: 'service{method}{path}'                                                                                                                                                         |
| `prefix`             | Optional               | prefix value will be removed from method name For example your endpoints is like "/api/v2/users", If you don't want add "/api/v2" to method name, add it to prefix                                                                             |
| `ignore`             | Optional               | Ignore headers from type for Example: `"ignore": { "headerParams": ["terminalId"]}`                                                                                                                                                            |
| `mock`               | false                  | For generate response mocks                                                                                                                                                                                                                    |
| `keepJson`           | false                  | This code will keep previous JSON for updating partially. change it to true then generate service for creating your first json file then you can update a tag for example `$ yarn swag-ts User` will update your user APIs which have User tag |
| `reactHooks`         | false                  | For generate react hooks of all APIs (using react-query under the hood)                                                                                                                                                                        |
| `useQuery`           | []                     | List of apis which is get but developed with post methods (Is useful for rest apis) for Example: ["postTicketsGetall"] (Needed to enable `reactHooks`)                                                                                         |
| `useInfiniteQuery`   | []                     | List of apis which is get and could be handle infinity (Needed to enable `reactHooks`) parameter should be one of `page`, `pageNo` or `pageNumber`                                                                                             |
| `local`              | false                  | update swagger with local swagger.json located in your dir folder. add it to your config file or run it with cli `$ yarn swag-ts --local`                                                                                                      |
| `kotlinPackage`      | Required (Only kotlin) | package name of source dir                                                                                                                                                                                                                     |
| `generateEnumAsType` | false                  |

- `enum ReferralStatus {Successed="Successed","Error"="Error"} `
- `type ReferralStatus="Successed" | "Error"; // generateEnumAsType = true `
  |

## Config

The config.ts file automatically will be created after first run. You could change this file for customization. Don't change other files, if you want another config create Issue or PR.

- getAxiosInstance

  getAxiosInstance used for create an instance of axios request you can customize that for what you needed

- baseConfig

  baseConfig used for get static configs and headers. if you need some dynamic configs like add authentication to headers use `requestConfig.headers.authorization` into of `axiosInstance.interceptors.request.use` function.

## Run by node

```js
const { generate } = require("swagger-typescript");

generate(config);
// or
generate(); // will be use ./swagger.config.json
```

## Conflict

In some situation teams have parallel backend development which cause conflict when updating swagger for solving this we have partially update, you can update your service just for a few tags and keep other old services codes.

For Doing this you need to add this to your swagger.config.json

```
"keepJson": true,
```

This code will keep previous JSON for updating partially.

Run `$ yarn swag-ts` with your base backend, for example develop branch

Others need to pull this changes

Now you can update Tag1 and Tag2 `$ yarn swag-ts Tag1 Tag2`.

## Multiple Gateway

if you have multiple gateway in your project you could handle it by add array of config in swagger.config.json

```json
[
  {
    "$schema": "https://raw.githubusercontent.com/hosseinmd/swagger-typescript/master/schema/v6.json",
    "url": "http://example1.com/api/swagger.json",
    "dir": "./service1",
    "prettierPath": ".prettierrc",
    "language": "typescript"
  },
  {
    "$schema": "https://raw.githubusercontent.com/hosseinmd/swagger-typescript/master/schema/v6.json",
    "url": "http://example2.com/api/swagger.json",
    "dir": "./service2",
    "prettierPath": ".prettierrc",
    "language": "typescript"
  }
]
```

## Specific branch

if you are managing project by multiple branch like gitflow, you need to update swagger based on you working branch or parent branch (for example your parent is develop if you create a branch from develop).

For Example:

```json
{
  "url": [
    {
      "branch": "master",
      "url": "http:/example.com/api/swagger.json"
    },
    {
      "branch": "develop",
      "url": "http://stage.example.com/api/swagger.json"
    }
  ]
}
```

to generate swagger for develop run `yarn swag-ts --branch=develop` or your branch name should be `develop` or `develop/something`

## Stories

[why-you-should-use-swagger-typescript-for-generate-apis-code](https://medium.com/@hosseinm.developer/why-you-should-use-swagger-typescript-for-generate-apis-code-63eb8623fef8?source=friends_link&sk=2aa0e2d30b3be158d18c1feb4e12d4a6)
