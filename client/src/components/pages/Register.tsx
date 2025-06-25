import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { User, UsersContextTypes } from '../../types';
import InputField from '../UI/molecules/InputField';
import UsersContext from '../contexts/UsersContext';
import { genders } from '../../dynamicVariables';
import styled from 'styled-components';
import ButtonComponent from '../UI/atoms/ButtonComponent';

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

        > input{
          padding: 10px 20px;
          background-color: var(--background-dark);
          border: none;
          font-size: 1rem;
          transition: var(--transition-main);

          &::placeholder{
            color: var(--modal-background);
          }

          &:hover{
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
`;

const Register = () => {

  const navigate = useNavigate();
  const { registerUser, setJustLoggedIn } = useContext(UsersContext) as UsersContextTypes;
  const [registerMessage, setRegisterMessage] = useState('');
  const [registerMsgType, setRegisterMsgType] = useState<'success' | 'error' | ''>('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [rulesAggreed, setRulesAggreed] = useState(false);

  const initValues: Omit<User, '_id'> & { passwordConfirm: string }= {
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    gender: 'other',
    avatar: '',
    role: 'user',
    savedPosts: [],
    likedPosts: [],
    dislikedPosts: []
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
      password: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Min 8 chars: upper, lower, number, symbol.')
        .required('Enter a password.')
        .trim(),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match.')
        .required('Confirm password.')
        .trim(),
      avatar: Yup.string()
        .url('Enter a valid url.')
        .matches(/\.(jpg|jpeg|png)$/, 'Enter a valid image url. Format: jpg, jpeg, png.')
        .trim()
    }),
    onSubmit: async (values) => {
      const Response = await registerUser(values, stayLoggedIn);
      if('error' in Response){
        // !!!! add error message on site as well
        setRegisterMsgType('error');
        setRegisterMessage(Response.error ?? 'Unsuccessful register.');
        throw new Error('Unsuccessful register.');
      };
      setJustLoggedIn(true);
      // success message and navigate
      setRegisterMsgType('success');
      setRegisterMessage(Response.success);
      setTimeout(() => {
        navigate('/');
        setJustLoggedIn(false);
      }, 2000);
      // navigate('/');
    }
  });

  useEffect(() => {
    document.title = `Register \u2666 MusicForum`;
  }, []);

  return (
    <StyledSection>
      <h2>Register</h2>
      <Link to='/rules'>Read forum rules.</Link>
      <form onSubmit={formik.handleSubmit}>
        <InputField
          labelText='Email'
          inputType='email'
          inputName='email' inputId='email'
          inputValue={formik.values.email}
          inputOnChange={formik.handleChange}
          inputOnBlur={formik.handleBlur}
          errors={formik.errors.email}
          touched={formik.touched.email}
          inputPlaceholder={'yourEmail@mail.com'}
        />
        <InputField
          labelText='Username'
          inputType='text'
          inputName='username' inputId='username'
          inputValue={formik.values.username}
          inputOnChange={formik.handleChange}
          inputOnBlur={formik.handleBlur}
          errors={formik.errors.username}
          touched={formik.touched.username}
          inputPlaceholder={'Enter a username...'}
        />
        <InputField
          labelText='Password'
          inputType='password'
          inputName='password' inputId='password'
          inputValue={formik.values.password}
          inputOnChange={formik.handleChange}
          inputOnBlur={formik.handleBlur}
          errors={formik.errors.password}
          touched={formik.touched.password}
          inputPlaceholder={'Enter a password...'}
        />
        <InputField
          labelText='Confirm Password'
          inputType='password'
          inputName='passwordConfirm' inputId='passwordConfirm'
          inputValue={formik.values.passwordConfirm}
          inputOnChange={formik.handleChange}
          inputOnBlur={formik.handleBlur}
          errors={formik.errors.passwordConfirm}
          touched={formik.touched.passwordConfirm}
          inputPlaceholder={'Confirm the password...'}
        />
        <InputField
          labelText='Gender'
          inputType='radio'
          inputName='gender' inputId='gender'
          inputValue={formik.values.gender}
          inputOnChange={formik.handleChange}
          inputOnBlur={formik.handleBlur}
          errors={formik.errors.gender}
          touched={formik.touched.gender}
          inputPlaceholder={'Enter Your gender...'}
          radioOps={genders}
        />
        <InputField
          labelText='Avatar'
          inputType='url'
          inputName='avatar' inputId='avatar'
          inputValue={formik.values.avatar}
          inputOnChange={formik.handleChange}
          inputOnBlur={formik.handleBlur}
          errors={formik.errors.avatar}
          touched={formik.touched.avatar}
          inputPlaceholder={'Enter an avatar url...'}
        />
        <div className='checkbox'>
          <div>
            <input
              type='checkbox'
              name='acceptRules' id='acceptRules'
              onChange={() => setRulesAggreed(!rulesAggreed)}
            />
            <label htmlFor='acceptRules'>I aggree to the rules of the forum</label>
          </div>
          <div>
            <input
              type='checkbox'
              name='stayLoggedIn' id='stayLoggedIn'
              onChange={() => {setStayLoggedIn(!stayLoggedIn)}}
            />
            <label htmlFor='stayLoggedIn'>Stay logged in after registration</label>
          </div>
        </div>
        {
          rulesAggreed ?
          <ButtonComponent type='submit'>Register</ButtonComponent> :
          <ButtonComponent isDisabled={true} type='submit'>Register</ButtonComponent>
        }
      </form>
      {
        registerMessage && <p className={`message-${registerMsgType}`}>{registerMessage}</p>
      }
      <p className='redirect'>Already have an account? Click <Link to='/login'>here to login</Link>.</p>
    </StyledSection>
  );
}
 
export default Register;