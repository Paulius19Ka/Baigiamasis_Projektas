import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import styled from "styled-components";

import { RepliesContextTypes, Reply, User } from "../../../types";
import RepliesContext from "../../contexts/RepliesContext";
import InputField from "./InputField";
import Modal from "../atoms/Modal";
import DateFormat from "../atoms/DateFormat";

// ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const StyledDiv = styled.div`
  background-color: var(--background-dark);
  border-radius: 15px;
  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  > p{
    margin: 0;
    font-size: 1rem;
  }

  > div.replyInfo{
    display: flex;
    align-items: center;
    justify-content: space-between;

    > span{
      font-size: 0.9rem;
      color: var(--font-hover);
    }

    > div.dates{
      display: flex;
      flex-direction: column;
      align-items: center;
  
      > span{
        font-size: 1rem;
        margin-left: auto;
        color: var(--font-hover);
      }
  
      > span:nth-child(2){
        font-size: 0.8rem;
        font-weight: 400;
        color: var(--button-main);
      }
    }
  }

  > div.buttonArea{
    display: flex;
    gap: 10px;
    margin-left: auto;

    > svg{
      color: var(--font-main);
      font-size: 1.8rem;
      transition: var(--transition-main);
      
      &:hover{
        cursor: pointer;
        color: var(--accent-main);
      }

      &:active{
        cursor: pointer;
        color: var(--accent-active);
      }
    }
  }

  > div{

    > form{
      display: flex;
      align-items: flex-end;
      gap: 10px;

      > div{

        > div{
          display: flex;
          flex-direction: column;

          > textarea{
            color: var(--font-main);
            padding: 10px 20px;
            background-color: var(--background-darker);
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            transition: var(--transition-main);

            &::placeholder{
              color: var(--button-main);
            }

            &:hover{
              color: var(--font-main);
              background-color: var(--background-main);

              &::placeholder{
                color: var(--background-dark);
              }
            }
            
            &:focus{
              background-color: var(--background-main);
              outline: none;

              &::placeholder{
                color: var(--background-dark);
              }
            }
          }
        }
      }

      > button{
        border: none;
        background-color: rgba(255, 0, 0, 0);
        padding: 0;
        
        > svg{
          color: var(--font-main);
          font-size: 2rem;
          transition: var(--transition-main);

          &:hover{
            cursor: pointer;
            color: var(--accent-main);
          }
  
          &:active{
            cursor: pointer;
            color: var(--accent-active);
          }
        }
      }
    }
  }

  @media (min-width: 768px){
    padding: 24px;

    > p{
      font-size: 1.1rem;
    }

    > div.replyInfo{

      > span{
        font-size: 1rem;
      }

      > div.dates{

        > span{
          font-size: 1.1rem;
        }

        > span:nth-child(2){
          font-size: 0.9rem;
        }
      }
    }
  }

  @media (min-width: 1024px){

  }
`;

type Props = { reply: Reply, decodedUser: Omit<User, "role" | "password"> | null, postId: string };
const ReplyCard = ({ reply, decodedUser, postId }: Props) => {

  const { editReply, deleteReply } = useContext(RepliesContext) as RepliesContextTypes;
  const [editingReply, setEditingReply] = useState(false);
  const [postReplyEditMessage, setPostReplyEditMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formik = useFormik({
      initialValues: {
        reply: reply.reply
      },
      validationSchema: Yup.object({
        reply: Yup.string()
          .min(10, 'The reply must be longer than 10 symbols.')
          .max(1000, 'The reply must be shorter than 1000 symbols.')
          .required('Enter the reply')
      }),
      onSubmit: async (values) => {
        if(!postId){
          setPostReplyEditMessage(`Failed to retrieve Post ID.`);
          throw new Error(`Failed to retrieve Post ID.`);
        };
        if(!decodedUser?._id){
          setPostReplyEditMessage(`Failed to retrieve user ID.`);
          throw new Error(`Failed to retrieve user ID.`);
        };
  
        const Response = await editReply(values, reply.replyId, postId);
        if('error' in Response){
          setPostReplyEditMessage('Failed to edit the reply.');
          throw new Error('Failed to edit the reply.');
        };
        setPostReplyEditMessage('Successfully edited the reply.');
        setEditingReply(false);
      }
    });

  const replyEdittHandler = async () => {
    if(!editingReply){
      setEditingReply(true);
    };
  };

  const deleteReplyHandler = () => {
    if(!reply.replyId){
      setDeleteMessage(`Failed to retrieve reply ID.`);
      throw new Error(`Failed to retrieve reply ID.`);
    };
    deleteReply(reply.replyId, postId);
    setDeleteMessage('Reply was successfully deleted.');
  };

  return (
    <>
      {
        deleteMessage ?
        <p>{deleteMessage}</p> :
        <StyledDiv>
          <div className="replyInfo">
            <span>Posted By: <b>{reply.username}</b></span>
            <div className="dates">
              <span>Posted {reply.replyDate ? <DateFormat date={reply.replyDate} /> : ''}</span>
              {reply.lastEditDate && <span><i>Edited {<DateFormat date={reply.lastEditDate} />}</i></span>}
            </div>
          </div>
          {
            !editingReply ?
            <>
              {/* <p>Posted By: {reply.username}</p> */}
              {reply.reply.split('\n\n').map((par, i) => <p key={i}>{par}</p>)}
            </> :
            <div>
              <form onSubmit={formik.handleSubmit}>
                <InputField
                  labelText='Reply:'
                  inputType='textarea'
                  inputName='reply' inputId='reply'
                  inputValue={formik.values.reply}
                  inputOnChange={formik.handleChange}
                  inputOnBlur={formik.handleBlur}
                  errors={formik.errors.reply}
                  touched={formik.touched.reply}
                  inputPlaceholder={'Enter a reply...'}
                />
                <button type= 'button' onClick={() => {
                  setEditingReply(false);
                }}><CancelIcon /></button>
                <button type="submit">
                  <CheckCircleIcon />
                </button>
              </form>
              {
                postReplyEditMessage && <p>{postReplyEditMessage}</p>
              }
            </div>
          }
          {
            decodedUser && decodedUser._id === reply.userId &&
            <div className="buttonArea">
              <EditIcon onClick={replyEdittHandler}/>
              <DeleteIcon type="button" onClick={() => setShowDeleteModal(true)}/>
              <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <h2>Are you sure you want to delete this reply?</h2>
                <div>
                  <button type="button" onClick={deleteReplyHandler}>Yes</button>
                  <button type="button" onClick={() => setShowDeleteModal(false)}>No</button>
                </div>
              </Modal>
            </div>
          }
        </StyledDiv>
      }
    </>
  );
}
 
export default ReplyCard;