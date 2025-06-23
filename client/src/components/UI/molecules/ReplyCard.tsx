import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { RepliesContextTypes, Reply, User } from "../../../types";
import RepliesContext from "../../contexts/RepliesContext";
import InputField from "./InputField";

type Props = { reply: Reply, decodedUser: Omit<User, "role" | "password"> | null, postId: string };
const ReplyCard = ({ reply, decodedUser, postId }: Props) => {

  const { editReply } = useContext(RepliesContext) as RepliesContextTypes;
  const [editingReply, setEditingReply] = useState(false);
  const [postReplyEditMessage, setPostReplyEditMessage] = useState('');

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

  return (
    <div>
      <p>{reply.reply}</p>
      {
        !editingReply ?
        <p>User: {reply.username}</p> :
        <div>
          <form onSubmit={formik.handleSubmit}>
            <InputField
              labelText='Reply:'
              inputType='text'
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
      <p>Replied: {reply.replyDate.slice(0, 10)}, {reply.replyDate.slice(11, 16)}</p>
      {
        reply.lastEditDate && <p>Edited: {reply.lastEditDate.slice(0, 10)}, {reply.lastEditDate.slice(11, 16)}</p>
      }
      {
        decodedUser && decodedUser._id === reply.userId &&
        <div>
          <button onClick={replyEdittHandler}>Edit Reply</button>
          <button>Delete</button>
        </div>
      }
    </div>
  );
}
 
export default ReplyCard;