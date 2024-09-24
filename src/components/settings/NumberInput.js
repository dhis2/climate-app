import { InputField } from "@dhis2/ui";

const NumberInput = ({ id, label, value, validationText, onChange }) => (
  <InputField
    label={label}
    type="number"
    value={value !== undefined ? String(value) : ""}
    onChange={({ value }) =>
      onChange(id, value !== "" ? Number(value) : undefined)
    }
    warning={!!validationText}
    validationText={validationText}
  />
);

export default NumberInput;
