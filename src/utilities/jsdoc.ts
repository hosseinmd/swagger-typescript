import { JsdocAST, AssignToDescriptionObj } from "../types";

function assignToDescription({
  description,
  title,
  format,
  maxLength,
  minLength,
  max,
  min,
  minimum,
  maximum,
  pattern,
}: AssignToDescriptionObj) {
  return `${
    title
      ? `
 * ${title}
 * `
      : ""
  }${
    description
      ? `
 * ${description}`
      : ""
  }${
    format
      ? `
 * - Format: ${format}`
      : ""
  }${
    maxLength
      ? `
 * - maxLength: ${maxLength}`
      : ""
  }${
    minLength
      ? `
 * - minLength: ${minLength}`
      : ""
  }${
    min
      ? `
 * - min: ${min}`
      : ""
  }${
    max
      ? `
 * - max: ${max}`
      : ""
  }${
    minimum
      ? `
 * - minimum: ${minimum}`
      : ""
  }${
    maximum
      ? `
 * - max: ${maximum}`
      : ""
  }${
    pattern
      ? `
 * - pattern: ${pattern}`
      : ""
  }`;
}

function getJsdoc({
  description,
  tags: { deprecated, example } = {},
}: JsdocAST) {
  description =
    typeof description === "object"
      ? assignToDescription(description)
      : description;

  return deprecated?.value || description || example
    ? `
/**${
        description
          ? `
 * ${normalizeDescription(description)}`
          : ""
      }${
        deprecated?.value
          ? `
 * @deprecated ${normalizeDescription(deprecated.description) || ""}`
          : ""
      }${
        example
          ? `
 * @example 
 *   ${example}`
          : ""
      }
 */
`
    : "";
}

function normalizeDescription(str?: string) {
  return str?.replace(/\*\//g, "*\\/");
}

export { getJsdoc };
