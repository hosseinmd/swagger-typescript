"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = exports.getOverride = exports.errorCatch = exports.getBaseConfig = void 0;
function getBaseConfig() {
    return {
        baseURL: "",
        headers: {
            "Content-Encoding": "UTF-8",
            Accept: "application/json",
            "Content-Type": "application/json-patch+json",
        },
    };
}
exports.getBaseConfig = getBaseConfig;
function getOverride() {
    return {
        headers: {
            Authentication: "",
        },
    };
}
exports.getOverride = getOverride;
function errorCatch(error) {
    if (error.response) {
        throw new Exception({
            message: error.response.data,
            status: error.response.status,
            response: error.response,
        });
    }
    if (error.isAxiosError) {
        throw new Exception({
            message: "noInternetConnection",
        });
    }
    throw error;
}
exports.errorCatch = errorCatch;
class Exception extends Error {
    constructor({ message, status, response }) {
        super();
        this.isApiException = true;
        this.message = message;
        this.status = status;
        this.response = response;
    }
}
exports.Exception = Exception;
//# sourceMappingURL=config.js.map