import { describe, it, expect } from "bun:test";
import { DEFAULT_CONFIG } from "../src/config/loadConfig.js";
import schema from "../schema.json";

describe("schema.json and loadConfig defaults standardization", () => {
  it("sets DEFAULT_CONFIG.theme to 'corporate'", () => {
    expect(DEFAULT_CONFIG.theme).toBe("corporate");
  });

  it("includes 'txt' in schema.json target formats", () => {
    const toStringEnum = schema.properties.to.oneOf[0].enum;
    const toArrayEnum = schema.properties.to.oneOf[1].items.enum;

    expect(toStringEnum).toContain("txt");
    expect(toArrayEnum).toContain("txt");
  });

  it("standardizes theme default and theme enum in schema.json", () => {
    expect(schema.properties.theme.default).toBe("corporate");
    const themeEnum = schema.properties.theme.oneOf[0].enum;
    expect(themeEnum).toContain("corporate");
    expect(themeEnum).toContain("default");
    expect(themeEnum).toContain("academic");
    expect(themeEnum).toContain("github");
    expect(themeEnum).toContain("minimal");
  });
});
