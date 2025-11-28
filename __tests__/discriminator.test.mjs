import { generator } from "../lib/javascript/generator.mjs";

describe("discriminator support", () => {
  it("should handle discriminator with propertyName and mapping", () => {
    const swagger = {
      openapi: "3.0.0",
      info: {
        title: "Test API",
        version: "1.0.0",
      },
      paths: {},
      components: {
        schemas: {
          HotShearBaseDto: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              hotShearType: {
                enum: ["CRANK", "ROTARY", "COMBI"],
                type: "string",
              },
            },
            additionalProperties: false,
          },
          HotShearDto: {
            required: ["hotShearType"],
            type: "object",
            properties: {
              hotShearType: {
                type: "string",
              },
              id: {
                type: "string",
                format: "uuid",
              },
              name: {
                type: "string",
                nullable: true,
              },
            },
            additionalProperties: false,
            discriminator: {
              propertyName: "hotShearType",
              mapping: {
                CRANK: "#/components/schemas/HotShearCRANKDto",
                ROTARY: "#/components/schemas/HotShearROTARYDto",
                COMBI: "#/components/schemas/HotShearCOMBIDto",
              },
            },
          },
          HotShearCRANKDto: {
            type: "object",
            allOf: [
              {
                $ref: "#/components/schemas/HotShearDto",
              },
            ],
            properties: {
              crankRadius: {
                type: "number",
                format: "double",
                nullable: true,
              },
            },
            additionalProperties: false,
          },
          HotShearROTARYDto: {
            type: "object",
            allOf: [
              {
                $ref: "#/components/schemas/HotShearDto",
              },
            ],
            properties: {
              bladesRadius: {
                type: "number",
                format: "double",
                nullable: true,
              },
            },
            additionalProperties: false,
          },
          HotShearCOMBIDto: {
            type: "object",
            allOf: [
              {
                $ref: "#/components/schemas/HotShearDto",
              },
            ],
            properties: {
              crankRadius: {
                type: "number",
                format: "double",
                nullable: true,
              },
              bladesRadius: {
                type: "number",
                format: "double",
                nullable: true,
              },
            },
            additionalProperties: false,
          },
        },
      },
    };

    const { type } = generator(swagger, {});

    // Test that the base discriminator type has the union type and is required
    expect(type).toContain("export interface HotShearDto");

    // Extract just the HotShearDto interface to check its properties
    const hotShearDtoMatch = type.match(
      /export interface HotShearDto \{[^}]+\}/s,
    );
    expect(hotShearDtoMatch).toBeTruthy();
    const hotShearDtoCode = hotShearDtoMatch[0];

    // Check that discriminator property has union type
    expect(hotShearDtoCode).toMatch(
      /"hotShearType":\s*"CRANK"\s*\|\s*"ROTARY"\s*\|\s*"COMBI"/,
    );

    // Test that discriminator property is required (no question mark) in HotShearDto
    expect(hotShearDtoCode).not.toMatch(/"hotShearType"\?:/);

    // Test that child types have specific discriminator literals
    expect(type).toMatch(/HotShearCRANKDto.*hotShearType:\s*'CRANK'/s);
    expect(type).toMatch(/HotShearROTARYDto.*hotShearType:\s*'ROTARY'/s);
    expect(type).toMatch(/HotShearCOMBIDto.*hotShearType:\s*'COMBI'/s);
  });

  it("should handle discriminator property when not explicitly in required array", () => {
    const swagger = {
      openapi: "3.0.0",
      info: {
        title: "Test API",
        version: "1.0.0",
      },
      paths: {},
      components: {
        schemas: {
          Animal: {
            type: "object",
            properties: {
              animalType: {
                type: "string",
              },
              name: {
                type: "string",
              },
            },
            discriminator: {
              propertyName: "animalType",
              mapping: {
                dog: "#/components/schemas/Dog",
                cat: "#/components/schemas/Cat",
              },
            },
          },
          Dog: {
            allOf: [
              {
                $ref: "#/components/schemas/Animal",
              },
            ],
            properties: {
              breed: {
                type: "string",
              },
            },
          },
          Cat: {
            allOf: [
              {
                $ref: "#/components/schemas/Animal",
              },
            ],
            properties: {
              color: {
                type: "string",
              },
            },
          },
        },
      },
    };

    const { type } = generator(swagger, {});

    // Test that discriminator property uses union type from mapping
    expect(type).toContain("export interface Animal");
    expect(type).toMatch(/"animalType":\s*"dog"\s*\|\s*"cat"/);

    // Test that discriminator property is required (no question mark)
    expect(type).not.toMatch(/"animalType"\?:/);

    // Test that child types have specific discriminator literals
    expect(type).toMatch(/Dog.*animalType:\s*'dog'/s);
    expect(type).toMatch(/Cat.*animalType:\s*'cat'/s);
  });
});
