import { formatUpdatedAt } from "@/server/utils/format-date";

describe("formatUpdatedAt", () => {
  it("should return empty string when date is null", () => {
    expect(formatUpdatedAt(null)).toBe("");
  });

  it("should format date correctly in Japanese locale", () => {
    const date = new Date("2025-01-15T10:30:00Z");
    const result = formatUpdatedAt(date);
    expect(result).toBe("2025.1.15時点");
  });

  it("should handle different date formats", () => {
    const date = new Date("2024-12-25T15:45:30Z");
    const result = formatUpdatedAt(date);
    expect(result).toBe("2024.12.26時点");
  });

  it("should handle single digit months and days", () => {
    const date = new Date("2025-03-05T08:15:00Z");
    const result = formatUpdatedAt(date);
    expect(result).toBe("2025.3.5時点");
  });

  it("should handle leap year dates", () => {
    const date = new Date("2024-02-29T12:00:00Z");
    const result = formatUpdatedAt(date);
    expect(result).toBe("2024.2.29時点");
  });
});