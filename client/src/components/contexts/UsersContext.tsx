import { createContext, useEffect, useReducer } from 'react';
import { ChildProp, User, UsersContextTypes } from '../../types';

type ActionTypes = 
{ type: 'setUser', data: Omit<User, 'password'> }

const reducer = (state: Omit<User, 'password'>, action: ActionTypes) => {
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

  const loginUser = async (loginData: Pick<User, 'email' | 'password'>) => {
    const Back_Response = await fetch(`http://localhost:5500/users/login`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(loginData)
    })
      .then(res => {
        console.log(res.headers.get('Authorization'));
        return res.json();
      });
  };

  useEffect(() => {
    // fetchUser();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        loggedInUser
      }}
    >
      { children }
    </UsersContext.Provider>
  )
}

export { UsersProvider };
export default UsersContext;