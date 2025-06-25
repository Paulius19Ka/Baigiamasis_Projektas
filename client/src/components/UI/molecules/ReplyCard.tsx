import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { RepliesContextTypes, Reply, User } from "../../../types";
import RepliesContext from "../../contexts/RepliesContext";
import InputField from "./InputField";
import Modal from "../atoms/Modal";
import DateFormat from "../atoms/DateFormat";

// ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
        <div>
          <>
            {reply.reply.split('\n\n').map((par, i) => <p key={i}>{par}</p>)}
          </>
          {
            !editingReply ?
            <p>User: {reply.username}</p> :
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
                <input type="submit" value='Confirm Edit' />
              </form>
              {
                postReplyEditMessage && <p>{postReplyEditMessage}</p>
              }
            </div>
          }
          <p>Replied: {<DateFormat date={reply.replyDate} />}</p>
          {
            reply.lastEditDate && <p>Edited: {<DateFormat date={reply.lastEditDate} />}</p>
          }
          {
            decodedUser && decodedUser._id === reply.userId &&
            <div>
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
        </div>
      }
    </>
  );
}
 
export default ReplyCard;