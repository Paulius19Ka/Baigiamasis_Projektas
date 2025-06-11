import { ReactElement } from 'react';

export type ChildProp = {
  children: ReactElement
};

export type UsersContextTypes = {
  loggedInUser: Omit<User, "password"> | null,
  loginUser: (userData: Pick<User, "email" | "password">, stayLoggedIn: boolean) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  logoutUser: () => void,
  registerUser: (userData: Omit<User, "_id">, stayLoggedIn: boolean) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  decodeUserFromToken: () => Omit<User, "_id" | "password" | "role"> | null,
  getUserId: () => Promise<{
    error: string;
    id?: undefined;
  } | {
    id: string;
    error?: undefined;
  }>,
  editUser: (userData: Omit<User, "_id" | "role">, id: string) => Promise<{
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
  role: 'admin' | 'user',
  avatar: string
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