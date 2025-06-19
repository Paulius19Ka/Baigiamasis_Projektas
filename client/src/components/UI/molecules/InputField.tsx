import { InputFieldPropTypes } from "../../../types";
import Input from "../atoms/Input";
import Label from "../atoms/Label";

type Props = Omit<InputFieldPropTypes, 'labelHtmlFor'> & {
  inputOnChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  inputOnBlur: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

const InputField = ({ labelText, inputType, inputName, inputId, inputValue, inputOnChange, inputOnBlur, errors, touched, inputPlaceholder, radioOps, selectOps }: Props) => {
  return (
    <div>
      <div>
        <Label
          labelHtmlFor={inputId}
          labelText={labelText}
        />
        <Input
          inputType={inputType}
          inputName={inputName} inputId={inputId}
          inputValue={inputValue}
          inputOnChange={inputOnChange}
          inputOnBlur={inputOnBlur}
          inputPlaceholder={inputPlaceholder}
          radioOps={radioOps}
          selectOps={selectOps}
        />
      </div>
      {
        errors && touched && <p>{errors}</p>
      }
    </div>
  );
}
 
export default InputField;