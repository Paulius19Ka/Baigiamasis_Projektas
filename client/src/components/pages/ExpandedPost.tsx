import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { Post } from "../../types";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";

const ExpandedPost = () => {

  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState('');

  const initValues: Pick<Post, "title" | "content" | "topic"> = {
    title: post?.title ?? '',
    content: post?.content ?? '',
    topic: post?.topic ?? ''
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
      console.log(values);
      // if(!userId){
      //   setPostMessage('Failed to retrieve ID.');
      //   throw new Error('Failed to retrieve ID.');
      // };

      // const Response = await createPost(values, userId);
      // if('error' in Response){
      //   setPostMessage('Failed to create new thread.');
      //   throw new Error('Failed to create new thread.');
      // };
      setEditMessage('Edit successful.');
      setEditingTitle(false);
      setEditingContent(false);
      setEditingTopic(false);
      setTimeout(() => {
        setEditMessage('');
      }, 2000);
    }
  });

  // update formik values when post loads
  useEffect(() => {
    if(post){
      formik.setValues({
        title: post.title,
        content: post.content,
        topic: post.topic
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);


  useEffect(() => {
    fetch(`http://localhost:5500/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      {
        post ?
        <div>
          <p>Score: {post.score}</p>
          <p>Posted: {post.postDate ? post.postDate.slice(0, 10): ''}, {post.postDate ? post.postDate.slice(11, 16): ''}</p>
          {
            post.lastEditDate ?
            <p>Edited: {post.lastEditDate ? post.lastEditDate.slice(0, 10): ''}, {post.lastEditDate ? post.lastEditDate.slice(11, 16): ''}</p> : <></>
          }
          <p>By: {post.postedBy.username}</p>
          <form onSubmit={formik.handleSubmit}>
            {
              editingTitle ?
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
              /> :
              <div>
                <h2>{post.title}</h2>
                <button onClick={() => setEditingTitle(true)}>Edit</button>
              </div>
            }
            {
              editingContent ?
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
              /> :
              <div>
                <p>{post.content}</p>
                <button onClick={() => setEditingContent(true)}>Edit</button>
              </div>
            }
            {
              editingTopic ?
              <InputField
              labelText='Topic:'
              inputType='select'
              inputName='topic' inputId='topic'
              inputValue={formik.values.topic}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.topic}
              touched={formik.touched.topic}
              selectOps={topics}
              /> :
              <div>
                <p>Topic: {post.topic}</p>
                <button onClick={() => setEditingTopic(true)}>Edit</button>
              </div>
            }
            <input type="submit" value='Submit Edit' />
          </form>
          {
            editMessage && <p>{editMessage}</p>
          }
          <button>Save</button>
          <button>Reply</button>
          <button>Edit</button>
          <Link to=''>Edit</Link>
          <button>Delete</button>
        </div> :
        <p>Loading...</p>
      }
    </section>
  );
}
 
export default ExpandedPost;