import { ReactElement } from 'react';

export type ChildProp = {
  children: ReactElement
};

export type UsersContextTypes = {
  loggedInUser: Omit<User, "password"> | null,
  loginUser: (loginData: Pick<User, "email" | "password">) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>
};

export type User = {
  _id: string,
  email: string,
  username: string,
  password: string,
  gender: 'male'| 'female' | 'other',
  role: string,
  avatar?: string
};

export type InputFieldPropTypes = {
  inputType: 'text' | 'email' | 'password' | 'checkbox' | 'radio' | 'url',
  inputName: string,
  inputId: string,
  inputValue: string,
  inputOnChange: React.ChangeEventHandler<HTMLInputElement>,
  inputOnBlur: React.FocusEventHandler<HTMLInputElement>,
  labelHtmlFor: string,
  labelText: string,
  errors: string | undefined,
  touched: boolean | undefined
};