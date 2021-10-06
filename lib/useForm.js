import { useState } from "react";
export const useForm = (initalValues) => {
  const [values, setValues] = useState(initalValues);

  const reset = () => {
    setValues(initalValues);
  };

  return [
    values,
    (e) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
    (data) => {
      setValues(data);
    },
    setValues,
  ];
};
