import { describe, expect, it } from "@jest/globals";
import { removeIndentations } from "./removeIndentations";

describe("removeIndentations", () => {
  it("should XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", () => {
    const input = `
      // some code
    `;
    const output = removeIndentations(input, 3, 2);
    expect(output).toBe("// some code");
  });
});
