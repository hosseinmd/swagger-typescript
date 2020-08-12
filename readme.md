[![NPM](https://nodei.co/npm/react-principal.png)](https://nodei.co/npm/react-principal/)

[![install size](https://packagephobia.now.sh/badge?p=react-principal)](https://packagephobia.now.sh/result?p=react-principal) [![dependencies](https://david-dm.org/poolkhord/react-principal.svg)](https://david-dm.org/poolkhord/react-principal.svg)



## responseWrapper

for customize responseWrapper your can do something like this

```js
export type SwaggerResponse<R> = R;

async function responseWrapper(
  response: AxiosResponse<any>,
): Promise<SwaggerResponse<any>> {
  return response.data;
}
``