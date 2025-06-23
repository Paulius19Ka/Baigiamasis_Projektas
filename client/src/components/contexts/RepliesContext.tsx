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

  // POST REPLY
  const postReply = async (newReply: Pick<Reply, "reply">, userId: string, postId: string) => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const readyToSendReply = { ...newReply, userId };
    const res = await fetch(`http://localhost:5500/posts/${postId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(readyToSendReply)
    });

    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Posting a new reply failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const Back_Response = await res.json();

    if('error' in Back_Response){
      return { error: Back_Response.error };
    };

    fetchReplies(postId);

    return { success: Back_Response.success };
  };

  // EDIT REPLY
  const editReply = async (editedReply: Pick<Reply, 'reply'>, replyId: string, postId: string) => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:5500/replies/${replyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(editedReply)
    });

    if(!res.ok){
      const errorResponse = await res.json();
      console.error(`Editing failed: ${errorResponse.error}`);
      return { error: errorResponse.error };
    };

    const Back_Response = await res.json();

    fetchReplies(postId);

    return { success: Back_Response.success };
  };

  // DELETE REPLY
  const deleteReply = async (replyId: string, postId: string) => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:5500/replies/${replyId}`, {
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

    fetchReplies(postId);

    return { success: Back_Response.success };
  };

  // GET REPLIES
  const fetchReplies = (id: string) => {
    // clear replies, to avoid showing replies on unrelated posts
    dispatch({
      type: 'setReplies',
      data: []
    });
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
        fetchReplies,
        postReply,
        editReply,
        deleteReply
      }}
    >
      { children }
    </RepliesContext.Provider>
  )
}

export { RepliesProvider};
export default RepliesContext;