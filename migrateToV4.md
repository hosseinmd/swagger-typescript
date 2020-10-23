## V4

### Break points

V4 is now available, migrate to v4 you should remove config.ts file and run swag-ts again.

On V4 we used axios interceptor, so that is easy to config.

V3 `getBaseConfig` function replaced with `baseConfig` variable.
V3 `errorCatch` moved to interceptor `response.use`
V3 `Exception` renamed to `RequestError`
