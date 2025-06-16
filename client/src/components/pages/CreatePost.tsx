import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';

import UsersContext from "../contexts/UsersContext";
import { Post, PostsContextTypes, UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";
import PostsContext from "../contexts/PostsContext";

const CreatePost = () => {

  const { decodeUserFromToken, getUserId } = useContext(UsersContext) as UsersContextTypes;
  const { createPost } = useContext(PostsContext) as PostsContextTypes;
  const decodedUser = decodeUserFromToken();
  const [userId, setUserId] = useState<string | null>(null);
  const [postMessage, setPostMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchId = async () => {
      const res = await getUserId();
      if(res?.id){
        setUserId(res.id);
      };
    };
    fetchId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initValues: Pick<Post, "title" | "content" | "topic"> = {
    title: '',
    content: '',
    topic: ''
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, 'Title must be longer than 5 symbols.')
        .max(100, 'Title must be shorter than 100 symbols.')
        .required('Enter the title.'),
      content: Yup.string()
        .min(20, 'The post description must be longer than 20 symbols.')
        .max(2000, 'The post description must be shorter than 2000 symbols.')
        .required('Enter the post description'),
      topic: Yup.string()
        .oneOf(topics, 'Invalid topic selected.')
        .required('A topic must be selected.')
    }),
    onSubmit: async (values) => {
      if(!userId){
        setPostMessage('Failed to retrieve ID.');
        throw new Error('Failed to retrieve ID.');
      };

      const Response = await createPost(values, userId);
      if('error' in Response){
        setPostMessage('Failed to create new thread.');
        throw new Error('Failed to create new thread.');
      };
      setPostMessage('Successfully created a new thread.');
      setTimeout(() => navigate('/'), 2000);
    }
  })

  return (
    <section>
      {
        decodedUser ?
        <>
          <h2>Create new thread</h2>
          <form onSubmit={formik.handleSubmit}>
            <InputField
              labelText='Title:'
              inputType='text'
              inputName='title' inputId='title'
              inputValue={formik.values.title}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.title}
              touched={formik.touched.title}
              inputPlaceholder={'Enter a title...'}
            />
            <InputField
              labelText='Content:'
              inputType='textarea'
              inputName='content' inputId='content'
              inputValue={formik.values.content}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.content}
              touched={formik.touched.content}
              inputPlaceholder={'Enter content...'}
            />
            <InputField
              labelText='Topic:'
              inputType='select'
              inputName='topic' inputId='topic'
              inputValue={formik.values.topic}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.topic}
              touched={formik.touched.topic}
              inputPlaceholder={'Enter a topic...'}
              selectOps={topics}
            />
            <input type="submit" value='Submit Post' />
          </form>
          {
            postMessage && <p>{postMessage}</p>
          }
        </> :
        <>
          <p>Please <Link to='/login'>login</Link> or <Link to='/register'>register</Link> to create a new thread.</p>
        </>
      }
    </section>
  );
}
 
export default CreatePost;