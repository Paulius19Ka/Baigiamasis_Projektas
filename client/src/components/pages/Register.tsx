import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { User, UsersContextTypes } from '../../types';
import InputField from '../UI/molecules/InputField';
import UsersContext from '../contexts/UsersContext';
import { genders } from '../../dynamicVariables';


const Register = () => {

  const navigate = useNavigate();
  const { registerUser } = useContext(UsersContext) as UsersContextTypes;
  const [registerMessage, setRegisterMessage] = useState('');
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
    savedPosts: []
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
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Password must have: lower case character, upper case character, number, special symbol, 8-20 symbols long.')
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
        setRegisterMessage(Response.error ?? 'Unsuccessful register.');
        throw new Error('Unsuccessful register.');
      };
      // success message and navigate
      setRegisterMessage(Response.success);
      setTimeout(() => navigate('/'), 2000);
      // navigate('/');
    }
  });

  return (
    <section>
      <h2>Register</h2>
      <Link to='/rules'>Read forum rules.</Link>
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
          inputPlaceholder={'yourEmail@mail.com'}
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
          inputPlaceholder={'Enter a username...'}
        />
        <InputField
          labelText='Password:'
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
          labelText='Confirm Password:'
          inputType='password'
          inputName='passwordConfirm' inputId='passwordConfirm'
          inputValue={formik.values.passwordConfirm}
          inputOnChange={formik.handleChange}
          inputOnBlur={formik.handleBlur}
          errors={formik.errors.passwordConfirm}
          touched={formik.touched.passwordConfirm}
          inputPlaceholder={'Confirm the password...'}
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
          inputPlaceholder={'Enter Your gender...'}
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
          inputPlaceholder={'Enter an avatar url...'}
        />
        <div>
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
          <input type="submit" value='Register' /> :
          <input disabled type="submit" value='Register' />
        }
      </form>
      {
        registerMessage && <p>{registerMessage}</p>
      }
      <p>Already have an account? Click <Link to='/login'>here to login</Link>.</p>
    </section>
  );
}
 
export default Register;