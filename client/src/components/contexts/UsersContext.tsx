import { createContext, useEffect, useReducer } from 'react';
import { ChildProp, User, UsersContextTypes } from '../../types';

type ActionTypes = 
{ type: 'setUser', data: Omit<User, 'password'> }

const reducer = (state: Omit<User, 'password'> | null, action: ActionTypes) => {
  switch(action.type){
    case 'setUser':
      return action.data;
    default:
      return state;
  };
};

const UsersContext = createContext<UsersContextTypes | undefined>(undefined);
const UsersProvider = ({ children }: ChildProp) => {

  const [loggedInUser, dispatch] = useReducer(reducer, null);

  type LoginResponse = { error: string } | { success: string, loginData: Omit<User, 'password'> };

  const loginUser = async (loginData: Pick<User, 'email' | 'password'>) => {
    const res = await fetch(`http://localhost:5500/users/login`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(loginData)
    });

    // error handling in browser console
    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Login failed: ${errorResponse.error}`);
      return { error: `Error: ${res.status}` };
    };

    const authorizationHeader = res.headers.get('Authorization');
    if(authorizationHeader){
      localStorage.setItem('accessToken', authorizationHeader);
    };

    const Back_Response: LoginResponse = await res.json();

    if('error' in Back_Response){
      return { error: Back_Response.error };
    };

    dispatch({
      type: 'setUser',
      data: Back_Response.loginData
    });

    return { success: Back_Response.success };
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
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
              data
            });
          };
        });
    };
  }, []);

  return (
    <UsersContext.Provider
      value={{
        loggedInUser,
        loginUser
      }}
    >
      { children }
    </UsersContext.Provider>
  )
}

export { UsersProvider };
export default UsersContext;