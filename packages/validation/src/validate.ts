import { Validate, Rule } from "./types/Validate";

export const validate: Validate = (rule: Rule) => (value?: any, ...args: any[]) => {
  if (!Array.isArray(rule)) return rule(value, ...args);
  const rules: Rule[] = rule;
  const result = rules.reduce((errorMessage: string, currRule: Rule) => {
    if (errorMessage) return errorMessage;
    return validate(currRule)(value, ...args);
  }, null);
  return result;
}
