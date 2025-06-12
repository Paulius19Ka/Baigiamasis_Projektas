import { InputFieldPropTypes } from "../../../types";

type Props = Pick<InputFieldPropTypes, 'labelHtmlFor' | 'labelText'>;

const Label = ({ labelHtmlFor, labelText }: Props) => {
  return (
    <label htmlFor={labelHtmlFor}>{labelText}</label>
  );
}
 
export default Label;