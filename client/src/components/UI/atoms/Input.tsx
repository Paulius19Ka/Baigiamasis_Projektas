import { InputFieldPropTypes } from "../../../types";

type Props = Pick<InputFieldPropTypes, 'inputType' | 'inputName' | 'inputId' | 'inputValue' | 'inputOnChange' | 'inputOnBlur'| 'inputPlaceholder'> & {
  inputOnChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputOnBlur: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const Input = ({ inputType, inputName, inputId, inputValue, inputOnChange, inputOnBlur, inputPlaceholder }: Props) => {
  return (
    inputType === 'textarea' ?
    <textarea
      rows={5} cols={20}
      name={inputName} id={inputId}
      value={inputValue}
      onChange={inputOnChange}
      onBlur={inputOnBlur}
      placeholder={inputPlaceholder}
    /> :
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