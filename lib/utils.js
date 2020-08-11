"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTsType = exports.generateServiceName = exports.getQueryParams = exports.getPathParams = void 0;
function getPathParams(parameters) {
    return ((parameters === null || parameters === void 0 ? void 0 : parameters.filter(({ in: In }) => {
        return In === "path";
    })) || []);
}
exports.getPathParams = getPathParams;
function getQueryParams(parameters) {
    let queryParams = parameters === null || parameters === void 0 ? void 0 : parameters.reduce((prev, { in: In, name, schema }) => {
        if (In !== "query") {
            return prev;
        }
        return `${prev}${name}: ${getTsType(schema)},`;
    }, "{");
    const hasQueryParams = queryParams && queryParams.length > 1;
    queryParams = hasQueryParams ? queryParams + "}" : "";
    return queryParams;
}
exports.getQueryParams = getQueryParams;
function generateServiceName(endPoint) {
    function replaceWithUpper(str, sp) {
        let pointArray = str.split(sp);
        pointArray = pointArray.map((point) => `${point.substring(0, 1).toUpperCase()}${point.substring(1)}`);
        return pointArray.join("");
    }
    let name = replaceWithUpper(replaceWithUpper(replaceWithUpper(endPoint, "/"), "{"), "}");
    return name;
}
exports.generateServiceName = generateServiceName;
const TYPES = {
    integer: "number",
    number: "number",
    boolean: "boolean",
    object: "object",
    string: "string",
};
function getTsType({ type, nullable, $ref, enum: Enum }) {
    let tsType = TYPES[type];
    if (nullable) {
        tsType + "| null";
    }
    if ($ref) {
        tsType = $ref.replace("#/components/schemas/", "");
    }
    if (Enum) {
        tsType = JSON.stringify(Enum);
    }
    return tsType;
}
exports.getTsType = getTsType;
//# sourceMappingURL=utils.js.map