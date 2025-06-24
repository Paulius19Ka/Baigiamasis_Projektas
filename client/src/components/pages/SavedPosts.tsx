import { useContext, useEffect, useRef, useState } from "react";
import PostsContext from "../contexts/PostsContext";
import { Post, PostsContextTypes, UsersContextTypes } from "../../types";
import UsersContext from "../contexts/UsersContext";
import PostCard from "../UI/molecules/PostCard";

const SavedPosts = () => {

  const { posts, loading } = useContext(PostsContext) as PostsContextTypes;
  const { decodeUserFromToken } = useContext(UsersContext) as UsersContextTypes;
  
  const decodedUser = decodeUserFromToken();
  const savedPostsIDs = useRef<string[]>(decodedUser?.savedPosts || []);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if(posts.length){
      const saved = posts.filter(post => savedPostsIDs.current.includes(post._id));
      if(!saved.length){
        setMessage('No saved posts...');
      } else{
        setMessage('');
      };
      setSavedPosts(saved);
    };
  }, [posts]);


  return (
    <section>
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
    </section>
  );
}
 
export default SavedPosts;