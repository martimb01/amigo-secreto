import { validateUserData, validationTypes } from "./userDataValidation";

describe("validateUserData", () => {
  it("rejects passwords shorter than 6 characters", () => {
    const result = validateUserData("abc", validationTypes.Password);
    expect(result).toBe("Password must be at least 6 characters.");
  });

  it("rejects passwords without a number", () => {
    const result = validateUserData("abcdef", validationTypes.Password);
    expect(result).toBe(
      "Password must contain at least one letter and one number.",
    );
  });

  it("accepts valid passwords", () => {
    const result = validateUserData("abgc123", validationTypes.Password);
    expect(result).toBeNull();
  });

  it("rejects invalid emails", () => {
    const result = validateUserData("notanemail", validationTypes.Email);
    expect(result).toBe("Invalid email");
  });

  it("accepts valid emails", () => {
    const result = validateUserData("user@example.com", validationTypes.Email);
    expect(result).toBeNull();
  });
});
