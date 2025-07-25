import { createContext, useEffect, useReducer, useRef, useState } from "react";

import { ChildProp, FilterStringTypes, Post, PostsContextReducerActionTypes, PostsContextTypes } from "../../types";

const reducer = (state: Post[], action: PostsContextReducerActionTypes) => {
  switch(action.type){
    case 'setPosts':
      return action.data;
    case 'updateUsernameInPosts':
      return state.map(post =>
        post.postedBy.userId === action.userId ?
        { ...post, postedBy: { ...post.postedBy, username: action.updatedUsername } }:
        post
      );
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
  const [filteredDataCount, setFilteredDataCount] = useState(0);
  const currentPage = useRef(1);
  const pageSize = useRef(8);

  // FILTER/SORT
  const resetFilterAndSort = () => {
    filterString.current = '';
    sortString.current = '';
    currentPage.current = 1;
    fetchPosts();
    getFilteredDataCount();
  };

  const handleFilter = (values: FilterStringTypes) => {
    const filterParams = [];
    if(values.topic){
      filterParams.push(`filter_topic=${values.topic}`);
    };
    if(values.title){
      filterParams.push(`filter_title=${values.title}`);
    };
    if(values.replied){
      filterParams.push(`filter_replyCount_gte=1`);
    };
    filterString.current = filterParams.join('&');
    currentPage.current = 1;
    fetchPosts();
    getFilteredDataCount();
  };

  const handleSort = (e: React.MouseEvent<HTMLButtonElement>) => {
    sortString.current = `${(e.currentTarget as HTMLButtonElement).value}`;
    currentPage.current = 1;
    fetchPosts();
  };

  // PAGINATION
  const changePage = (newPage: number) => {
    currentPage.current = newPage;
    fetchPosts();
  }

  const getFilteredDataCount = () => {
    fetch(`http://localhost:5500/posts/get/count?${filterString.current}`)
      .then(res => res.json())
      .then(data => setFilteredDataCount(data.count));
  };

  // NEW POST
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

    fetchPosts();
    getFilteredDataCount();

    return { success: Back_Response.success };

  };

  // EDIT POST
  const editPost = async (editedPost: Pick<Post, 'title' | 'content' | 'topic'>, id: string) => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:5500/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(editedPost)
    });

    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Editing failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const Back_Response = await res.json();

    fetchPosts();

    return { success: Back_Response };
  };

  const scorePost = async (postId: string, plusOrMinus: string) => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:5500/posts/${postId}/score`, {
      method: "PATCH",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ plusOrMinus })
    });

    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Scoring failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const Back_Response = await res.json();

    return { success: Back_Response };
  };

  // DELETE POST
  const deletePost = async (id: string) => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:5500/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Deletion failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const Back_Response = await res.json();

    fetchPosts();

    return { success: Back_Response };
  };

  // UPDATE USERNAMES IN POSTS WHEN EDITING USER
  const updateUsernameInPosts = (userId: string, updatedUsername: string) => {
    dispatch({
      type: 'updateUsernameInPosts',
      userId,
      updatedUsername
    });
  };

  // GET POSTS
  const fetchPosts = () => {
    setLoading(true);
    fetch(`http://localhost:5500/posts?skip=${(currentPage.current - 1) * pageSize.current}&limit=${pageSize.current}&${filterString.current}&${sortString.current}`)
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
    getFilteredDataCount();
  }, []);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        createPost,
        handleSort,
        handleFilter,
        resetFilterAndSort,
        editPost,
        deletePost,
        updateUsernameInPosts,
        scorePost,
        filteredDataCount,
        currentPage,
        pageSize,
        changePage
      }}
    >
      { children }
    </PostsContext.Provider>
  )
}

export { PostsProvider};
export default PostsContext;