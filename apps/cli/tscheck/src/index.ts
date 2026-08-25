import { runDeprecatedDemonstration } from "./samples/deprecated-sample.js";
import { runUnusedDemonstration } from "./samples/unused-sample.js";
import { runAnyTypeDemonstration } from "./samples/any-type-sample.js";
import { formatUserData, type CompliantUser } from "./samples/clean-sample.js";

export function main(): void {
  console.log("Running tscheck playground demonstration...");

  runDeprecatedDemonstration();
  const unusedMsg = runUnusedDemonstration("Test", 123);
  console.log(unusedMsg);
  runAnyTypeDemonstration();

  const user: CompliantUser = {
    id: "usr_1",
    name: "Ma'sum",
    roles: ["maintainer"],
  };
  console.log(formatUserData(user));
}

main();
