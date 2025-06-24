import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import CloseIcon from '@mui/icons-material/Close';

const StyledDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--modal-overlay);
  z-index: 1000;

  div.modalContent{
    position: fixed;
    width: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--modal-background);
    border-radius: 10px;
    padding: 30px;
    z-index: 1000;

    > div{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      > h2{
        margin: 0;
      }

      > div{
        display: flex;
        gap: 10px;
        align-items: center;

        > button{
          font-size: 1rem;
          color: var(--font-main);
          background-color: var(--button-main);
          border: none;
          padding: 2px, 5px;
          border-radius: 3px;
          cursor: pointer;
  
          &:hover{
            background-color: var(--button-hover);
            color: var(--button-main);
          }
  
          &:active{
            background-color: var(--button-active);
            color: var(--font-active);
          }
        }
      }
    }

    > svg{
      position: fixed;
      top: 5px;
      right: 5px;
      cursor: pointer;

      &:hover{
        color: var(--accent-main);
      }

      &:active{
        color: var(--accent-active);
      }
    }
  }
`;

type Props = {
  isOpen: boolean,
  onClose: () => void,
  children: ReactNode
};

const Modal = ({ isOpen, onClose, children }: Props) => {

  useEffect(() => {
    const handleESC = (e: KeyboardEvent) => {
      if(e.key === 'Escape'){
        onClose();
      };
    };

    document.addEventListener('keydown', handleESC);
    return () => document.removeEventListener('keydown', handleESC);
  }, [onClose]);

  if(!isOpen){
    return null;
  };

  return ReactDOM.createPortal(
    <StyledDiv onClick={onClose}>
      <div className="modalContent">
        <div>
          { children }
        </div>
        <CloseIcon onClick={onClose} />
      </div>
    </StyledDiv>,
    document.getElementById('modal') as HTMLElement
  );
}
 
export default Modal;