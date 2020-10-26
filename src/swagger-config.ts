
import { readFileSync } from "fs";
import { SwaggerConfig } from "./types";

function getSwaggerConfig() {
    try {
        let configJson = JSON.parse(readFileSync("swagger.config.json").toString());

        if (!configJson) {
            throw "";
        }

        let defaultConfig = {
            "language": "typescript",
            "modelNaming": "snake-upper",
            "modelPropertyNaming": "original",
            "enumPropertyNaming": "original",
            "serviceNaming": "original",
            "tagNaming": "snake-upper",
        }

        const config = Object.assign(defaultConfig, configJson);

        return config;
    } catch (error) {
        try {
            return JSON.parse(readFileSync("./swaggerConfig.json").toString()); // backward compatible for  v1
        } catch {
            throw new Error("Please define swagger.config.json");
        }
    }
}

export const configSwagger: SwaggerConfig = getSwaggerConfig();