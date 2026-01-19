import { SingleParameter } from "./Parameters";

export const validate = (parameter: SingleParameter, value: unknown) => {
  const noDefault = !parameter.default;

  if (noDefault && (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0))) {
    return {
      isValid: false,
      error: "Must be not empty",
    };
  }

  const num = Number(value);

  switch (parameter.type) {
    case "number":
      if (noDefault && isNaN(num)) {
        return {
          isValid: false,
          error: "Must be a number"
        };
      }
      return { isValid: true, error: undefined };

    case "integer":
      if (noDefault && (isNaN(num) || !Number.isInteger(num))) {
        return {
          isValid: false,
          error: "Must be an integer"
        };
      }
      return { isValid: true, error: undefined };

    case "array":
    default:
      return { isValid: true, error: undefined };
  }
};
