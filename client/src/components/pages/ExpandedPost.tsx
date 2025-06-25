import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';
import styled from "styled-components";

import { Post, PostsContextTypes, RepliesContextTypes, UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";
import PostsContext from "../contexts/PostsContext";
import UsersContext from "../contexts/UsersContext";
import RepliesContext from "../contexts/RepliesContext";
import ReplyCard from "../UI/molecules/ReplyCard";
import Modal from "../UI/atoms/Modal";
import FourZeroFour from "./FourZeroFour";
import DateFormat from "../UI/atoms/DateFormat";
import { formatScore } from "../../helpers";

// ICONS
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const StyledSection = styled.section`
  /* padding: 10px; */
  > div.postWrapper{
    display: flex;
    flex-direction: column;
    gap: 20px;

    /* border: 1px solid var(--background-darker); */
    background-color: var(--background-dark);
    border-radius: 15px;
    padding: 16px;

    > p{
      margin: 0;
    }

    > div.score{
      display: flex;
      align-items: center;
      justify-content: space-between;

      > span{
        font-size: 0.8rem;
        width: 32px;
        height: 32px;
        border: 1px solid var(--accent-main);
        border-radius: 100%;
        background-color: var(--background-main);
        color: var(--accent-main);
        cursor: default;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      > div{
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

    > div.posterInfo{
      align-self: flex-end;

      > span{
        font-size: 0.9rem;
        color: var(--font-hover);
      }
    }

    > form{
      display: flex;
      flex-direction: column;
      gap: 20px;

      > div{
        display: flex;

        > h2{
          color: var(--accent-hover);
          font-size: 1.6rem;
        }

        > p{
          color: var(--font-main);
          margin: 0;
          font-size: 1.1rem;
        }

        > svg{
          color: var(--font-main);
          font-size: 2rem;
          margin-left: auto;
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

        > div{
          display: flex;
          flex-direction: column;

          > input, textarea, select{
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

          > select{
            color: var(--font-main);
            
            &:hover{
              color: var(--font-main);
              background-color: var(--background-darker);
            }

            &:focus{
              background-color: var(--background-darker);
              outline: none;
    
              &::placeholder{
                color: var(--background-dark);
              }
            }
          }
        }
      }

      > div:nth-child(3){

        > p{
          font-size: 1rem;
        }
      }

      > div:nth-child(4){
        gap: 10px;
        justify-content: flex-end;
        
        > svg{
          color: var(--font-main);
          margin-left: unset;
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

    > div.postReply{
      
      > form{
        display: flex;
        flex-direction: column;
        gap: 5px;

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

        > div.replyButtons{
          display: flex;
          align-items: center;
          justify-content: flex-end;

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
    }
  }

  > div.repliesWrapper{
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 10px;
  }

  @media (min-width: 768px){
    padding: 10px 40px;

    > div.postWrapper{
      padding: 24px;

      > div.score{

        > span{
          font-size: 0.9rem;
          width: 40px;
          height: 40px;
          border: 2px solid var(--accent-main);
        }

        > div{

          > span{
            font-size: 1.1rem;
          }

          > span:nth-child(2){
            font-size: 0.9rem;
          }
        }
      }

      > div.posterInfo{

        > span{
          font-size: 1rem;
        }
      }

      > form{
        gap: 30px;

        > div{

          > h2{
            font-size: 1.7rem;
          }

          > p{
            font-size: 1.2rem;
          }

          > div{

            > input, textarea, select, label{
              font-size: 1.1rem;
            }
          }
        }

        > div:nth-child(3){

          > p{
            font-size: 1.1rem;
          }
        }
      }
    }
  }

  > div.repliesWrapper{
    gap: 20px;
    padding-top: 20px;
  }

  @media (min-width: 1024px){

  }
`;

const ExpandedPost = () => {

  const { id } = useParams();
  const { editPost, deletePost, /* scorePost */ } = useContext(PostsContext) as PostsContextTypes;
  const { decodeUserFromToken, savePost, likeOrDislike, postScores } = useContext(UsersContext) as UsersContextTypes;
  const { replies, fetchReplies, postReply, loading, clearReplies } = useContext(RepliesContext) as RepliesContextTypes;
  const [postLoading, setPostLoading] = useState(true);
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

  const likeOrDislikeHandler = async (emoteType: 'like' | 'dislike') => {
    if(!post?._id){
      return null;
    }
    const response = await likeOrDislike(post?._id, emoteType);

    if('error' in response){
      console.error(response.error);
    };
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
    setPostReplyMessage('');
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
      document.title = `${post?.title} \u2666 MusicForum`;
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
        .then(res => {
          if(!res.ok){
            throw new Error('Post was not found.');
          };
          return res.json();
        })
        .then(data => {
          setPost(data);
          fetchReplies(id);
        })
        .finally(() => {
          setPostLoading(false);
        });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if(postLoading){
    return (
      <p>Post Loading...</p>
    )
  };

  if(!post){
    return (
      <FourZeroFour />
    )
  };

  const score = post._id ? postScores[post._id] ?? post.score : post.score ?? 0;

  const alreadyLiked = decodedUser?.likedPosts.includes(post._id);
  const alreadyDisliked = decodedUser?.dislikedPosts.includes(post._id);

  return (
    <StyledSection>
      {
        deleteMessage ?
        <h2>{deleteMessage}</h2> :
        post ?
        <div className="postWrapper">
          <div className="score">
            <span>{formatScore(score)}</span>
            <div>
              <span>Posted {post.postDate ? <DateFormat date={post.postDate} /> : ''}</span>
              {post.lastEditDate && <span><i>Edited {<DateFormat date={post.lastEditDate} />}</i></span>}
            </div>
          </div>
          <div className="posterInfo">
            <span>Posted By: <b>{post.postedBy.username}</b></span>
          </div>
          <form onSubmit={formik.handleSubmit}>
            {
              editingTitle ?
              <InputField
                labelText='Title'
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
                  <EditIcon onClick={() => setEditingTitle(true)}/>
                }
              </div>
            }
            {
              editingContent ?
              <InputField
                labelText='Content'
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
                <>
                  {post.content.split('\n\n').map((par, i) => <p key={i}>{par}</p>)}
                </>
                {
                  decodedUser && post.postedBy.userId === decodedUser._id &&
                  <EditIcon onClick={() => setEditingContent(true)}/>
                }
              </div>
            }
            {
              editingTopic ?
              <InputField
                labelText='Topic'
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
                  <EditIcon onClick={() => setEditingTopic(true)}/>
                }
              </div>
            }
            {
              decodedUser &&
              <div>
                {
                  alreadyLiked ?
                  <ThumbUpAltIcon type="button" onClick={() => likeOrDislikeHandler('like')} /> :
                  <ThumbUpOffAltIcon type="button" onClick={() => likeOrDislikeHandler('like')} />
                }
                {
                  alreadyDisliked ?
                  <ThumbDownAltIcon type="button" onClick={() => likeOrDislikeHandler('dislike')} /> :
                  <ThumbDownOffAltIcon type="button" onClick={() => likeOrDislikeHandler('dislike')} />
                }
                <ReplyIcon type="button" onClick={replyPostHandler}/>
                {
                  saveBtnText === 'Save' ?
                  <FavoriteBorderIcon  type="button" onClick={savePostHandler}/> :
                  <FavoriteIcon  type="button" onClick={savePostHandler}/>
                }
                {
                  post.postedBy.userId === decodedUser._id &&
                  <>
                    <DeleteIcon type="button" onClick={() => setShowDeleteModal(true)}/>
                    {
                      editingTitle || editingContent || editingTopic ?
                      <>
                        <button type= 'button' onClick={() => {
                          setEditingTitle(false);
                          setEditingContent(false);
                          setEditingTopic(false);
                        }}><CancelIcon /></button>
                        <button type="submit">
                          <CheckCircleIcon />
                        </button>
                      </> :
                      null
                    }
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
            <div className="postReply">
              <form onSubmit={formikReply.handleSubmit}>
                <InputField
                  labelText='Reply'
                  inputType='textarea'
                  inputName='reply' inputId='reply'
                  inputValue={formikReply.values.reply}
                  inputOnChange={formikReply.handleChange}
                  inputOnBlur={formikReply.handleBlur}
                  errors={formikReply.errors.reply}
                  touched={formikReply.touched.reply}
                  inputPlaceholder={'Enter a reply...'}
                />
                <div className="replyButtons">
                  <button type= 'button' onClick={() => {
                    setPostingReply(false);
                  }}><CancelIcon /></button>
                  <button type="submit">
                    <CheckCircleIcon />
                  </button>
                </div>
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
    </StyledSection>
  );
}
 
export default ExpandedPost;