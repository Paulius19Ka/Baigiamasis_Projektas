import { useContext } from "react";
import styled from "styled-components";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import UsersContext from "../contexts/UsersContext";
import { User, UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;

  > img{
    width: 150px;
    height: 150px;
    object-fit: cover;
  }
`;

const UserPage = () => {

  const { decodeUserFromToken } = useContext(UsersContext) as UsersContextTypes;
  const decodedUser = decodeUserFromToken();
  // console.log(decodedUser);

  const initValues: Omit<User, '_id' | 'role'> & { oldPassword: string, passwordConfirm: string }= {
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
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Password must have: lower case character, upper case character, number, special symbol, 8-20 symbols long.')
        .required('Enter a password.')
        .trim(),
      password: Yup.string()
        .notOneOf([Yup.ref('oldPassword')], 'New password must be different than the old password.')
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
      console.log(values);
    }
  });

  return (
    <StyledSection>
      {
        decodedUser ?
        <>
          <h2>User Info</h2>
          <span>Email: {decodedUser?.email}</span>
          <span>Username: {decodedUser?.username}</span>
          <span>Gender: {decodedUser?.gender}</span>
          <span>Password: ****</span>
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
            />
            <InputField
              labelText='Old Password:'
              inputType='password'
              inputName='oldPassword' inputId='oldPassword'
              inputValue={formik.values.oldPassword}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.oldPassword}
              touched={formik.touched.oldPassword}
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
            <InputField
              labelText='Confirm Password:'
              inputType='password'
              inputName='passwordConfirm' inputId='passwordConfirm'
              inputValue={formik.values.passwordConfirm}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.passwordConfirm}
              touched={formik.touched.passwordConfirm}
            />
            <InputField // !!! needs to be radio or select
              labelText='Gender:'
              inputType='text'
              inputName='gender' inputId='gender'
              inputValue={formik.values.gender}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.gender}
              touched={formik.touched.gender}
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
            />
            <input type="submit" value="Update"/>
          </form>
        </> :
        <>
          <p>No user info...</p>
        </>
      }
    </StyledSection>
  );
}
 
export default UserPage;