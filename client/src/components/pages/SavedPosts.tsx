import { useContext, useEffect, useRef, useState } from "react";
import PostsContext from "../contexts/PostsContext";
import { Post, PostsContextTypes, UsersContextTypes } from "../../types";
import UsersContext from "../contexts/UsersContext";
import PostCard from "../UI/molecules/PostCard";
import styled from "styled-components";

const StyledSection = styled.section`
  
  > div.posts{
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  @media (min-width: 768px){
  > div.posts{
    width: 80%;
    margin: auto;
    margin-top: 20px;
    gap: 20px;
  }
  }

  @media (min-width: 1024px){
    > div.posts{
      width: unset;
    }
  }
`;

const SavedPosts = () => {

  const { loading } = useContext(PostsContext) as PostsContextTypes;
  const { decodeUserFromToken } = useContext(UsersContext) as UsersContextTypes;
  
  const decodedUser = decodeUserFromToken();
  const savedPostsIDs = useRef<string[]>(decodedUser?.savedPosts || []);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');

  const refetchPosts = async () => {
    const Response = await fetch(`http://localhost:5500/posts`);
    const allPosts: Post[] = await Response.json();
    const saved = allPosts.filter(post => savedPostsIDs.current.includes(post._id));
    if(!saved.length){
      setMessage('No saved posts...');
    } else{
      setMessage('');
    };
    setSavedPosts(saved);
  };

  useEffect(() => {
    refetchPosts();
  }, []);

  useEffect(() => {
    document.title = `Saved Posts \u2666 MusicForum`;
  }, []);

  return (
    <StyledSection>
      <h2>Saved Posts</h2>
      <div className="posts">
        {
          loading ? <p>Loading posts...</p> :
          savedPosts.length ?
          savedPosts?.map((post, i) =>
            post._id ?
            <PostCard key={post._id} post={post} /> :
            <p key={i}>Post not found.</p>
          ) : <p>{message}</p>
        }
      </div>
    </StyledSection>
  );
}
 
export default SavedPosts;