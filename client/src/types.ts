import { ReactElement } from 'react';

export type ChildProp = {
  children: ReactElement
};

// USER

export type UsersContextActionTypes = 
{ type: 'setUser', userData: Omit<User, 'password'> } |
{ type: 'logoutUser' } |
{ type: 'registerUser', userData: Omit<User, 'password'> };

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
  }>,
  dispatch: React.ActionDispatch<[action: UsersContextActionTypes]>
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

// INPUT FIELD

export type InputFieldPropTypes = {
  inputType: 'text' | 'email' | 'password' | 'checkbox' | 'radio' | 'url' | 'textarea',
  inputName: string,
  inputId: string,
  inputValue: string,
  inputOnChange: React.ChangeEventHandler<HTMLInputElement>,
  inputOnBlur: React.FocusEventHandler<HTMLInputElement>,
  labelHtmlFor: string,
  labelText: string,
  errors: string | undefined,
  touched: boolean | undefined,
  inputPlaceholder: string | ''
};

// POSTS

export type PostsContextReducerActionTypes =
{ type: 'setPosts', data: Post[] };

export type PostsContextTypes = {
  posts: Post[],
  loading: boolean
};

type Topics = 'Misc' | 'General' | 'Releases' | 'Cllecting' | 'Concerts' | 'Rock/Blues' | 'Pop/Dance' | 'Metal/Hard Rock' | 'Jazz' | 'Classical' | 'Electronic' | 'Country/Folk' | 'Soul/Rap' | 'Alternative'

export type Post = {
  _id: string,
  postedBy: {
    userId: string,
    username: string
  },
  title: string,
  content: string,
  topic: Topics,
  postDate: string,
  lastEditDate: string,
  score: number
}