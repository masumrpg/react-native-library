/**
 * @deprecated Use `modernCalculateSum` instead. Will be removed in v2.0.0.
 */
export function legacyCalculateSum(a: number, b: number): number {
  return a + b;
}

export function modernCalculateSum(a: number, b: number): number {
  return a + b;
}

export class LegacyService {
  /**
   * @deprecated Use `fetchDataAsync` instead.
   */
  public fetchDataSync(): string {
    return "legacy data";
  }

  public fetchDataAsync(): Promise<string> {
    return Promise.resolve("modern data");
  }
}

export function runDeprecatedDemonstration(): void {
  // Violation 1: Calling a deprecated function
  const sum = legacyCalculateSum(10, 20);

  // Violation 2: Calling a deprecated method on a class
  const service = new LegacyService();
  const data = service.fetchDataSync();

  // Clean usages
  const modernSum = modernCalculateSum(10, 20);
  console.log(`Results: ${sum}, ${modernSum}, ${data}`);
}
