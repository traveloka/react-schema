import { ValueByName } from './../../types/Form.d';

export default function convertObjectToArray(obj: ValueByName) {
  const arr: Array<number> = [];
  if (obj) {
    Object.entries(obj).forEach((keyValue) => {
      const [key, value] = keyValue;
      arr[Number(key)] = value;
    });
  }
  return arr;
}
