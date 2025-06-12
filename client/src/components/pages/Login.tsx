import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import { User, UsersContextTypes } from '../../types';
import InputField from '../UI/molecules/InputField';
import UsersContext from '../contexts/UsersContext';

const Login = () => {

  const navigate = useNavigate();
  const { loginUser } = useContext(UsersContext) as UsersContextTypes;
  const [loginMessage, setLoginMessage] = useState('');
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
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Password must have: lower case character, upper case character, number, special symbol, 8-20 symbols long.')
        .required('Enter a password.')
        .trim()
    }),
    onSubmit: async (values) => {
      const Response = await loginUser(values, stayLoggedIn);
      if('error' in Response){
        // !!!! add error message on site as well
        setLoginMessage(Response.error ?? 'Unsuccessful login.');
        throw new Error('Unsuccessful login.');
      };
      // success message and navigate
      setLoginMessage(Response.success);
      setTimeout(() => navigate('/'), 2000);
      // navigate('/');
    }
  });

  return (
    <section>
      <h2>Login</h2>
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
          inputPlaceholder={'Enter an email...'}
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
        <div>
          <div>
            <input
              type='checkbox'
              name='stayLoggedIn' id='stayLoggedIn'
              onChange={() => {setStayLoggedIn(!stayLoggedIn)}}
            />
            <label htmlFor='stayLoggedIn'>Stay Logged In</label>
          </div>
        </div>
        <input type="submit" value='Login' />
      </form>
      {
        loginMessage && <p>{loginMessage}</p>
      }
    </section>
  );
}
 
export default Login;