import { InputFieldPropTypes, Topics } from "../../../types";

type Props = Pick<InputFieldPropTypes, 'inputType' | 'inputName' | 'inputId' | 'inputValue' | 'inputOnChange' | 'inputOnBlur'| 'inputPlaceholder'> & {
  inputOnChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  inputOnBlur: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

const Input = ({ inputType, inputName, inputId, inputValue, inputOnChange, inputOnBlur, inputPlaceholder }: Props) => {

  const topics: Topics[] = [
    'General', 'Releases', 'Collecting', 'Concerts', 'Rock/Blues', 'Pop/Dance', 'Metal/Hard Rock', 'Jazz', 'Classical', 'Electronic', 'Country/Folk', 'Soul/Rap', 'Alternative', 'Misc'
  ];

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
    inputType === 'select' ?
    <select
      name={inputName} id={inputId}
      value={inputValue}
      onChange={inputOnChange}
      onBlur={inputOnBlur}
    >
      <option value='' disabled>-Select a topic-</option>
      {
        topics.map((topic, i) =>
          <option value={topic} key={i}>{topic}</option>
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