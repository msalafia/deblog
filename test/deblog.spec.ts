import { isTLogLevel, createDeblog } from "../src/create_deblog";

describe("test isTLogLevel function", () => {
  it("should return true for admitted names of the console object methods", () => {
    const admitted_names = ["log", "debug", "info", "warn", "error"];

    admitted_names.forEach(name => expect(isTLogLevel(name)).toBe(true));
  });

  it("should return false for not admitted names of the console object methods", () => {
    const admitted_names = ["group", "endGroup", "table"];

    admitted_names.forEach(name => expect(isTLogLevel(name)).toBe(false));
  });
});

describe("test createDeblog for error handling of bad configuration objects", () => {
  it("should throw an error when the configuration object is not provided", () => {
    expect(() => createDeblog(<any>undefined)).toThrowError(
      "A configuration object is required in order to create a Deblog instance."
    );
  });
});