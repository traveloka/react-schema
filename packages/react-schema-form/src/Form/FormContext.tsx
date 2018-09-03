import * as createReactContext from 'create-react-context';
import { FieldByName } from '../types';

type FormContextValue = {
  fields: FieldByName
} | undefined

const FormContext: createReactContext.Context<FormContextValue> = createReactContext<FormContextValue>(undefined);

export default FormContext;
