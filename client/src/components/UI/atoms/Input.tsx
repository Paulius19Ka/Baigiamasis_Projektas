import { InputFieldPropTypes } from "../../../types";

type Props = Pick<InputFieldPropTypes, 'inputType' | 'inputName' | 'inputId' | 'inputValue' | 'inputOnChange' | 'inputOnBlur'| 'inputPlaceholder' | 'radioOps' | 'selectOps'> & {
  inputOnChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  inputOnBlur: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

const Input = ({ inputType, inputName, inputId, inputValue, inputOnChange, inputOnBlur, inputPlaceholder, radioOps, selectOps }: Props) => {

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
    inputType === 'radio' ? 
    (
      radioOps?.map((op, i) => 
        <label key={i}>
          <input
            key={i}
            type={inputType}
            name={inputName} id={op}
            value={op}
            onChange={inputOnChange}
            onBlur={inputOnBlur}
            checked={inputValue === op}
          />
          {op}
        </label>
      )
    ) :
    inputType === 'select' ?
    <select
      name={inputName} id={inputId}
      value={inputValue}
      onChange={inputOnChange}
      onBlur={inputOnBlur}
    >
      <option value='' disabled>-Select a topic-</option>
      {
        selectOps?.map((op, i) =>
          <option value={op} key={i}>{op}</option>
        )
      }
    </select> :
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