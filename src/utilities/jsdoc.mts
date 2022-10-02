import { JsdocAST } from "../types.mjs";

function assignToDescription(params: JsdocAST) {
  if (Object.values(params).every((v) => !v)) {
    return undefined;
  }

  const {
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
  } = params;

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

function getJsdoc(doc: JsdocAST) {
  const descriptionWithDetails = assignToDescription(doc);

  return doc.deprecated || descriptionWithDetails || doc.example
    ? `
/**${
        descriptionWithDetails
          ? `
 * ${normalizeDescription(descriptionWithDetails)}`
          : ""
      }${
        doc.deprecated
          ? `
 * @deprecated ${normalizeDescription(doc.deprecated) || ""}`
          : ""
      }${
        doc.example
          ? `
 * @example 
 *   ${doc.example}`
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
