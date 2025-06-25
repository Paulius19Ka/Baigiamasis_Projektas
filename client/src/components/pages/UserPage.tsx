import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import UsersContext from "../contexts/UsersContext";
import { User, UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";
import { Link, useNavigate } from "react-router";
import { genders } from "../../dynamicVariables";
import Modal from "../UI/atoms/Modal";
import ButtonComponent from "../UI/atoms/ButtonComponent";

const StyledSection = styled.section`
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  > img{
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 15px;
    }
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

        > input{
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
      }
    }

    > button{
      align-self: center;
    }

    > div.checkbox{
      min-height: unset;

      > div{
        flex-direction: row;
        justify-content: flex-start;
        gap: 5px;

        > input{
          height: 18px;
          width: 18px;
        }
      }
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

  @media (min-width: 768px){
    > img{
      width: 200px;
      height: 200px;
    }
  }

  @media (min-width: 1024px){
    > img{
      width: 250px;
      height: 250px;
    }
  }
`;

const UserPage = () => {

  const { decodeUserFromToken, getUserId, editUser, dispatch } = useContext(UsersContext) as UsersContextTypes;
  const decodedUser = decodeUserFromToken();
  // console.log(decodedUser);
  const [userId, setUserId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [editMsgType, setEditMsgType] = useState<'success' | 'error' | ''>('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = `User Area \u2666 MusicForum`;
    const fetchId = async () => {
      const res = await getUserId();
      if(res?.id){
        setUserId(res.id);
      };
    };
    fetchId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initValues: Omit<User, '_id' | 'role' | 'password' | 'savedPosts' | 'likedPosts' | 'dislikedPosts'> & { oldPassword?: string, password?: string, passwordConfirm?: string }= {
    email: decodedUser?.email || '',
    username: decodedUser?.username || '',
    oldPassword: '',
    password: '',
    passwordConfirm: '',
    gender: decodedUser?.gender || 'other',
    avatar: decodedUser?.avatar || ''
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Enter a valid email.')
        .min(5, 'Email must be longer than 5 symbols.')
        .max(40, 'Email must be shorter than 40 symbols.')
        .required('Enter an email.')
        .trim(),
      username: Yup.string()
        .min(5, 'Username must be longer than 5 symbols.')
        .max(20, 'Username must be shorter than 20 symbols.')
        .required('Enter a username.')
        .trim(),
      oldPassword: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Min 8 chars: upper, lower, number, symbol.')
        .trim(),
      password: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Min 8 chars: upper, lower, number, symbol.')
        .when('oldPassword', {
          is: (val: string) => !!val,
          then: (schema) => schema.notOneOf([Yup.ref('oldPassword')], 'Enter a different password.')
        })
        .trim(),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match.')
        .when('password', {
          is: (val: string) => !!val,
          then: (schema) => schema.required('Confirm password.')
        })
        .trim(),
      avatar: Yup.string()
        .url('Enter a valid url.')
        .matches(/\.(jpg|jpeg|png)$/, 'Enter a valid image url. Format: jpg, jpeg, png.')
        .trim()
    }),
    onSubmit: async (values) => {
      if(!userId){
        setEditMsgType('error');
        setEditMessage('Failed to retrieve ID.');
        throw new Error('Failed to retrieve ID.');
      };

      type EditableUser = Omit<User, '_id' | 'role'>;
      const filteredValues: Partial<EditableUser> & {
        oldPassword?: string,
        password?: string
      } = { ...values };
      
      if('passwordConfirm' in filteredValues){
        delete filteredValues.passwordConfirm;
      };

      if(!filteredValues.oldPassword){
        delete filteredValues.oldPassword;
      };
      if(!filteredValues.password){
        delete filteredValues.password;
      };
      const finalValues = filteredValues as EditableUser;

      const Response = await editUser(finalValues, userId);
      if('error' in Response){
        // !!!! add error message on site as well
        setEditMsgType('error');
        setEditMessage(Response.error ?? 'Unsuccessful edit.');
        throw new Error('Unsuccessful edit.');
      };

      // refresh the user data after submiting form, if updated user is null, return the default object
      const updatedUser = decodeUserFromToken() ?? ({
        _id: 'default-id',
        role: 'user',
        email: '',
        username: '',
        gender: 'other',
        avatar: ''
      } as Omit<User, "password">);
      dispatch({ type: 'setUser', userData: updatedUser as Omit<User, 'password'> });

      // success message and navigate
      setEditMsgType('success');
      setEditMessage(Response.success);
      setTimeout(() => navigate('/'), 2000);
    }
  });

  return (
    <StyledSection>
      {
        decodedUser ?
        <>
          <h2>User Info</h2>
          {
            decodedUser?.avatar ?
            <img src={decodedUser?.avatar} alt={decodedUser?.username} /> :
            <img src="https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg" alt="placeholder image, when no avatar available" />
          }
          <form onSubmit={formik.handleSubmit}>
            <InputField
              labelText='Email:'
              inputType='email'
              inputName='email' inputId='email'
              inputValue={formik.values.email}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.email}
              touched={formik.touched.email}
              inputPlaceholder={'Edit Your email...'}
            />
            <InputField
              labelText='Username:'
              inputType='text'
              inputName='username' inputId='username'
              inputValue={formik.values.username}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.username}
              touched={formik.touched.username}
              inputPlaceholder={'Edit Your username...'}
            />
            <InputField
              labelText='Old Password:'
              inputType='password'
              inputName='oldPassword' inputId='oldPassword'
              inputValue={formik.values.oldPassword ?? ''}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.oldPassword}
              touched={formik.touched.oldPassword}
              inputPlaceholder={'Enter Your old password...'}
            />
            <InputField
              labelText='Password:'
              inputType='password'
              inputName='password' inputId='password'
              inputValue={formik.values.password ?? ''}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.password}
              touched={formik.touched.password}
              inputPlaceholder={'Edit Your new password...'}
            />
            <InputField
              labelText='Confirm Password:'
              inputType='password'
              inputName='passwordConfirm' inputId='passwordConfirm'
              inputValue={formik.values.passwordConfirm ?? ''}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.passwordConfirm}
              touched={formik.touched.passwordConfirm}
              inputPlaceholder={'Confirm the new password...'}
            />
            <InputField // !!! needs to be radio or select
              labelText='Gender:'
              inputType='radio'
              inputName='gender' inputId='gender'
              inputValue={formik.values.gender}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.gender}
              touched={formik.touched.gender}
              inputPlaceholder={'Edit Your gender...'}
              radioOps={genders}
            />
            <InputField
              labelText='Avatar:'
              inputType='url'
              inputName='avatar' inputId='avatar'
              inputValue={formik.values.avatar}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.avatar}
              touched={formik.touched.avatar}
              inputPlaceholder={'Enter a new avatar url...'}
            />
            <ButtonComponent isDisabled={!!Object.keys(formik.errors).length} type="button" onClick={() => setShowModal(true)}>Edit</ButtonComponent>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <h2>Are you sure you want to edit user details?</h2>
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
            editMessage && <p className={`message-${editMsgType}`}>{editMessage}</p>
          }
        </> :
        <>
          <p>Please <Link to='/login'>login</Link> or <Link to='/register'>register</Link> to access this page.</p>
        </>
      }
    </StyledSection>
  );
}
 
export default UserPage;