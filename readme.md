[![NPM](https://nodei.co/npm/swagger-typescript.png)](https://nodei.co/npm/swagger-typescript/)

[![install size](https://packagephobia.now.sh/badge?p=swagger-typescript)](https://packagephobia.now.sh/result?p=swagger-typescript) [![dependencies](https://david-dm.org/hosseinmd/swagger-typescript.svg)](https://david-dm.org/hosseinmd/swagger-typescript.svg)

An auto typescript code generator from swagger.
Every endpoint create as function and full type base.
For Example:
Get method of '/Account' path will be this code in services.ts

```js
export const getAccountList = async (
  queryParams: { id: string },
  configOverride?: AxiosRequestConfig,
): Promise<SwaggerResponse<CommissionAmountApiModel>> => {
  // internal code
  return response
};
```

## install

`$ yarn add swagger-typescript`

Before running, add your config to swagger.config.json

## swagger.config.json

```json
{
    "url": "http://example.swagger.json",
    "dir": "./test",
    "prettierPath": ".prettierrc",
    "ignore": {
        "headerParams": [
            "terminalId"
        ]
    }
}
```

## run 

```
node ./node_modules/swagger-typescript/lib/index.js'
```

## config.ts

This file automatically will be create after first run. You could change this file for customization. Don't change other files, if you want another config create Issue or PR.

### responseWrapper

for customize responseWrapper your can do something like this

```js
export type SwaggerResponse<R> = R;

async function responseWrapper(
  response: AxiosResponse<any>,
): Promise<SwaggerResponse<any>> {
  return response.data;
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
