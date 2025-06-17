import { createContext, useEffect, useReducer, useRef, useState } from "react";

import { ChildProp, FilterStringTypes, Post, PostsContextReducerActionTypes, PostsContextTypes } from "../../types";

const reducer = (state: Post[], action: PostsContextReducerActionTypes) => {
  switch(action.type){
    case 'setPosts':
      return action.data;
    // case 'addPost':
    //   return [...state, action.newPost];
    default:
      return state;
  };
};

const PostsContext = createContext<PostsContextTypes | undefined>(undefined);
const PostsProvider = ({ children }: ChildProp) => {

  const [posts, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);
  const sortString = useRef('');
  const filterString = useRef('');

  const resetFilterAndSort = () => {
    filterString.current = '';
    sortString.current = '';
    fetchPosts();
  };

  const handleFilter = (values: FilterStringTypes) => {
    const filterParams = [];
    if(values.topic){
      filterParams.push(`filter_topic=${values.topic}`);
    };
    filterString.current = filterParams.join('&');
    fetchPosts();
  };

  const handleSort = (e: React.MouseEvent<HTMLButtonElement>) => {
    sortString.current = `${(e.target as HTMLButtonElement).value}`;
    fetchPosts();
  };

  const createPost = async (newPost: Pick<Post, "title" | "content" | "topic">, userId: string) => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const readyToSendPost = { ...newPost, userId };
    const res = await fetch(`http://localhost:5500/posts`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(readyToSendPost)
    });

    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Creating a new post failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const Back_Response = await res.json();

    if('error' in Back_Response){
      return { error: Back_Response.error };
    };

    // dispatch({
    //   type: 'addPost',
    //   newPost: readyToSendPost
    // });

    fetchPosts();

    return { success: Back_Response.success };

  };

  const fetchPosts = () => {
    setLoading(true);
    fetch(`http://localhost:5500/posts?${filterString.current}&${sortString.current}`)
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
        loading,
        createPost,
        handleSort,
        handleFilter,
        resetFilterAndSort
      }}
    >
      { children }
    </PostsContext.Provider>
  )
}

export { PostsProvider};
export default PostsContext;