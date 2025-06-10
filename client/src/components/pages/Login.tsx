import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { User } from '../../types';
import InputField from '../UI/molecules/InputField';

const Login = () => {

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
    onSubmit: (values) => {
      console.log(values);
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
        />
        <input type="submit" value='Login' />
      </form>
    </section>
  );
}
 
export default Login;