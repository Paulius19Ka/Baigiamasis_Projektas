import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import UsersContext from "../contexts/UsersContext";
import { User, UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";
import { useNavigate } from "react-router";

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

  const { decodeUserFromToken, getUserId, editUser, dispatch } = useContext(UsersContext) as UsersContextTypes;
  const decodedUser = decodeUserFromToken();
  // console.log(decodedUser);
  const [userId, setUserId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchId = async () => {
      const res = await getUserId();
      if(res?.id){
        setUserId(res.id);
      };
    };
    fetchId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initValues: Omit<User, '_id' | 'role' | 'password'> & { oldPassword?: string, password?: string, passwordConfirm?: string }= {
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
        // .required('Enter a password.')
        // .when('password', {
        //   is: (val: string) => !!val,
        //   then: (schema) => schema.required('Enter the old password.')
        // })
        .trim(),
      password: Yup.string()
        // .notOneOf([Yup.ref('oldPassword')], 'New password must be different than the old password.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Password must have: lower case character, upper case character, number, special symbol, 8-20 symbols long.')
        // .required('Enter a password.')
        .when('oldPassword', {
          is: (val: string) => !!val,
          then: (schema) => schema.notOneOf([Yup.ref('oldPassword')], 'New password must be different than the old password.')
        })
        .trim(),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match.')
        // .required('Confirm password.')
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
      setEditMessage(Response.success);
      setTimeout(() => navigate('/'), 2000);
      // navigate('/');
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
              inputType='text'
              inputName='gender' inputId='gender'
              inputValue={formik.values.gender}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.gender}
              touched={formik.touched.gender}
              inputPlaceholder={'Edit Your gender...'}
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
            <input type="submit" value="Edit"/>
          </form>
          {
            editMessage && <p>{editMessage}</p>
          }
        </> :
        <>
          <p>No user info...</p>
        </>
      }
    </StyledSection>
  );
}
 
export default UserPage;