import { MouseEventHandler, ReactNode } from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  font-size: 1rem;
  color: var(--font-main);
  background-color: var(--accent-main);
  border: none;
  border-radius: 15px;
  padding: 5px 10px;
  transition: ease-out 0.3s;

  &:hover{
    background-color: var(--accent-hover);
    color: var(--font-main);
    cursor: pointer;
  }

  &:active{
    background-color: var(--accent-active);
    color: var(--accent-main);
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
  onClick: MouseEventHandler<HTMLButtonElement>
};

const ButtonComponent = ({ onClick, children }: Props) => {
  return (
    <StyledButton onClick={onClick}>{ children }</StyledButton>
  );
}
 
export default ButtonComponent;