import { ReactElement } from 'react';

export type ChildProp = {
  children: ReactElement
};

export type UsersContextTypes = {
  loggedInUser: Omit<User, "password">
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