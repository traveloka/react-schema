import convertObjectToArray from "../convertObjectToArray";

describe("test convertObjectToArray", () => {
  it("should return as expected", () => {
    const input = { "3": "3", 1: "1" };
    const output = convertObjectToArray(input);
    expect(output).toMatchObject([undefined, "1", undefined, "3"]);
  });

  it("should able accept empty object", () => {
    const input = null;
    const output = convertObjectToArray(input);
    expect(output).toMatchObject([]);
  });
});
