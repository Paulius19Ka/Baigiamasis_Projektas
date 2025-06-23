import { createContext, useReducer, useState } from "react";

import { ChildProp, RepliesContextReducerActionTypes, RepliesContextTypes, Reply } from "../../types";

const reducer = (state: Reply[], action: RepliesContextReducerActionTypes) => {
  switch(action.type){
    case 'setReplies':
      return action.data;
    default:
      return state;
  };
};

const RepliesContext = createContext<RepliesContextTypes | undefined>(undefined);
const RepliesProvider = ({ children }: ChildProp) => {

  const [replies, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);

  const fetchReplies = (id: string) => {
    setLoading(true);
    fetch(`http://localhost:5500/posts/${id}/replies`)
      .then(res => res.json())
      .then((data: Reply[]) => {
        dispatch({
          type: 'setReplies',
          data
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <RepliesContext.Provider
      value={{
        replies,
        loading,
        fetchReplies
      }}
    >
      { children }
    </RepliesContext.Provider>
  )
}

export { RepliesProvider};
export default RepliesContext;