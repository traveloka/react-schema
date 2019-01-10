# React Schema

## Installation
yarn
```
yarn add @traveloka/validation
```
npm
```
npm i @traveloka/validation --save
```


## Rules
- `required`
- `maxLength(length: number)`
- `or(rules: Rule | Rule[])`


## Example study case
- Password length minimal 5 character
- Password must contain at least one symbol or number

```typescript
<Field
  component={TextInput}
  rules={[
    minLength(5),
    or([
      containSymbol,
      containNumber
    ])
  ]} />
```
