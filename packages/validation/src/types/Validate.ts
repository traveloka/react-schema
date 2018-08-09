import { Validation } from "./Validation";
import { ValidationResult } from "./ValidationResult";

export type Rule = Validation | Rules;
export interface Rules extends Array<Rule> { }

export type Validate = (rule: Rule) => (value: any, ...args: any[]) => ValidationResult;
