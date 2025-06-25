import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { User, UsersContextTypes } from '../../types';
import InputField from '../UI/molecules/InputField';
import UsersContext from '../contexts/UsersContext';
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
          color: var(--font-main);
          padding: 10px 20px;
          background-color: var(--background-dark);
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          transition: var(--transition-main);

          &::placeholder{
            color: var(--button-main);
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
        justify-content: center;
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
`;

const Login = () => {

  const navigate = useNavigate();
  const { loginUser, setJustLoggedIn } = useContext(UsersContext) as UsersContextTypes;
  const [loginMessage, setLoginMessage] = useState('');
  const [loginMsgType, setLoginMsgType] = useState<'success' | 'error' | ''>('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const initValues: Pick<User, 'email' | 'password'> = {
    email: '',
    password: ''
  }

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Enter a valid email.')
        .min(5, 'Email must be longer than 5 symbols.')
        .max(40, 'Email must be shorter than 40 symbols.')
        .required('Enter an email.')
        .trim(),
      password: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Min 8 chars: upper, lower, number, symbol.')
        .required('Enter a password.')
        .trim()
    }),
    onSubmit: async (values) => {
      const Response = await loginUser(values, stayLoggedIn);
      if('error' in Response){
        // !!!! add error message on site as well
        setLoginMsgType('error');
        setLoginMessage(Response.error ?? 'Unsuccessful login.');
        throw new Error('Unsuccessful login.');
      };
      setJustLoggedIn(true);
      // success message and navigate
      setLoginMsgType('success');
      setLoginMessage(Response.success);
      setTimeout(() => {
        navigate('/');
        setJustLoggedIn(false);
      }, 2000);
      // navigate('/');
    }
  });

  useEffect(() => {
    document.title = `Login \u2666 MusicForum`;
  }, []);

  return (
    <StyledSection>
      <h2>Login</h2>
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
          inputPlaceholder={'Enter an email...'}
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
        <div className='checkbox'>
          <div>
            <input
              type='checkbox'
              name='stayLoggedIn' id='stayLoggedIn'
              onChange={() => {setStayLoggedIn(!stayLoggedIn)}}
            />
            <label htmlFor='stayLoggedIn'>Stay logged in</label>
          </div>
        </div>
        <ButtonComponent type='submit'>Login</ButtonComponent>
      </form>
      {
        loginMessage && <p className={`message-${loginMsgType}`}>{loginMessage}</p>
      }
      <p className='redirect'>Don't have an account? Click <Link to='/register'>here to register</Link>.</p>
    </StyledSection>
  );
}
 
export default Login;