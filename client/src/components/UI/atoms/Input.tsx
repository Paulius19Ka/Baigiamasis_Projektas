import { InputFieldPropTypes } from "../../../types";

type Props = Pick<InputFieldPropTypes, 'inputType' | 'inputName' | 'inputId' | 'inputValue' | 'inputOnChange' | 'inputOnBlur'>;

const Input = ({ inputType, inputName, inputId, inputValue, inputOnChange, inputOnBlur }: Props) => {
  return (
    <input
      type={inputType}
      name={inputName} id={inputId}
      value={inputValue}
      onChange={inputOnChange}
      onBlur={inputOnBlur}
    />
  );
}
 
export default Input;