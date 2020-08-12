"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwaggerJson = void 0;
const axios_1 = __importDefault(require("axios"));
async function getSwaggerJson(url) {
    const { data } = await axios_1.default.get(url);
    // fs.writeFileSync("swagger.json", JSON.stringify(data));
    return data;
}
exports.getSwaggerJson = getSwaggerJson;
//# sourceMappingURL=getJson.js.map