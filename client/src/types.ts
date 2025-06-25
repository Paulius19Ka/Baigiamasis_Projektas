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
  decodeUserFromToken: () => Omit<User, "password" | "role"> | null,
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
  dispatch: React.ActionDispatch<[action: UsersContextActionTypes]>,
  savePost: (postId: string, savePost: boolean) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  justLoggedIn: boolean,
  setJustLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
};

export type Gender = 'male'| 'female' | 'other';

export type User = {
  _id: string,
  email: string,
  username: string,
  password: string,
  gender: Gender,
  role: 'admin' | 'user',
  avatar: string,
  savedPosts: string[]
};

// INPUT FIELD

export type InputFieldPropTypes = {
  inputType: 'text' | 'email' | 'password' | 'checkbox' | 'radio' | 'url' | 'textarea' | 'select',
  inputName: string,
  inputId: string,
  inputValue: string,
  inputOnChange: React.ChangeEventHandler<HTMLInputElement>,
  inputOnBlur: React.FocusEventHandler<HTMLInputElement>,
  labelHtmlFor: string,
  labelText: string,
  errors: string | undefined,
  touched: boolean | undefined,
  inputPlaceholder?: string | '',
  radioOps?: string[],
  selectOps?: string[]
};

// POSTS

export type PostsContextReducerActionTypes =
{ type: 'setPosts', data: Post[] } |
{ type: 'updateUsernameInPosts', updatedUsername: string, userId: string };

export type PostsContextTypes = {
  posts: Post[],
  loading: boolean,
  createPost: (newPost: Pick<Post, "title" | "content" | "topic">, userId: string) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  handleSort: (e: React.MouseEvent<HTMLButtonElement>) => void,
  handleFilter: (values: FilterStringTypes) => void,
  resetFilterAndSort: () => void,
  editPost: (editedPost: Pick<Post, "title" | "content" | "topic">, id: string) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  deletePost: (id: string) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  updateUsernameInPosts: (userId: string, updatedUsername: string) => void,
  scorePost: (postId: string, plusOrMinus: string) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  filteredDataCount: number,
  currentPage: React.RefObject<number>,
  pageSize: React.RefObject<number>,
  changePage: (newPage: number) => void
};

export type FilterStringTypes = {
  title: string,
  topic: string,
  replied: boolean
};

export type Topics = 'Misc' | 'General' | 'Releases' | 'Collecting' | 'Concerts' | 'Rock-Blues' | 'Pop-Dance' | 'Metal-Hard Rock' | 'Jazz' | 'Classical' | 'Electronic' | 'Country-Folk' | 'Soul-Rap' | 'Alternative' | '';

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
  score: number,
  replyCount: number
};

// REPLIES

export type Reply = {
  userId: string,
  reply: string,
  replyDate: string,
  lastEditDate? : string
  replyId: string,
  username: string,
  avatar: string
};

export type RepliesContextReducerActionTypes = 
{ type: 'setReplies', data: Reply[] };

export type RepliesContextTypes = {
  replies: Reply[],
  loading: boolean,
  fetchReplies: (id: string) => void,
  postReply: (newReply: Pick<Reply, "reply">, userId: string, postId: string) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  editReply: (editedReply: Pick<Reply, "reply">, replyId: string, postId: string) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  deleteReply: (replyId: string, postId: string) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: string;
    error?: undefined;
  }>,
  clearReplies: () => void
};

// THEME

export type ThemeContextTypes = {
  theme: string,
  themeToggle: () => void
};