import { formatDate } from "../time";

describe("time utils", () => {
  it("it should format a date", () => {
    const date = new Date("2021-01-01");
    expect(formatDate(date)).toEqual("2021-01-01");
  });
});
