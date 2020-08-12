"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefName = exports.getTsType = exports.generateServiceName = exports.getQueryParams = exports.getPathParams = void 0;
function getPathParams(parameters) {
    return ((parameters === null || parameters === void 0 ? void 0 : parameters.filter(({ in: In }) => {
        return In === "path";
    })) || []);
}
exports.getPathParams = getPathParams;
function getQueryParams(parameters) {
    const queryParamsArray = (parameters === null || parameters === void 0 ? void 0 : parameters.filter(({ in: In }) => {
        return In === "query";
    })) || [];
    let queryParams = queryParamsArray.reduce((prev, { name, schema }) => {
        return `${prev}${name}${schema.nullable ? "?" : ""}: ${getTsType(schema)},`;
    }, "{");
    const hasQueryParams = queryParams && queryParams.length > 1;
    queryParams = hasQueryParams ? queryParams + "}" : "";
    return {
        queryParams,
        hasNullable: queryParamsArray.find(({ schema }) => schema.nullable),
    };
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
    array: "array",
};
function getTsType({ type, $ref, enum: Enum, items, properties, }) {
    let tsType = TYPES[type];
    if ($ref) {
        tsType = getRefName($ref);
    }
    if (Enum) {
        tsType = JSON.stringify(Enum);
    }
    if (items) {
        tsType = `${getTsType(items)}[]`;
    }
    if (properties) {
        tsType = Object.entries(properties)
            .map(([pName, value]) => (Object.assign(Object.assign({}, value), { name: pName })))
            .reduce((prev, schema) => {
            return `${prev}${schema.name}${schema.nullable ? "?" : ""}: ${getTsType(schema)},`;
        }, "{");
        tsType = tsType ? tsType + "}" : "";
    }
    // if (nullable) {
    //   tsType + "| null";
    // }
    return tsType;
}
exports.getTsType = getTsType;
function getRefName($ref) {
    return $ref.replace("#/components/schemas/", "");
}
exports.getRefName = getRefName;
//# sourceMappingURL=utils.js.map