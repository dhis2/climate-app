import {
  getYearFromId,
  getMonthFromId,
  getDailyPeriod,
  getMonthlyPeriod,
  getSelectedMonths,
} from "../chart";

const dailyData = [
  {
    id: "2023-12-30",
    dewpoint_temperature_2m: 293.6356198487458,
    temperature_2m: 299.60614176149716,
    temperature_2m_max: 306.83880615234375,
    temperature_2m_min: 293.02760314941406,
    total_precipitation_sum: 0.00005241168869866265,
  },
  {
    id: "2023-12-31",
    dewpoint_temperature_2m: 294.7193331965693,
    temperature_2m: 299.8228479879874,
    temperature_2m_max: 307.1405944824219,
    temperature_2m_min: 293.02366638183594,
    total_precipitation_sum: 0.000010302993981367889,
  },
  {
    id: "2024-01-01",
    dewpoint_temperature_2m: 295.17700978031877,
    temperature_2m: 300.08281293798376,
    temperature_2m_max: 306.66212463378906,
    temperature_2m_min: 294.9395751953125,
    total_precipitation_sum: 0.00009219778898391773,
  },
  {
    id: "2024-01-02",
    dewpoint_temperature_2m: 294.4567006429036,
    temperature_2m: 300.4996580759685,
    temperature_2m_max: 307.7436828613281,
    temperature_2m_min: 294.1907653808594,
    total_precipitation_sum: 0.000007006194833694382,
  },
];

const monthlyData = [
  {
    id: "2023-11",
    dewpoint_temperature_2m: 296.87831278630625,
    temperature_2m: 298.76203529423134,
    temperature_2m_max: 305.2322150842466,
    temperature_2m_min: 295.0522875089673,
    total_precipitation_sum: 0.17696658724747039,
  },
  {
    id: "2023-12",
    dewpoint_temperature_2m: 294.6837593776832,
    temperature_2m: 299.2254130005849,
    temperature_2m_max: 307.5091445040674,
    temperature_2m_min: 290.97705996819803,
    total_precipitation_sum: 0.01011488187816139,
  },
  {
    id: "2024-01",
    dewpoint_temperature_2m: 295.15219542981936,
    temperature_2m: 300.95268434562496,
    temperature_2m_max: 308.6656582724846,
    temperature_2m_min: 295.36798345173463,
    total_precipitation_sum: 0.016322159461762548,
  },
  {
    id: "2024-02",
    dewpoint_temperature_2m: 294.6359296661543,
    temperature_2m: 302.3549004342691,
    temperature_2m_max: 310.6469045322619,
    temperature_2m_min: 295.5802970895393,
    total_precipitation_sum: 0.015409139813057743,
  },
];

const monthlyperiod = { startMonth: "2023-12", endMonth: "2024-01" };

describe("chart utils", () => {
  it("it should get year from id", () => {
    expect(getYearFromId("2023-12-30")).toEqual("2023");
    expect(getYearFromId("2024-01-01")).toEqual("2024");
  });

  it("it should get month from id", () => {
    expect(getMonthFromId("2023-12-30")).toEqual("12");
    expect(getMonthFromId("2024-01-01")).toEqual("01");
  });

  it("it should get daily period", () => {
    expect(getDailyPeriod(dailyData)).toEqual("2023-2024");
    expect(
      getDailyPeriod(dailyData.filter((d) => getYearFromId(d.id) === "2023"))
    ).toEqual("2023");
  });

  it("it should get monthly period", () => {
    expect(getMonthlyPeriod(monthlyperiod)).toEqual("2023-2024");
    expect(
      getMonthlyPeriod({ startMonth: "2024-01", endMonth: "2024-04" })
    ).toEqual("2024");
  });

  it("it should select monthly data for period", () => {
    expect(
      getSelectedMonths(monthlyData, monthlyperiod).map((d) => d.id)
    ).toEqual(["2023-12", "2024-01"]);
  });
});
