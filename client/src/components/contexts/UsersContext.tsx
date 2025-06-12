import { createContext, useEffect, useReducer } from 'react';
import { jwtDecode } from "jwt-decode";

import { ChildProp, User, UsersContextActionTypes, UsersContextTypes } from '../../types';

const reducer = (state: Omit<User, 'password'> | null, action: UsersContextActionTypes) => {
  switch(action.type){
    case 'setUser':
      return action.userData;
    case 'logoutUser':
      return null;
    case 'registerUser':
      return action.userData;
    default:
      return state;
  };
};

const UsersContext = createContext<UsersContextTypes | undefined>(undefined);
const UsersProvider = ({ children }: ChildProp) => {

  const [loggedInUser, dispatch] = useReducer(reducer, null);

  type LoginResponse = { error: string } | { success: string, userData: Omit<User, 'password'> };

  // decode user from jwt token, so that input initial values is displayed after refresh (the context resets on refresh and erases the input values)
  const decodeUserFromToken = (): Omit<User, "_id" | "password" | "role"> | null => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if(!accessToken){
      // return null to not throw an error in the console, when logging out
      // throw new Error('No access token found.');
      return null;
    };
    try{
      return jwtDecode(accessToken);
    } catch(err){
      throw new Error(`Invalid access token. Error: ${err}. `);
    };
  };

  // LOGIN
  const loginUser = async (userData: Pick<User, 'email' | 'password'>, stayLoggedIn: boolean) => {
    const res = await fetch(`http://localhost:5500/users/login`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(userData)
    });

    // error handling in browser console
    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Login failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const authorizationHeader = res.headers.get('Authorization');
    if(authorizationHeader){
      if(stayLoggedIn){
        localStorage.setItem('accessToken', authorizationHeader);
      } else {
        sessionStorage.setItem('accessToken', authorizationHeader);
      };
    };

    const Back_Response: LoginResponse = await res.json();

    if('error' in Back_Response){
      return { error: Back_Response.error };
    };

    dispatch({
      type: 'setUser',
      userData: Back_Response.userData
    });

    return { success: Back_Response.success };
  };

  // REGISTRATION
  type RegistrationResponse = { error: string } | { success: string, userData: User };

  const registerUser = async (userData: Omit<User, '_id'>, stayLoggedIn: boolean) => {
    const res = await fetch(`http://localhost:5500/users/register`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(userData)
    });

    // error handling in browser console
    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Registration failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const authorizationHeader = res.headers.get('Authorization');
    if(authorizationHeader){
      if(stayLoggedIn){
        localStorage.setItem('accessToken', authorizationHeader);
      } else {
        sessionStorage.setItem('accessToken', authorizationHeader);
      };
    };

    const Back_Response: RegistrationResponse = await res.json();

    if('error' in Back_Response){
      return { error: Back_Response.error };
    };

    dispatch({
      type: 'registerUser',
      userData: Back_Response.userData
    });

    return { success: Back_Response.success };
  };

  // EDIT
  const editUser = async (userData: Omit<User, '_id' | 'role'>, id: string) => {
    const res = await fetch(`http://localhost:5500/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(userData)
    });

    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Edit failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const Back_Response = await res.json();

    if(Back_Response.updatedToken){
      localStorage.setItem('accessToken', Back_Response.updatedToken);
    };

    dispatch({
      type: 'setUser',
      userData: Back_Response.userData
    });

    return { success: Back_Response.success };
  };

  // RETRIEVE ID
  const getUserId = async () => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if(!accessToken){
      // throw new Error('No token exists.');
      return { error: 'No token exists.' };
    };
    const res = await fetch(`http://localhost:5500/users/getId`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Failed to get ID. Error: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const Back_Response = await res.json();
    return { id: Back_Response.id };
  };

  // LOGOUT
  const logoutUser = () => {
    dispatch({
      type: 'logoutUser'
    });
    localStorage.removeItem('accessToken');
  }

  // AUTO LOGIN
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if(accessToken){
      fetch(`http://localhost:5500/users/autoLogin`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if('error' in data){
            console.error('Error: ', data.error);
            localStorage.removeItem('accessToken');
          } else {
            console.log('Session resumed');
            dispatch({
              type: 'setUser',
              userData: data.userData
            });
          };
        });
    };
  }, []);

  return (
    <UsersContext.Provider
      value={{
        loggedInUser,
        loginUser,
        logoutUser,
        registerUser,
        decodeUserFromToken,
        getUserId,
        editUser,
        dispatch
      }}
    >
      { children }
    </UsersContext.Provider>
  )
}

export { UsersProvider };
export default UsersContext;