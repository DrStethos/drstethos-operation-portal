/**
 * Replace {{variableName}} placeholders in a template string.
 * Unknown placeholders are left as-is.
 */
export function renderTemplate(
  template: string,
  variables: Record<string, unknown> = {}
): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
    const value = variables[key];
    if (value === undefined || value === null) {
      return "";
    }
    return String(value);
  });
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Allow only safe template document IDs (no path traversal). */
export function isValidTemplateId(templateId: string): boolean {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(templateId);
}

export function sanitizeVariables(
  input: unknown
): Record<string, string | number | boolean> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  const result: Record<string, string | number | boolean> = {};
  const entries = Object.entries(input as Record<string, unknown>);

  if (entries.length > 40) {
    throw new Error("Too many template variables");
  }

  for (const [key, value] of entries) {
    if (!/^[a-zA-Z0-9_]{1,40}$/.test(key)) {
      continue;
    }
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      if (typeof value === "string" && value.length > 5000) {
        throw new Error(`Variable "${key}" is too long`);
      }
      result[key] = value;
    }
  }

  return result;
}
