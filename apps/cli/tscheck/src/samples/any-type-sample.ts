export interface UserPayload {
  id: string;
  // Violation 1: explicit any property
  metadata: any;
}

// Violation 2: explicit any parameter
export function processRawData(payload: any): any {
  // Violation 3: explicit type assertion (as any)
  const casted = (payload as any).someUnsafeField;

  // Violation 4: generic any type argument
  const genericList: Array<any> = [casted];

  return genericList;
}

export function runAnyTypeDemonstration(): void {
  const result = processRawData({ test: true });
  console.log("Processed:", result);
}
