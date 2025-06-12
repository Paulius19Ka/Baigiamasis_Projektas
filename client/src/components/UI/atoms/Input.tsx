import { InputFieldPropTypes } from "../../../types";

type Props = Pick<InputFieldPropTypes, 'inputType' | 'inputName' | 'inputId' | 'inputValue' | 'inputOnChange' | 'inputOnBlur'| 'inputPlaceholder'>;

const Input = ({ inputType, inputName, inputId, inputValue, inputOnChange, inputOnBlur, inputPlaceholder }: Props) => {
  return (
    <input
      type={inputType}
      name={inputName} id={inputId}
      value={inputValue}
      onChange={inputOnChange}
      onBlur={inputOnBlur}
      placeholder={inputPlaceholder}
    />
  );
}
 
export default Input;