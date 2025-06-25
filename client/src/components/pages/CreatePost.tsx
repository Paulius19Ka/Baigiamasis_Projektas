import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';

import UsersContext from "../contexts/UsersContext";
import { Post, PostsContextTypes, UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";
import PostsContext from "../contexts/PostsContext";
import Modal from "../UI/atoms/Modal";
import styled from "styled-components";
import ButtonComponent from "../UI/atoms/ButtonComponent";

const StyledSection = styled.section`
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  > h2{
    margin: 0;
    font-size: 1.6rem;
  }

  > p{
    margin: 0;
    font-size: 1rem;
  }

  > form{
    display: flex;
    flex-direction: column;
    gap: 10px;

    min-width: 260px;

    > div{
      min-height: 85px;

      > p{
        margin: 0;
        color: var(--message-error);
        font-size: 0.8rem;
      }

      > div{
        display: flex;
        flex-direction: column;

        > input, textarea, select{
          padding: 10px 20px;
          background-color: var(--background-dark);
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          transition: var(--transition-main);

          &::placeholder{
            color: var(--modal-background);
          }

          &:hover{
            color: var(--font-main);
            background-color: var(--modal-background);

            &::placeholder{
              color: var(--background-dark);
            }
          }
          
          &:focus{
            background-color: var(--modal-background);
            outline: none;

            &::placeholder{
              color: var(--background-dark);
            }
          }
        }

        > select{

          &:hover{
            background-color: var(--background-dark);
          }

          &:focus{
            background-color: var(--background-dark);
            outline: none;
  
            &::placeholder{
              color: var(--background-dark);
            }
          }
        }

      }
    }

    > div:nth-child(2){
      min-height: 160px;
    }

    > button{
      align-self: center;
    }
  }

  > p{
    margin: 0;
  }

  > p.message-success{
    font-size: 0.8rem;
    color: var(--message-success);
  }

  > p.message-error{
    font-size: 0.8rem;
    color: var(--message-error);
  }

  > p.redirect{
    
    > a{
      color: var(--accent-main);
      transition: var(--transition-main);

      &:hover{
        color: var(--accent-hover);
      }

      &:active{
        color: var(--accent-active);
      }
    }
  }

  > a{
    color: var(--accent-main);
    transition: var(--transition-main);

    &:hover{
      color: var(--accent-hover);
    }

    &:active{
      color: var(--accent-active);
    }
  }
`;

const CreatePost = () => {

  const { decodeUserFromToken, getUserId } = useContext(UsersContext) as UsersContextTypes;
  const { createPost } = useContext(PostsContext) as PostsContextTypes;
  const decodedUser = decodeUserFromToken();
  const [userId, setUserId] = useState<string | null>(null);
  const [postMessage, setPostMessage] = useState('');
  const [postMsgType, setPostMsgType] = useState<'success' | 'error' | ''>('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = `New Post \u2666 MusicForum`;
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
        .min(5, 'Must be longer than 5 symbols.')
        .max(100, 'Must be shorter than 100 symbols.')
        .required('Enter the title.'),
      content: Yup.string()
        .min(20, 'Must be longer than 20 symbols.')
        .max(2000, 'Must be shorter than 2000 symbols.')
        .required('Enter the post description'),
      topic: Yup.string()
        .oneOf(topics, 'Invalid topic selected.')
        .required('A topic must be selected.')
    }),
    onSubmit: async (values) => {
      if(!userId){
        setPostMsgType('error');
        setPostMessage('Failed to retrieve ID.');
        throw new Error('Failed to retrieve ID.');
      };

      const Response = await createPost(values, userId);
      if('error' in Response){
        setPostMsgType('error');
        setPostMessage('Failed to create new thread.');
        throw new Error('Failed to create new thread.');
      };
      setPostMsgType('success');
      setPostMessage('Successfully created a new thread.');
      setTimeout(() => navigate('/'), 2000);
    }
  })

  return (
    <StyledSection>
      {
        decodedUser ?
        <>
          <h2>Create a new thread</h2>
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
              selectOps={topics}
            />
            <ButtonComponent isDisabled={!!Object.keys(formik.errors).length} type="button" onClick={() => setShowModal(true)}>Submit Post</ButtonComponent>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <h2>Are you sure you want to submit post?</h2>
              <div>
                <button
                  type='submit'
                  onClick={() => {
                    formik.handleSubmit();
                    setShowModal(false);
                  }}
                >Yes</button>
                <button type="button" onClick={() => setShowModal(false)}>No</button>
              </div>
            </Modal>
          </form>
          {
            postMessage && <p className={`message-${postMsgType}`}>{postMessage}</p>
          }
        </> :
        <>
          <p className='redirect'>Please <Link to='/login'>login</Link> or <Link to='/register'>register</Link> to create a new thread.</p>
        </>
      }
    </StyledSection>
  );
}
 
export default CreatePost;