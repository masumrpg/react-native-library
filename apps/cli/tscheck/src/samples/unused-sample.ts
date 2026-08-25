import { modernCalculateSum } from "./deprecated-sample.js";

export function runUnusedDemonstration(activeParam: string, unusedParam: number): string {
  // Violation 1: Unused local variable
  const unusedVariable = "this variable is never read";

  // Violation 2: Unused destructured variable
  const user = { name: "Ma'sum", role: "developer", age: 25 };
  const { name, role: _ignoredRole, age: _ignoredAge } = user;

  // Clean usage
  return `${activeParam} processed for ${name}`;
}
