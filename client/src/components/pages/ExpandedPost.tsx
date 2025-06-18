import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { Post, PostsContextTypes, UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";
import PostsContext from "../contexts/PostsContext";
import UsersContext from "../contexts/UsersContext";

const ExpandedPost = () => {

  const { id } = useParams();
  const { editPost, deletePost } = useContext(PostsContext) as PostsContextTypes;
  const { decodeUserFromToken, savePost } = useContext(UsersContext) as UsersContextTypes;
  const [post, setPost] = useState<Post | null>(null);
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [saveBtnText, setSaveBtnText] = useState('Save')
  const decodedUser = decodeUserFromToken();
  const navigate = useNavigate();

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
      if(!post?._id){
        setEditMessage(`Failed to retrieve Post ID.`);
        throw new Error(`Failed to retrieve Post ID.`);
      };
      const Response = await editPost(values, post?._id);
      if('error' in Response){
        setEditMessage('Editing failed.');
        throw new Error('Editing failed.');
      };
      // updated post state with modified fields
      setPost(prevPost => prevPost ? { ...prevPost, ...values } : prevPost);

      setEditMessage('Edit successful.');

      setEditingTitle(false);
      setEditingContent(false);
      setEditingTopic(false);

      setTimeout(() => {
        setEditMessage('');
      }, 2000);
    }
  });

  const deleteHandler = () => {
    if(!post?._id){
      setDeleteMessage(`Failed to retrieve Post ID.`);
      throw new Error(`Failed to retrieve Post ID.`);
    };
    deletePost(post?._id);
    setDeleteMessage('Post was successfully deleted.');
    setTimeout(() => {
      setDeleteMessage('');
      navigate('/');
    }, 2000);
  };

  const savePostHandler = async () => {
    if(!post?._id){
      setDeleteMessage(`Failed to retrieve Post ID.`);
      throw new Error(`Failed to retrieve Post ID.`);
    };
    if(!decodedUser?.savedPosts.includes(post._id)){
      setSaveBtnText('Save');
      const response = await savePost(post._id);
  
      if('error' in response){
        setSaveBtnText('Failed');
        throw new Error('Editing failed.');
      };
      setSaveBtnText('Unsave');
    };
  };

  // update the save button text whether the post is already saved or not
  useEffect(() => {
    if(post && decodedUser){
      setSaveBtnText(decodedUser.savedPosts.includes(post._id) ? "Unsave" : "Save");
    };
  }, [post, decodedUser]);


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
        deleteMessage ?
        <h2>{deleteMessage}</h2> :
        post ?
        <div>
          <div className="score">
            {
              decodedUser && 
              <button>🔼</button>
            }
            <p>Score: {post.score}</p>
            {
              decodedUser && 
              <button>🔽</button>
            }
          </div>
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
                {
                  decodedUser && post.postedBy.userId === decodedUser._id &&
                  <button onClick={() => setEditingTitle(true)}>Edit</button>
                }
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
                {
                  decodedUser && post.postedBy.userId === decodedUser._id &&
                  <button onClick={() => setEditingContent(true)}>Edit</button>
                }
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
                {
                  decodedUser && post.postedBy.userId === decodedUser._id &&
                  <button onClick={() => setEditingTopic(true)}>Edit</button>
                }
              </div>
            }
            {
              decodedUser &&
              <div>
                <button>Reply</button>
                <button type="button" onClick={savePostHandler}>{saveBtnText}</button>
                {
                  post.postedBy.userId === decodedUser._id &&
                  <>
                    <input type="submit" value='Complete Edit' />
                    <button onClick={deleteHandler}>Delete</button>
                  </>
                }
              </div>
            }
          </form>
          {
            editMessage && <p>{editMessage}</p>
          }
        </div> :
        <p>Loading...</p>
      }
    </section>
  );
}
 
export default ExpandedPost;