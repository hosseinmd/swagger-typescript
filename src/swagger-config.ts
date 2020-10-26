
import { readFileSync } from "fs";
import { SwaggerConfig } from "./types";

function getSwaggerConfig() {
    try {
        const config = JSON.parse(readFileSync("swagger.config.json").toString());

        if (!config) {
            throw "";
        }

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