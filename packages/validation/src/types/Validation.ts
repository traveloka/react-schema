import { ValidationResult } from "./ValidationResult";

export type Validation = (v: any, ...args: any[]) => ValidationResult;
