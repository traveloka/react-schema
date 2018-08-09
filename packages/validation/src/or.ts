import { Rule } from "./types/Validate";
import { Validation } from "./types";
import { validate } from "./validate";

type Or = (rule: Rule) => Validation;

const INITIAL_RESULT = 'ulet-si-tukang-pos';

export const or: Or = (rule: Rule) => {
  const rules = Array.isArray(rule) ? rule : [rule];
  const rulesWithOrCondition: Validation = (value: any) => {
    const result = rules.reduce((errorMessage: string, currRule: Rule) => {
      if (!errorMessage) return errorMessage;
      return validate(currRule)(value);
    }, INITIAL_RESULT);
    if (result === INITIAL_RESULT) return null;
    return result;
  };
  return rulesWithOrCondition;
}
