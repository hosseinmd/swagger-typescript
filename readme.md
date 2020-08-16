[![NPM](https://nodei.co/npm/swagger-typescript.png)](https://nodei.co/npm/swagger-typescript/)

[![install size](https://packagephobia.now.sh/badge?p=swagger-typescript)](https://packagephobia.now.sh/result?p=swagger-typescript) [![dependencies](https://david-dm.org/hosseinmd/swagger-typescript.svg)](https://david-dm.org/hosseinmd/swagger-typescript.svg)

## install

`$ yarn add swagger-typescript`

## run 

```
node ./node_modules/swagger-typescript/lib/index.js' config='./swaggerConfigFileName.json'
```
config default is swaggerConfig.json

## swaggerConfig 

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

## config.ts
You could change this file for customization. Don't change other files, if you want another config create Issue or PR.

### responseWrapper

for customize responseWrapper your can do something like this

```js
export type SwaggerResponse<R> = R;

async function responseWrapper(
  response: AxiosResponse<any>,
): Promise<SwaggerResponse<any>> {
  return response.data;
}
``