import { MouseEventHandler, ReactNode } from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  font-size: 1rem;
  color: var(--font-main);
  background-color: var(--accent-main);
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  transition: var(--transition-main);

  &:hover{
    background-color: var(--accent-hover);
    color: var(--font-main);
    cursor: pointer;
  }

  &:active{
    background-color: var(--accent-active);
    color: var(--accent-main);
  }

  &:disabled{
    cursor: not-allowed;
    background-color: var(--accent-active);
  }

  @media (min-width: 768px){
    font-size: 1.05rem;
  }

  @media (min-width: 1024px){
    font-size: 1.1rem;
  }
`;

type Props = {
  children: ReactNode,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  type?: 'button' | 'submit' | 'reset',
  isDisabled?: boolean
};

const ButtonComponent = ({ onClick, children, type, isDisabled }: Props) => {
  return (
    <StyledButton onClick={onClick} type={type} disabled={isDisabled}>{ children }</StyledButton>
  );
}
 
export default ButtonComponent;