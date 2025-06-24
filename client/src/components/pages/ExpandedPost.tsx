import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { Post, PostsContextTypes, RepliesContextTypes, UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";
import PostsContext from "../contexts/PostsContext";
import UsersContext from "../contexts/UsersContext";
import RepliesContext from "../contexts/RepliesContext";
import ReplyCard from "../UI/molecules/ReplyCard";
import Modal from "../UI/atoms/Modal";

const ExpandedPost = () => {

  const { id } = useParams();
  const { editPost, deletePost, scorePost } = useContext(PostsContext) as PostsContextTypes;
  const { decodeUserFromToken, savePost } = useContext(UsersContext) as UsersContextTypes;
  const { replies, fetchReplies, postReply, loading, clearReplies } = useContext(RepliesContext) as RepliesContextTypes;
  const [post, setPost] = useState<Post | null>(null);
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [saveBtnText, setSaveBtnText] = useState('Save');
  const [postingReply, setPostingReply] = useState(false);
  const [postReplyMessage, setPostReplyMessage] = useState('');
  const decodedUser = decodeUserFromToken();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

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

  const formikReply = useFormik({
    initialValues: {
      reply: ''
    },
    validationSchema: Yup.object({
      reply: Yup.string()
        .min(10, 'The reply must be longer than 10 symbols.')
        .max(1000, 'The reply must be shorter than 1000 symbols.')
        .required('Enter the reply')
    }),
    onSubmit: async (values) => {
      if(!post?._id){
        setPostReplyMessage(`Failed to retrieve Post ID.`);
        throw new Error(`Failed to retrieve Post ID.`);
      };
      if(!decodedUser?._id){
        setPostReplyMessage(`Failed to retrieve user ID.`);
        throw new Error(`Failed to retrieve user ID.`);
      };

      const Response = await postReply(values, decodedUser._id, post._id);
      if('error' in Response){
        setPostReplyMessage('Failed to post a new reply.');
        throw new Error('Failed to post a new reply.');
      };
      setPostReplyMessage('Successfully posted a reply.');
      setPostingReply(false);
      formikReply.resetForm();
    }
  });

  const deleteHandler = () => {
    if(!post?._id){
      setDeleteMessage(`Failed to retrieve Post ID.`);
      throw new Error(`Failed to retrieve Post ID.`);
    };
    deletePost(post?._id);
    setDeleteMessage('Post was successfully deleted.');
    clearReplies();
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

    const isPostSaved = decodedUser?.savedPosts.includes(post._id);
    const response = await savePost(post._id, !isPostSaved);

    if('error' in response){
      setSaveBtnText('Failed');
      throw new Error(`${isPostSaved ? 'Unsave' : 'Save'} failed.`);
    };

    const updatedUser = decodeUserFromToken();
    const isNowSaved = updatedUser?.savedPosts.includes(post._id);
    setSaveBtnText(isNowSaved ? 'Unsave' : 'Save');

  };

  const replyPostHandler = async () => {
    if(!postingReply){
      setPostingReply(true);
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
    if(id){
      fetch(`http://localhost:5500/posts/${id}`)
        .then(res => res.json())
        .then(data => {
          setPost(data);
          fetchReplies(id);
        });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <section>
      {
        deleteMessage ?
        <h2>{deleteMessage}</h2> :
        post ?
        <div className="postWrapper">
          <div className="score">
            {
              decodedUser && 
              <button onClick={() => scorePost(post._id, '+1')}>🔼</button>
            }
            <p>Score: {post.score}</p>
            {
              decodedUser && 
              <button onClick={() => scorePost(post._id, '-1')}>🔽</button>
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
                <button type="button" onClick={replyPostHandler}>Reply</button>
                <button type="button" onClick={savePostHandler}>{saveBtnText}</button>
                {
                  post.postedBy.userId === decodedUser._id &&
                  <>
                    {
                      editingTitle || editingContent || editingTopic ?
                      // <input type="submit" value='Complete Edit' />
                      <>
                        <button  type="button" onClick={() => setShowEditModal(true)}>Complete Edit</button>
                        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
                          <h2>Are you sure you want to edit the post?</h2>
                          <div>
                            <button
                              type='submit'
                              onClick={() => {
                                formik.handleSubmit();
                                setShowEditModal(false);
                              }}
                            >Yes</button>
                            <button type="button" onClick={() => setShowEditModal(false)}>No</button>
                          </div>
                        </Modal>
                      </> :
                      null
                    }
                    <button  type="button" onClick={() => setShowDeleteModal(true)}>Delete</button>
                    <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                      <h2>Are you sure you want to delete this post?</h2>
                      <div>
                        <button type="button" onClick={deleteHandler}>Yes</button>
                        <button type="button" onClick={() => setShowDeleteModal(false)}>No</button>
                      </div>
                    </Modal>
                  </>
                }
              </div>
            }
          </form>
          {
            editMessage && <p>{editMessage}</p>
          }
          {
            postingReply &&
            <div>
              <form onSubmit={formikReply.handleSubmit}>
                <InputField
                  labelText='Reply:'
                  inputType='text'
                  inputName='reply' inputId='reply'
                  inputValue={formikReply.values.reply}
                  inputOnChange={formikReply.handleChange}
                  inputOnBlur={formikReply.handleBlur}
                  errors={formikReply.errors.reply}
                  touched={formikReply.touched.reply}
                  inputPlaceholder={'Enter a reply...'}
                />
                <button  type="button" onClick={() => setShowReplyModal(true)}>Post Reply</button>
                <Modal isOpen={showReplyModal} onClose={() => setShowReplyModal(false)}>
                  <h2>Are you sure you want to post a reply?</h2>
                  <div>
                    <button
                      type='submit'
                      onClick={() => {
                        formikReply.handleSubmit();
                        setShowReplyModal(false);
                      }}
                    >Yes</button>
                    <button type="button" onClick={() => setShowReplyModal(false)}>No</button>
                  </div>
                </Modal>
              </form>
              {
                postReplyMessage && <p>{postReplyMessage}</p>
              }
            </div>
          }
        </div> :
        <p>Loading...</p>
      }
      {
        post ?
        (
          loading ?
          <p>Loading replies...</p> :
          replies.length ?
          <div className="repliesWrapper">
            {
              replies.map(reply => 
                <ReplyCard
                  key={reply.replyId}
                  reply={reply}
                  decodedUser={decodedUser}
                  postId={post._id}
                />
              )
            }
          </div> :
          <p>No replies.</p>
        ) : null
      }
    </section>
  );
}
 
export default ExpandedPost;