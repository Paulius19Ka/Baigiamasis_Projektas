import { createContext, useEffect, useReducer, useState } from "react";

import { ChildProp, Post, PostsContextReducerActionTypes, PostsContextTypes } from "../../types";

const reducer = (state: Post[], action: PostsContextReducerActionTypes) => {
  switch(action.type){
    case 'setPosts':
      return action.data;
    default:
      return state;
  };
};

const PostsContext = createContext<PostsContextTypes | undefined>(undefined);
const PostsProvider = ({ children }: ChildProp) => {

  const [posts, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`http://localhost:5500/posts`)
      .then(res => res.json())
      .then((data: Post[]) => {
        dispatch({
          type: 'setPosts',
          data
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading
      }}
    >
      { children }
    </PostsContext.Provider>
  )
}

export { PostsProvider};
export default PostsContext;